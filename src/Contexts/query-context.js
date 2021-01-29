import React, { useCallback, useReducer } from 'react';

export const SET_FIELD_FACETS = 'SET_FIELD_FACETS';
export const SET_QUERY_FACETS = 'SET_QUERY_FACETS';
export const SET_ROWS = 'SET_ROWS';
export const SET_PAGE = 'SET_PAGE';
export const SET_ELEMENTS = 'SET_ELEMENTS';
export const SET_SORT = 'SET_SORT';
export const RESET_FACETS_SELECTION = 'RESET_FACET_SELECTION';
export const SET_FILTERS = 'SET_FILTERS';
export const SET_ELEMENTS_NO_RESET = 'SET_ELEMENTS_NO_RESET';

const resetFacetSelection = (fieldFacets, queryFacets) => {
  const newFieldFacets = { ...fieldFacets };
  for (const key in newFieldFacets) {
    newFieldFacets[key] = { ...fieldFacets[key] };
    newFieldFacets[key].selected = null;
    delete newFieldFacets[key].selected;
  }
  const newQueryFacets = { ...queryFacets };
  for (const key in newQueryFacets) {
    newQueryFacets[key] = { ...queryFacets[key] };
    newQueryFacets[key].selected = null;
    delete newQueryFacets[key].selected;
  }
  return [newFieldFacets, newQueryFacets];
};

const queryReducer = (query, action) => {
  const [newFieldFacets, newQueryFacets] = resetFacetSelection(
    query.fieldFacets,
    query.queryFacets
  );
  switch (action.type) {
    case SET_FIELD_FACETS:
      return { ...query, page: 1, fieldFacets: action.fieldFacets };
    case SET_QUERY_FACETS:
      return { ...query, page: 1, queryFacets: action.queryFacets };
    case SET_ROWS:
      return { ...query, page: 1, rows: action.rows };
    case SET_PAGE:
      return { ...query, page: action.page };
    case SET_ELEMENTS:
      return {
        ...query,
        page: 1,
        elements: action.elements,
        queryFacets: newQueryFacets,
        fieldFacets: newFieldFacets,
        filters: {},
      };
    case SET_ELEMENTS_NO_RESET:
      return {
        ...query,
        page: 1,
        elements: action.elements,
      };
    case SET_SORT:
      return { ...query, page: 1, sort: action.sort };
    case RESET_FACETS_SELECTION:
      return {
        ...query,
        queryFacets: newQueryFacets,
        fieldFacets: newFieldFacets,
        filters: {},
      };
    case SET_FILTERS:
      return { ...query, page: 1, filters: action.filters };
    default:
      return { ...query };
  }
};
/*
 {
   fieldFacets: {
     extension: {
       field: 'extension',
       tag: 'extention',
       selected: ['pdf', 'doc'],
       op: 'OR',
     }
   },
   queryFacets: {
     date: {
       labels: ['Less than a month', 'Less than a year'],
       queries: ['last_modified:[NOW-1MONTH TO NOW]', 'last_modified:[NOW-1YEAR TO NOW]'],
       op: 'OR',
       selected: ['Less than a month'],
     }
   }
   elements: "some query here",
   rows: 10,
   page: 1,
 }
 */

export const QueryContext = React.createContext({
  query: {
    fieldFacets: {},
    queryFacets: {},
    filters: {},
    elements: '',
    rows: 10,
    page: 1,
    op: 'AND',
    sort: { label: 'Relevance', value: 'score desc' },
  },
  dispatch: () => {},
});

const QueryContextProvider = (props) => {
  const [query, queryDispatcher] = useReducer(queryReducer, {
    fieldFacets: {},
    queryFacets: {},
    filters: {},
    elements: '',
    rows: 10,
    page: 1,
    op: 'AND',
    sort: { label: 'Relevance', value: 'score desc' },
  });

  const buildQueryStringFromParams = useCallback((queryParams) => {
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

  const buildSearchQueryString = useCallback(() => {
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

    return buildQueryStringFromParams(queryParameters);
  }, [
    buildQueryStringFromParams,
    prepareFacetsParams,
    query.elements,
    query.page,
    query.rows,
    query.sort.value,
  ]);

  return (
    <QueryContext.Provider
      value={{
        query: query,
        dispatch: queryDispatcher,
        buildSearchQueryString: buildSearchQueryString,
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

export default QueryContextProvider;
