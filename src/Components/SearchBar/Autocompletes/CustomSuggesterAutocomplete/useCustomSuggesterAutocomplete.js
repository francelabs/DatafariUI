import { useCallback, useContext, useEffect, useState } from 'react';
import { APIEndpointsContext } from '../../../../Contexts/api-endpoints-context';
import useHttp from '../../../../Hooks/useHttp';

const useCustomSuggesterAutocomplete = ({ op, suggester, maxSuggestion, title, subtitle }) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);

  const [queryID, setQueryID] = useState(null);
  const [queryText, setQueryText] = useState(null);

  const querySuggestions = useCallback(
    (queryText) => {
      setSuggestions([]);
      setQueryText(queryText);

      let newQueryID = Math.random().toString(36).substring(2, 15);
      setQueryID(newQueryID);
      sendRequest(
        `${apiEndpointsContext.searchURL}/${suggester}?action=suggest&q=${queryText}&autocomplete=true&spellcheck.collateParam.q.op=${op}`,
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
      if (!error && data && reqIdentifier === queryID && !data.error && data.suggest) {
        const suggestObject = data.suggest;
        const suggestions = [];
        Object.entries(suggestObject).forEach(([, suggestionsObject]) => {
          if (
            suggestionsObject[queryText] &&
            Array.isArray(suggestionsObject[queryText].suggestions)
          ) {
            const extractedSuggestions = suggestionsObject[queryText].suggestions
              .filter((element) => {
                return element.term && typeof element.term === 'string';
              })
              .map((element) => {
                return element.term;
              });
            suggestions.push(...extractedSuggestions);
          }
        });
        const newSuggestions = suggestions.slice(0, maxSuggestion ? maxSuggestion : -1);
        setSuggestions(newSuggestions);
      }
    }
  }, [data, error, isLoading, setSuggestions, reqIdentifier, queryID, queryText, maxSuggestion]);

  const onSelect = useCallback((value, onSelect) => {
    if (onSelect) {
      onSelect(value);
    }
  }, []);

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

export default useCustomSuggesterAutocomplete;
