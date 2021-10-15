import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  MenuItem,
  ListSubheader,
  Typography,
  Divider,
  makeStyles,
} from '@material-ui/core';
import useHttp from '../../../../Hooks/useHttp';
import Spinner from '../../../Spinner/Spinner';
import { APIEndpointsContext } from '../../../../Contexts/api-endpoints-context';
import { useTranslation } from 'react-i18next';
import {
  QueryContext,
  SET_ELEMENTS,
  SET_FIELD_FACET_SELECTED,
} from '../../../../Contexts/query-context';

const useStyles = makeStyles((theme) => ({
  autocompleteTitleContainer: {
    display: 'flex',
  },

  autocompleteTitle: {
    flexGrow: 1,
  },
}));

const EntityAutocomplete = (props) => {
  const { t } = useTranslation();
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryID, setQueryID] = useState(null);
  const classes = useStyles();
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const {
    field,
    op,
    suggester,
    queryText,
    active,
    dictionary,
    maxSuggestion,
    asFacet,
    entityType,
    onSelect,
  } = props;

  useEffect(() => {
    if (active) {
      setSuggestions([]);
      setLoading(true);
      let newQueryID = Math.random().toString(36).substring(2, 15);
      setQueryID(newQueryID);
      const suggesterQueryText =
        queryText.lastIndexOf(' ') === -1
          ? queryText
          : queryText.substring(queryText.lastIndexOf(' ') + 1);
      sendRequest(
        `${apiEndpointsContext.searchURL}/${suggester}?action=suggest&q=${suggesterQueryText}&autocomplete=true&spellcheck.collateParam.q.op=${op}`,
        'GET',
        null,
        newQueryID
      );
    }
  }, [
    active,
    apiEndpointsContext.searchURL,
    op,
    props,
    queryText,
    sendRequest,
    setSuggestions,
    suggester,
  ]);

  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === queryID) {
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
        const newSuggestions = data.suggest[dictionary][
          suggesterQueryText
        ].suggestions
          .filter((element) => {
            return element && element.term;
          })
          .map((element) => {
            return `${element.term}`;
          })
          .slice(0, maxSuggestion ? maxSuggestion : -1);
        setSuggestions(newSuggestions);
      }
      setLoading(false);
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
    (value) => {
      return () => {
        if (onSelect) {
          let queryWithLastTermRemoved = queryText.substring(
            0,
            queryText.lastIndexOf(' ')
          );
          queryWithLastTermRemoved =
            queryWithLastTermRemoved.length === 0
              ? queryWithLastTermRemoved
              : `${queryWithLastTermRemoved} `;
          onSelect(`${queryWithLastTermRemoved}${field}:${value}`);
        }
      };
    },
    [field, onSelect, queryText]
  );

  // Handler when entities must be added as facet selection
  const onClickForFacet = useCallback(
    (value) => {
      return () => {
        if (query.fieldFacets[field]) {
          // We are building a new query, the list of selected
          // will be only the one selected in the autocomplete list
          let selected = [value];

          let queryWithLastTermRemoved = queryText.substring(
            0,
            queryText.lastIndexOf(' ')
          );
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
          onClickClassic(value)();
        }
      };
    },
    [field, onClickClassic, query.fieldFacets, queryDispatch, queryText]
  );

  return (
    active &&
    (loading ? (
      <Spinner />
    ) : (
      suggestions &&
      suggestions.length !== 0 && (
        <>
          <ListSubheader
            className={classes.autocompleteTitleContainer}
            disableSticky={true}
          >
            <Typography className={classes.autocompleteTitle}>
              {t('Suggested {{entityType}}', {
                entityType: entityType,
              })}
            </Typography>
            <Typography>
              {t('Proposed entity to add to your query', {
                entityType: entityType,
              })}
            </Typography>
          </ListSubheader>
          <Divider />
          {suggestions &&
            suggestions.length > 0 &&
            suggestions.map((element) => (
              <MenuItem
                onClick={
                  asFacet ? onClickForFacet(element) : onClickClassic(element)
                }
              >
                {element}
              </MenuItem>
            ))}
        </>
      )
    ))
  );
};

export default EntityAutocomplete;
