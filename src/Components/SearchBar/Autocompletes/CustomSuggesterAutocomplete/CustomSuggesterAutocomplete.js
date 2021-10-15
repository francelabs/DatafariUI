import React, { useContext, useEffect, useState } from 'react';
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

const useStyles = makeStyles((theme) => ({
  autocompleteTitleContainer: {
    display: 'flex',
  },

  autocompleteTitle: {
    flexGrow: 1,
  },
}));

const CustomSuggesterAutocomplete = (props) => {
  const { suggester, queryText, op, active, maxSuggestion, onSelect } = props;
  const { t } = useTranslation();
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryID, setQueryID] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (active) {
      setSuggestions([]);
      setLoading(true);
      let newQueryID = Math.random().toString(36).substring(2, 15);
      setQueryID(newQueryID);
      sendRequest(
        `${apiEndpointsContext.searchURL}/${suggester}?action=suggest&q=${queryText}&autocomplete=true&spellcheck.collateParam.q.op=${op}`,
        'GET',
        null,
        newQueryID
      );
    }
  }, [
    active,
    apiEndpointsContext.searchURL,
    op,
    queryText,
    sendRequest,
    setSuggestions,
    suggester,
  ]);

  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === queryID) {
      if (!data.error && data.suggest) {
        const suggestObject = data.suggest;
        const suggestions = [];
        Object.entries(suggestObject).forEach(([, suggestionsObject]) => {
          if (
            suggestionsObject[queryText] &&
            Array.isArray(suggestionsObject[queryText].suggestions)
          ) {
            const extractedSuggestions = suggestionsObject[
              queryText
            ].suggestions
              .filter((element) => {
                return element.term && typeof element.term === 'string';
              })
              .map((element) => {
                return element.term;
              });
            suggestions.push(...extractedSuggestions);
          }
        });
        const newSuggestions = suggestions.slice(
          0,
          maxSuggestion ? maxSuggestion : -1
        );
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
    maxSuggestion,
    queryText,
  ]);

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
              {t('SUGGESTED QUERIES')}
            </Typography>
            <Typography>
              {t('Queries extending your current query terms')}
            </Typography>
          </ListSubheader>
          <Divider />
          {suggestions &&
            suggestions.length > 0 &&
            suggestions.map((element) => (
              <MenuItem
                onClick={() => {
                  if (onSelect) {
                    onSelect(element);
                  }
                }}
              >
                {element}
              </MenuItem>
            ))}
        </>
      )
    ))
  );
};

export default CustomSuggesterAutocomplete;
