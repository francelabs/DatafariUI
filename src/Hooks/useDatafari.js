import { useContext, useEffect, useCallback } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';

import { QueryContext } from '../Contexts/query-context';
import {
  ResultsContext,
  SET_RESULTS,
  DEFAULT_RESULT,
} from '../Contexts/results-context';
import useHttp from './useHttp';

const useDatafari = () => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const baseURL = apiEndpointsContext.searchURL;
  const { buildSearchQueryString } = useContext(QueryContext);
  const { dispatch: resultsDispatch } = useContext(ResultsContext);

  const { isLoading, error, data, sendRequest } = useHttp();

  const makeRequest = useCallback(() => {
    const queryString = buildSearchQueryString();
    sendRequest(baseURL + '/select?' + queryString, 'GET', null);
  }, [buildSearchQueryString, sendRequest, baseURL]);

  const prepareAndSetQueryFacets = useCallback(
    (queryFacetsResult, newResults) => {
      const result = {};
      for (const key in queryFacetsResult) {
        const splitKey = key.split('_');
        const queryIndex = splitKey.splice(-1, 1);
        const facetId = splitKey.join('_');
        if (!result[facetId]) {
          result[facetId] = {};
        }
        result[facetId][queryIndex] = queryFacetsResult[key];
      }
      newResults.queryFacets = result;
    },
    []
  );

  useEffect(() => {
    const newRequest = setTimeout(() => {
      makeRequest();
    }, 150);
    return () => clearTimeout(newRequest);
  }, [makeRequest]);

  useEffect(() => {
    let newResults = {};
    newResults.isLoading = isLoading;
    newResults.error = error;
    if (!isLoading && !error && data) {
      newResults = { ...newResults, ...DEFAULT_RESULT };
      if (data.response.docs && data.response.docs.length > 0) {
        if (data.response.docs && data.response.docs.map) {
          newResults.results = data.response.docs.map((result) => {
            result.highlighting = {};
            if (data.highlighting && data.highlighting[result.id]) {
              result.highlighting = data.highlighting[result.id];
            }
            return result;
          });
        } else {
          newResults.results = [];
        }

        if (data.facet_counts) {
          newResults.fieldFacets = data.facet_counts.facet_fields;
          prepareAndSetQueryFacets(data.facet_counts.facet_queries, newResults);
        }
        newResults.numFound = data.response.numFound;
        newResults.rows = parseInt(data.responseHeader.params.rows, 10);
        newResults.start = data.response.start;
      }
      if (
        data.spellcheck &&
        data.spellcheck.collations &&
        data.spellcheck.collations.length > 0
      ) {
        const spellcheck = {};
        spellcheck.collation = data.spellcheck.collations[1];
        newResults.spellcheck = spellcheck;
      }
    }
    resultsDispatch({ type: SET_RESULTS, results: newResults });
  }, [isLoading, data, error, prepareAndSetQueryFacets, resultsDispatch]);

  return {
    makeRequest,
    buildSearchQueryString,
    isLoading,
    error,
  };
};

export default useDatafari;
