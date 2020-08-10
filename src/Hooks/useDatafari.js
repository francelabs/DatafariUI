import { useContext, useEffect, useCallback } from 'react';

import { QueryContext } from '../Contexts/query-context';
import { ResultsContext } from '../Contexts/results-context';
import useHttp from './useHttp';

const useDatafari = () => {
  const baseURL = '/Datafari/SearchAggregator';
  const {
    elements,
    fieldFacets,
    queryFacets,
    page,
    rows,
    setPage,
  } = useContext(QueryContext);
  const {
    setResults,
    setFieldFacets,
    setIsLoading,
    setError,
    setQueryFacets,
    setNumFound,
    numFound,
  } = useContext(ResultsContext);

  const { isLoading, error, data, sendRequest, reqIdentifer } = useHttp();

  const clearResults = useCallback(() => {
    setResults([]);
    setFieldFacets({});
    setQueryFacets({});
  }, [setFieldFacets, setResults, setQueryFacets]);

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
    for (const key in fieldFacets) {
      fieldFacetsParams.push(
        `{!ex=${fieldFacets[key].tag}}${fieldFacets[key].field}`
      );
      if (fieldFacets[key].selected && fieldFacets[key].selected.length > 0) {
        selectedFieldFacets.push(
          fieldFacets[key].selected.reduce((accu, element, index, array) => {
            let next = accu + `${fieldFacets[key].field}:${element}`;
            if (index < array.length - 1) {
              next += ` ${fieldFacets[key].op} `;
            } else {
              next += ')';
            }
            return next;
          }, `{!tag=${fieldFacets[key].tag}}(`)
        );
      }
    }
    return [fieldFacetsParams, selectedFieldFacets];
  }, [fieldFacets]);

  const prepareQueryFacets = useCallback(() => {
    let queryFacetsParams = [];
    let selectedQueryFacets = [];
    for (const key in queryFacets) {
      if (
        queryFacets[key].queries &&
        queryFacets[key].labels &&
        queryFacets[key].queries.length === queryFacets[key].labels.length
      ) {
        const currentQueryFacetParams = queryFacets[key].queries.map(
          (query, index) => {
            return `{!key=${key}_${index}}${query}`;
          }
        );
        queryFacetsParams = queryFacetsParams.concat(currentQueryFacetParams);
        if (queryFacets[key].selected && queryFacets[key].selected.length > 0) {
          const currentSelectedQueries = queryFacets[key].selected
            .filter((label) => queryFacets[key].labels.indexOf(label) !== -1)
            .map((label) => {
              const index = queryFacets[key].labels.indexOf(label);
              return `{!tag=${key}_${index}}${queryFacets[key].queries[index]}`;
            });
          selectedQueryFacets = selectedQueryFacets.concat(
            currentSelectedQueries
          );
        }
      }
    }
    return [queryFacetsParams, selectedQueryFacets];
  }, [queryFacets]);

  const prepareFacetsParams = useCallback(() => {
    const facetParams = {};
    const [fieldFacetsParams, selectedFieldFacets] = prepareFieldFacets();
    if (fieldFacetsParams.length > 0) {
      facetParams.facet = true;
      facetParams['facet.field'] = fieldFacetsParams;
      if (selectedFieldFacets.length > 0) {
        facetParams.fq = selectedFieldFacets;
      }
    }

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

    return facetParams;
  }, [prepareFieldFacets, prepareQueryFacets]);

  const makeRequest = useCallback(() => {
    clearResults();
    const facetsParams = prepareFacetsParams();
    const queryParameters = {
      q: elements
        .map((element) => element.text.trim())
        .join(' ')
        .trim(),
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
      ].join(','),
      sort: 'score desc',
      'q.op': 'AND',
      rows: rows,
      start: (page - 1) * rows,
      ...facetsParams,
    };
    if (queryParameters.q === '') {
      queryParameters.q = '*:*';
    }

    const queryString = buildQueryString(queryParameters);
    sendRequest(baseURL + '/select?' + queryString, 'GET', null);
  }, [
    page,
    elements,
    rows,
    buildQueryString,
    clearResults,
    sendRequest,
    prepareFacetsParams,
  ]);

  const prepareAndSetQueryFacets = useCallback(
    (queryFacetsResult) => {
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
      setQueryFacets(result);
    },
    [setQueryFacets]
  );

  useEffect(() => {
    setIsLoading(isLoading);
    setError(error);
    if (!isLoading && !error && data) {
      if (data.response.docs && data.response.docs.length > 0) {
        setResults(data.response.docs);
        if (data.facet_counts) {
          setFieldFacets(data.facet_counts.facet_fields);
          prepareAndSetQueryFacets(data.facet_counts.facet_queries);
        }
        if (data.response.numFound !== numFound) {
          setPage(1);
        }
        setNumFound(data.response.numFound);
      }
    }
  }, [
    isLoading,
    data,
    reqIdentifer,
    error,
    numFound,
    setPage,
    setResults,
    setError,
    setIsLoading,
    setFieldFacets,
    prepareAndSetQueryFacets,
    setNumFound,
  ]);

  return {
    makeRequest,
    isLoading,
    error,
  };
};

export default useDatafari;
