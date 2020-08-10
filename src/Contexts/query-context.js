import React, { useState } from 'react';

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
   Moins%20de%20un%20an}
   elements: ['strategy', '2020'],
   rows: 10,
   page: 1,
 }
 */

export const QueryContext = React.createContext({
  fieldFacets: {},
  setFieldFacets: () => {},
  queryFacets: {},
  setQueryFacets: () => {},
  elements: [],
  setElements: () => {},
  rows: 10,
  setRows: () => {},
  page: 1,
  setPage: () => {},
  resetFacetSelection: () => {},
});

const QueryContextProvider = (props) => {
  const [elements, setElements] = useState([]);
  const [fieldFacets, setFieldFacets] = useState({});
  const [queryFacets, setQueryFacets] = useState({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);

  const resetFacetSelection = () => {
    const newFieldFacets = { ...fieldFacets };
    for (const key in newFieldFacets) {
      delete newFieldFacets[key].selected;
    }
  };

  return (
    <QueryContext.Provider
      value={{
        elements: elements,
        setElements: setElements,
        fieldFacets: fieldFacets,
        setFieldFacets: setFieldFacets,
        queryFacets: queryFacets,
        setQueryFacets: setQueryFacets,
        page: page,
        setPage: setPage,
        rows: rows,
        setRows: setRows,
        resetFacetSelection: resetFacetSelection,
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

export default QueryContextProvider;
