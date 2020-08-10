import React, { useState } from 'react';

export const ResultsContext = React.createContext({
  results: [],
  setResults: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: undefined,
  setError: () => {},
  fieldFacets: {},
  setFieldFacets: () => {},
  queryFacets: {},
  setQueryFacets: () => {},
  numFound: 0,
  setNumFound: () => {},
});

const ResultsContextProvider = (props) => {
  const [currentResults, setCurrentResults] = useState([]);
  const [fieldFacets, setFieldFacets] = useState({});
  const [queryFacets, setQueryFacets] = useState({});
  const [currentLoading, setCurrentLoading] = useState(false);
  const [currentError, setCurrentError] = useState(undefined);
  const [numFound, setNumFound] = useState(0);

  return (
    <ResultsContext.Provider
      value={{
        results: currentResults,
        setResults: setCurrentResults,
        isLoading: currentLoading,
        setIsLoading: setCurrentLoading,
        error: currentError,
        setError: setCurrentError,
        fieldFacets: fieldFacets,
        setFieldFacets: setFieldFacets,
        queryFacets: queryFacets,
        setQueryFacets: setQueryFacets,
        numFound: numFound,
        setNumFound: setNumFound,
      }}
    >
      {props.children}
    </ResultsContext.Provider>
  );
};

export default ResultsContextProvider;
