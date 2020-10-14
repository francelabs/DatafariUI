import React, { useReducer } from 'react';

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

  return (
    <QueryContext.Provider
      value={{
        query: query,
        dispatch: queryDispatcher,
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

export default QueryContextProvider;
