import { useContext, useEffect, useCallback } from 'react';

import { QueryContext } from '../Contexts/query-context';
import {
  ResultsContext,
  SET_RESULTS,
  DEFAULT_RESULT,
} from '../Contexts/results-context';
import useHttp from './useHttp';

const useDatafari = () => {
  //const baseURL = '/Datafari/SearchAggregator';
  const baseURL = '/Datafari/rest/v1.0/search';
  const { query } = useContext(QueryContext);
  const { dispatch: resultsDispatch } = useContext(ResultsContext);

  const { isLoading, error, data, sendRequest } = useHttp();

  const buildQueryString = useCallback((queryParams) => {
    let result = '';
    for (const key in queryParams) {
      if (result !== '') {
        result += '&';
      }
      switch (key) {
        case 'facet.query':
        case 'facet.field':
        case 'fq':
          let currentParamString = queryParams[key].reduce(
            (accu, element, index, array) => {
              let next = accu + key + '=' + encodeURIComponent(element);
              if (index < array.length - 1) {
                next += '&';
              }
              return next;
            },
            ''
          );
          result += currentParamString;
          break;
        default:
          result += key + '=' + encodeURIComponent(queryParams[key]);
      }
    }
    return result;
  }, []);

  const prepareFieldFacets = useCallback(() => {
    const fieldFacetsParams = [];
    const selectedFieldFacets = [];
    for (const key in query.fieldFacets) {
      fieldFacetsParams.push(
        `{!ex=${query.fieldFacets[key].tag}}${query.fieldFacets[key].field}`
      );
      if (
        query.fieldFacets[key].selected &&
        query.fieldFacets[key].selected.length > 0
      ) {
        selectedFieldFacets.push(
          query.fieldFacets[key].selected.reduce(
            (accu, element, index, array) => {
              let next = accu + `${query.fieldFacets[key].field}:${element}`;
              if (index < array.length - 1) {
                next += ` ${query.fieldFacets[key].op} `;
              } else {
                next += ')';
              }
              return next;
            },
            `{!tag=${query.fieldFacets[key].tag}}(`
          )
        );
      }
    }
    return [fieldFacetsParams, selectedFieldFacets];
  }, [query.fieldFacets]);

  const prepareQueryFacets = useCallback(() => {
    let queryFacetsParams = [];
    let selectedQueryFacets = [];
    for (const key in query.queryFacets) {
      if (
        query.queryFacets[key].queries &&
        query.queryFacets[key].labels &&
        query.queryFacets[key].queries.length ===
          query.queryFacets[key].labels.length
      ) {
        const currentQueryFacetParams = query.queryFacets[key].queries.map(
          (query, index) => {
            return `{!key=${key}_${index}}${query}`;
          }
        );
        queryFacetsParams = queryFacetsParams.concat(currentQueryFacetParams);
        if (
          query.queryFacets[key].selected &&
          query.queryFacets[key].selected.length > 0
        ) {
          const currentSelectedQueries = query.queryFacets[key].selected
            .filter(
              (label) => query.queryFacets[key].labels.indexOf(label) !== -1
            )
            .map((label) => {
              const index = query.queryFacets[key].labels.indexOf(label);
              return `{!tag=${key}_${index}}${query.queryFacets[key].queries[index]}`;
            });
          selectedQueryFacets = selectedQueryFacets.concat(
            currentSelectedQueries
          );
        }
      }
    }
    return [queryFacetsParams, selectedQueryFacets];
  }, [query.queryFacets]);

  const prepareOtherFilters = useCallback(() => {
    let otherFilters = [];
    for (const key in query.filters) {
      if (query.filters[key].value) {
        otherFilters.push(query.filters[key].value);
      }
    }
    return otherFilters;
  }, [query.filters]);

  const prepareFacetsParams = useCallback(() => {
    const facetParams = {};

    // Field facets gathering
    const [fieldFacetsParams, selectedFieldFacets] = prepareFieldFacets();
    if (fieldFacetsParams.length > 0) {
      facetParams.facet = true;
      facetParams['facet.field'] = fieldFacetsParams;
      if (selectedFieldFacets.length > 0) {
        facetParams.fq = selectedFieldFacets;
      }
    }

    // Query facets gathering
    const [queryFacetsParams, selectedQueryFacets] = prepareQueryFacets();
    if (queryFacetsParams.length > 0) {
      facetParams.facet = true;
      facetParams['facet.query'] = queryFacetsParams;
      if (selectedQueryFacets.length > 0) {
        if (facetParams.fq) {
          facetParams.fq = facetParams.fq.concat(selectedQueryFacets);
        } else {
          facetParams.fq = selectedQueryFacets;
        }
      }
    }

    // Other filters gathering
    const otherFilters = prepareOtherFilters();
    if (otherFilters.length > 0) {
      if (facetParams.fq) {
        facetParams.fq = facetParams.fq.concat(otherFilters);
      } else {
        facetParams.fq = otherFilters;
      }
    }

    return facetParams;
  }, [prepareFieldFacets, prepareQueryFacets, prepareOtherFilters]);

  const makeRequest = useCallback(() => {
    const facetsParams = prepareFacetsParams();
    const queryParameters = {
      q: query.elements,
      // .map((element) => element.text.trim())
      // .join(' ')
      // .trim(),
      fl: [
        'title',
        'url',
        'id',
        'extension',
        'preview_content',
        'last_modified',
        'crawl_date',
        'author',
        'original_file_size',
        'emptied',
        'repo_source',
      ].join(','),
      sort: query.sort.value,
      'q.op': 'AND',
      rows: query.rows,
      start: (query.page - 1) * query.rows,
      ...facetsParams,
    };
    if (queryParameters.q === '') {
      queryParameters.q = '*:*';
    }

    const queryString = buildQueryString(queryParameters);
    sendRequest(baseURL + '/select?' + queryString, 'GET', null);
  }, [
    query.page,
    query.elements,
    query.sort.value,
    query.rows,
    buildQueryString,
    sendRequest,
    prepareFacetsParams,
  ]);

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
    }
    resultsDispatch({ type: SET_RESULTS, results: newResults });
  }, [isLoading, data, error, prepareAndSetQueryFacets, resultsDispatch]);

  return {
    makeRequest,
    isLoading,
    error,
  };
};

export default useDatafari;
