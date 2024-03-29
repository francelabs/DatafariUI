import produce from 'immer';
import qs from 'qs';
import { useCallback, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import { FILL_FROM_URL_PARAMS, QueryContext } from '../Contexts/query-context';
import { DEFAULT_RESULT, ResultsContext, SET_RESULTS } from '../Contexts/results-context';
import useHttp from './useHttp';

const useDatafari = () => {
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const baseURL = apiEndpointsContext.searchURL;
  const {
    dispatch: queryDispatch,
    buildSearchQueryString,
    buildParamsForURL,
  } = useContext(QueryContext);
  const { dispatch: resultsDispatch } = useContext(ResultsContext);
  const history = useHistory();
  const location = useLocation();

  const { isLoading, error, data, sendRequest } = useHttp();

  /**
   * The buildQueryString function will change anytime an element in the query
   * object change, effectively matking this function beeing rebuilt too.
   */
  const makeRequest = useCallback(() => {
    let urlParamsString = qs.stringify(buildParamsForURL(), {
      addQueryPrefix: true,
    });
    if (history.location.search !== urlParamsString) {
      const newLocation = produce(history.location, (locationDraft) => {
        locationDraft.search = urlParamsString;
        locationDraft.pathname = '/search';
      });

      history.push(newLocation);
    }
    const queryString = buildSearchQueryString();
    sendRequest(baseURL + '/select?' + queryString, 'GET', null);
  }, [history, buildSearchQueryString, sendRequest, baseURL, buildParamsForURL]);

  const prepareAndSetQueryFacets = useCallback((queryFacetsResult, newResults) => {
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
  }, []);

  const prepareAndSetRangeFacets = useCallback((rangeFacetsResult, newResults) => {
    const rangeFacets = {};
    for (const facetKey in rangeFacetsResult) {
      rangeFacets[facetKey] = {};
      const currentRangeFacetResult = rangeFacetsResult[facetKey];
      for (let index = 0; index < currentRangeFacetResult.counts.length; index += 2) {
        rangeFacets[facetKey][currentRangeFacetResult.counts[index]] =
          currentRangeFacetResult.counts[index + 1];
      }
    }
    newResults.rangeFacets = rangeFacets;
  }, []);

  /**
   * Everytime the makeRequest function changes, we need to execute the
   * new available request. But to avoid unnecessary request calls (some
   * UI intercation may lead to several query changes not happening in one
   * update of the query object), we wait 150ms before sending off the request.
   * If the query object is changed during that time, the makeRequest function will
   * change too, effectively calling this effect again, cancelling the previous
   * timeout and setting up a new one.
   */
  useEffect(() => {
    const newRequest = setTimeout(() => {
      makeRequest();
    }, 150);
    return () => clearTimeout(newRequest);
  }, [makeRequest]);

  useEffect(() => {
    if (location.pathname === '/search') {
      let urlParamsString = qs.stringify(buildParamsForURL(), {
        addQueryPrefix: true,
      });
      if (urlParamsString === '?') {
        urlParamsString = '';
      }
      if (location.search !== urlParamsString) {
        queryDispatch({
          type: FILL_FROM_URL_PARAMS,
          params: qs.parse(location.search, { ignoreQueryPrefix: true }),
        });
      }
    }
    // I explicitly want this effect to happen only when the URL changes.
    // It is made to update internal states upon URL changes when applicable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /**
   * Effect getting the results from the request and managing the loading state.
   */
  useEffect(() => {
    let newResults = {};
    newResults.isLoading = isLoading;
    newResults.error = error;
    if (!isLoading && !error && data && data.response) {
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
          if (data.facet_counts.facet_ranges) {
            prepareAndSetRangeFacets(data.facet_counts.facet_ranges, newResults);
          }
        }
        newResults.numFound = data.response.numFound;
        newResults.rows = parseInt(data.responseHeader.params.rows, 10);
        newResults.start = data.response.start;
      }
      if (data.spellcheck && data.spellcheck.collations && data.spellcheck.collations.length > 0) {
        const spellcheck = {};
        spellcheck.collation = data.spellcheck.collations[1];
        newResults.spellcheck = spellcheck;
      }

      // Extract promolinks
      if (Array.isArray(data.promolinkSearchComponent)) {
        newResults.promolinks = [...data.promolinkSearchComponent];
      }
    }
    resultsDispatch({ type: SET_RESULTS, results: newResults });
  }, [isLoading, data, error, prepareAndSetQueryFacets, resultsDispatch, prepareAndSetRangeFacets]);

  return {
    makeRequest,
    buildSearchQueryString,
    isLoading,
    error,
  };
};

export default useDatafari;
