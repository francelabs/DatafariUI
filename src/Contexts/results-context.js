import React, { useReducer } from 'react';

export const SET_RESULTS = 'SET_RESULTS';
export const SET_ERROR = 'SET_ERROR';
export const SET_IS_LOADING = 'SET_IS_LOADING';

export const DEFAULT_RESULT = {
  error: undefined,
  isLoading: false,
  results: [],
  fieldFacets: {},
  queryFacets: {},
  elements: [],
  spellcheck: undefined,
  numFound: 0,
  rows: 10,
  start: 0,
  promolinks: [],
};
/*
Note error evaluates to false (null / undefined / false) when there are no errors 
{
  error: {
    code: int,
    message: str,
  },

  isLoading: bool,
  results: [solrDocs],
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
   },
   elements: ['strategy', '2020'],
   numFound: int,
   rows: int,
   start: int,
}
*/

const resultsReducer = (results, action) => {
  switch (action.type) {
    case SET_ERROR:
      return { ...results, error: action.error };
    case SET_IS_LOADING:
      return { ...results, isLoading: action.isLoading };
    case SET_RESULTS:
      return { ...results, ...action.results };
    default:
      return { ...results };
  }
};

export const ResultsContext = React.createContext({
  results: {},
  dispatch: () => {},
});

const ResultsContextProvider = (props) => {
  const [results, resultsDispatch] = useReducer(resultsReducer, DEFAULT_RESULT);

  return (
    <ResultsContext.Provider
      value={{
        results: results,
        dispatch: resultsDispatch,
      }}
    >
      {props.children}
    </ResultsContext.Provider>
  );
};

export default ResultsContextProvider;
