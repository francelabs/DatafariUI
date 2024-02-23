import { useCallback, useContext, useEffect, useState } from 'react';
import { APIEndpointsContext } from '../../../../Contexts/api-endpoints-context';
import { ResultsContext } from '../../../../Contexts/results-context';
import useHttp from '../../../../Hooks/useHttp.js';
import {  UIConfigContext } from '../../../../Contexts/ui-config-context';
import { useLocation } from 'react-router-dom';

const useBasicAutocomplete = ({ op, maxSuggestion, title, subtitle }) => {
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);

  const [queryID, setQueryID] = useState(null);
  const [queryText, setQueryText] = useState(null);

  const location = useLocation();
  const [aggregatorValue, setAggregatorValue] = useState('');

  const { results } = useContext(ResultsContext);

  const { uiDefinition } = useContext(UIConfigContext);
  const aggregator = uiDefinition?.searchBar?.suggesters[0]?.aggregator; 
    
  useEffect(() => {
    const paramsURL = new URLSearchParams(location.search);
    const aggregator = paramsURL.get('aggregator[0]');
    setAggregatorValue(aggregator);
  }, [location]); 

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
      sendRequest(
        `${aggregator ? apiEndpointsContext.searchURL + '/noaggregator/suggest' :apiEndpointsContext.searchURL + '/suggest'}?action=suggest&q=${queryText}&autocomplete=true&spellcheck.collateParam.q.op=${op}${aggregatorValue ? '&aggregator=' + aggregatorValue : ''}`,
        'GET',
        null,
        newQueryID
      );
    },
    [apiEndpointsContext.searchURL, op, sendRequest, aggregatorValue]
  );

  // Handle response from querySuggestions
  useEffect(() => {
    if (!isLoading) {
      if (!error && data && reqIdentifier === queryID) {
        let newSuggestions = [];
        if (!data.error && data.spellcheck && data.spellcheck.collations) {
          newSuggestions = data.spellcheck.collations
            .filter((element) => {
              return element && element !== 'collation' && element.collationQuery;
            })
            .map((element) => {
              return element.collationQuery;
            })
            .slice(0, maxSuggestion ?? -1);
        }
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

export default useBasicAutocomplete;
