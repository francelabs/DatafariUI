import React, { useContext, useEffect } from 'react';
import { QueryContext } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';
import FacetEntry from './FacetEntry';
import useDatafari from '../../Hooks/useDatafari';

const FieldFacet = (props) => {
  const {
    fieldFacets: queryFieldFacets,
    setFieldFacets: setQueryFieldFacets,
  } = useContext(QueryContext);
  const { fieldFacets } = useContext(ResultsContext);
  const { field, op } = props;
  const { makeRequest } = useDatafari();

  useEffect(() => {
    if (!queryFieldFacets[field]) {
      const newFieldFacets = { ...queryFieldFacets };
      newFieldFacets[field] = { field: field, tag: field, op: op };
      setQueryFieldFacets(newFieldFacets);
    }
  }, [field, queryFieldFacets, setQueryFieldFacets, op]);

  const onClick = (value) => {
    return () => {
      const newQueryFieldFacets = { ...queryFieldFacets };
      if (!newQueryFieldFacets[field].selected) {
        newQueryFieldFacets[field].selected = [];
      }
      const selected = newQueryFieldFacets[field].selected;
      const selectedIndex = selected.indexOf(value);
      if (selectedIndex === -1) {
        selected.push(value);
      } else {
        selected.splice(selectedIndex, 1);
      }
      setQueryFieldFacets(newQueryFieldFacets);
      makeRequest();
    };
  };

  let facetValues = [];
  if (fieldFacets[field]) {
    for (let i = 0; i < fieldFacets[field].length; i += 2) {
      facetValues.push(
        <FacetEntry
          onClick={onClick(fieldFacets[field][i])}
          value={fieldFacets[field][i]}
          count={fieldFacets[field][i + 1]}
          selected={
            queryFieldFacets[field] &&
            queryFieldFacets[field].selected &&
            queryFieldFacets[field].selected.indexOf(fieldFacets[field][i]) !==
              -1
          }
        />
      );
    }
  }

  return facetValues.length > 0 ? <div>{facetValues}</div> : null;
};

export default FieldFacet;
