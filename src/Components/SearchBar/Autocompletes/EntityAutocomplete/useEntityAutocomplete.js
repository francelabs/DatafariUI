import { useCallback, useContext, useEffect, useState } from 'react';
import { APIEndpointsContext } from '../../../../Contexts/api-endpoints-context';
import useHttp from '../../../../Hooks/useHttp';
import {
  QueryContext,
  SET_ELEMENTS,
  SET_FIELD_FACET_SELECTED,
} from '../../../../Contexts/query-context';
import { ResultsContext } from '../../../../Contexts/results-context';

const useEntityAutocomplete = ({
  field,
  op,
  suggester,
  dictionary,
  asFacet,
  maxSuggestion,
  title,
  subtitle,
}) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);

  const [queryID, setQueryID] = useState(null);
  const [queryText, setQueryText] = useState(null);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);

  const { results } = useContext(ResultsContext);

  // Effect to clear suggestion when a search is performed
  useEffect(() => {
    setSuggestions([]);
  }, [results]);

  const querySuggestions = useCallback(
    (queryText) => {
      setSuggestions([]);
      setQueryText(queryText);

      let newQueryID = Math.random().toString(36).substring(2, 15);
      setQueryID(newQueryID);
      const suggesterQueryText = queryText.trim();
      // queryText.lastIndexOf(' ') === -1
      //   ? queryText
      //   : queryText.substring(queryText.lastIndexOf(' ') + 1);
      sendRequest(
        `${apiEndpointsContext.searchURL}/${suggester}?action=suggest&q=${suggesterQueryText}&autocomplete=true&spellcheck.collateParam.q.op=${op}`,
        'GET',
        null,
        newQueryID
      );
    },
    [apiEndpointsContext.searchURL, op, sendRequest, suggester]
  );

  // Handle response from querySuggestions
  useEffect(() => {
    if (!isLoading) {
      if (!error && data && reqIdentifier === queryID) {
        const suggesterQueryText =
          queryText.lastIndexOf(' ') === -1
            ? queryText
            : queryText.substring(queryText.lastIndexOf(' ') + 1);
        if (
          !data.error &&
          data.suggest &&
          data.suggest[dictionary] &&
          data.suggest[dictionary][suggesterQueryText] &&
          data.suggest[dictionary][suggesterQueryText].suggestions
        ) {
          const newSuggestions = data.suggest[dictionary][suggesterQueryText].suggestions
            .filter((element) => {
              return element && element.term;
            })
            .map((element) => {
              return `${element.term}`;
            })
            .slice(0, maxSuggestion ? maxSuggestion : -1);
          setSuggestions(newSuggestions);
        }
      }
    }
  }, [
    data,
    error,
    isLoading,
    setSuggestions,
    reqIdentifier,
    queryID,
    dictionary,
    queryText,
    maxSuggestion,
  ]);

  // OnClick handler used when text must be added to the search bar.
  // Uses the props onClick function passed by the parent.
  const onClickClassic = useCallback(
    (value, onSelect) => {
      if (onSelect) {
        let queryWithLastTermRemoved = queryText.substring(0, queryText.lastIndexOf(' '));
        queryWithLastTermRemoved =
          queryWithLastTermRemoved.length === 0
            ? queryWithLastTermRemoved
            : `${queryWithLastTermRemoved} `;
        onSelect(`${queryWithLastTermRemoved}${field}:"${value}"`);
      }

      // Synchronize with the facet if it does exist
      const selection = query.selectedFieldFacets[field] || [];
      const newSelection = selection.includes(value)
        ? selection.filter((v) => v !== value)
        : [...selection, value];

      queryDispatch({
        type: SET_FIELD_FACET_SELECTED,
        facetId: field,
        selected: newSelection,
      });
    },
    [field, query.selectedFieldFacets, queryText, queryDispatch]
  );

  // Handler when entities must be added as facet selection
  const onClickForFacet = useCallback(
    (value) => {
      if (query.fieldFacets[field]) {
        // We are building a new query, the list of selected
        // will be only the one selected in the autocomplete list
        let selected = [value];

        let queryWithLastTermRemoved = queryText.substring(0, queryText.lastIndexOf(' '));
        // Treat the selection as a new search launching.
        // Keep the text entered before the entity as the search text
        // and add the entity as a facet selection.
        // The two operations should trigger only one query to the server
        // because the system waits for the query object to not change for
        // a few hundred milliseconds before firing a query.
        queryWithLastTermRemoved =
          queryWithLastTermRemoved.length === 0
            ? queryWithLastTermRemoved
            : `${queryWithLastTermRemoved} `;
        queryDispatch({
          type: SET_ELEMENTS,
          elements: queryWithLastTermRemoved,
        });
        queryDispatch({
          type: SET_FIELD_FACET_SELECTED,
          facetId: field,
          selected: selected,
        });
      } else {
        // If facet style behavior is required whilst the facet is not declared, revert back to classic bahavior
        onClickClassic(value);
      }
    },
    [field, onClickClassic, query.fieldFacets, queryDispatch, queryText]
  );

  const onSelect = useCallback(
    (value, onSelect) => {
      if (asFacet) {
        onClickForFacet(value);
      } else {
        onClickClassic(value, onSelect);
      }
    },
    [asFacet, onClickClassic, onClickForFacet]
  );

  // Clear suggestions
  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  return {
    querySuggestions,
    onSelect,
    clearSuggestions,
    isLoading,
    suggestions,
    title,
    subtitle,
  };
};

export default useEntityAutocomplete;
