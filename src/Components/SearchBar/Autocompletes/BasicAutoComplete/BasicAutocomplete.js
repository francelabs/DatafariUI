import React, { useContext, useEffect, useState } from 'react';
import { MenuItem, ListSubheader, Typography, Divider, makeStyles } from '@material-ui/core';
import useHttp from '../../../../Hooks/useHttp';
import { APIEndpointsContext } from '../../../../Contexts/api-endpoints-context';
import { useTranslation } from 'react-i18next';
import {  UIConfigContext } from '../../../../Contexts/ui-config-context';

const useStyles = makeStyles((theme) => ({
  autocompleteTitleContainer: {
    display: 'flex',
  },

  autocompleteTitle: {
    flexGrow: 1,
  },
}));

const SimpleAutocomplete = (props) => {
  const { t } = useTranslation();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryID, setQueryID] = useState(null);
  const classes = useStyles();

  const { uiDefinition } = useContext(UIConfigContext);
  const aggregator = uiDefinition?.searchBar?.suggesters[0]?.aggregator;

  useEffect(() => {
    if (props.active) {
      setSuggestions([]);
      setLoading(true);
      let newQueryID = Math.random().toString(36).substring(2, 15);
      setQueryID(newQueryID);
      sendRequest(
        `${aggregator ? apiEndpointsContext.searchURL + '/noaggregator/suggest' : apiEndpointsContext.searchURL + '/suggest'}?action=suggest&q=${props.queryText}&autocomplete=true&spellcheck.collateParam.q.op=${props.op}`,
        'GET',
        null,
        newQueryID
      );
    }
  }, [apiEndpointsContext.searchURL, props, sendRequest, setSuggestions]);

  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === queryID) {
      if (!data.error && data.spellcheck && data.spellcheck.collations) {
        const newSuggestions = data.spellcheck.collations
          .filter((element) => {
            return element && element !== 'collation' && element.collationQuery;
          })
          .map((element) => {
            return element.collationQuery;
          })
          .slice(0, props.maxSuggestion ? props.maxSuggestion : -1);
        setSuggestions(newSuggestions);
      }
      setLoading(false);
    }
  }, [data, error, isLoading, setSuggestions, reqIdentifier, queryID, props.maxSuggestion]);

  return (
    props.active &&
    !loading &&
    suggestions &&
    suggestions.length !== 0 && (
      <>
        <ListSubheader className={classes.autocompleteTitleContainer} disableSticky={true}>
          <Typography className={classes.autocompleteTitle}>{t('SUGGESTED QUERIES')}</Typography>
          <Typography>{t('Queries extending your current query terms')}</Typography>
        </ListSubheader>
        <Divider />
        {suggestions &&
          suggestions.length > 0 &&
          suggestions.map((element, index) => (
            <MenuItem
              key={'SimpleAutocomplete_element_' + index}
              onClick={() => {
                if (props.onSelect) {
                  props.onSelect(element);
                }
              }}>
              {element}
            </MenuItem>
          ))}
      </>
    )
  );
};

export default SimpleAutocomplete;
