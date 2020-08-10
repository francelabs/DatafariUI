import React, { useContext, useEffect } from 'react';
import { QueryContext } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';
import useDatafari from '../../Hooks/useDatafari';
import FacetEntry from './FacetEntry';

const QueryFacet = (props) => {
  const { queryFacets, setQueryFacets } = useContext(QueryContext);
  const { queryFacets: resultQueryFacets } = useContext(ResultsContext);
  const { id, labels, queries } = props;
  const { makeRequest } = useDatafari();
  const multipleSelect =
    props.multipleSelect !== undefined && props.multipleSelect !== null
      ? props.multipleSelect
      : false;

  useEffect(() => {
    if (!queryFacets[id]) {
      const newQueryFacets = { ...queryFacets };
      newQueryFacets[id] = { labels: labels, queries: queries };
      setQueryFacets(newQueryFacets);
    }
  }, [id, queryFacets, setQueryFacets, labels, queries]);

  const onClick = (value) => {
    return () => {
      const newQueryFacets = { ...queryFacets };
      if (multipleSelect) {
        if (!newQueryFacets[id].selected) {
          newQueryFacets[id].selected = [];
        }
        const selected = newQueryFacets[id].selected;
        const selectedIndex = selected.indexOf(value);
        if (selectedIndex === -1) {
          selected.push(value);
        } else {
          selected.splice(selectedIndex, 1);
        }
      } else {
        if (
          newQueryFacets[id].selected &&
          newQueryFacets[id].selected[0] === value
        ) {
          newQueryFacets[id].selected = [];
        } else {
          newQueryFacets[id].selected = [value];
        }
      }
      setQueryFacets(newQueryFacets);
      makeRequest();
    };
  };

  let facetValues = [];
  if (resultQueryFacets[id]) {
    for (let index = 0; index < labels.length; index++) {
      if (resultQueryFacets[id][index]) {
        facetValues.push(
          <FacetEntry
            onClick={onClick(labels[index])}
            value={labels[index]}
            count={resultQueryFacets[id][index]}
            selected={
              queryFacets[id] &&
              queryFacets[id].selected &&
              queryFacets[id].selected.indexOf(labels[index]) !== -1
            }
          />
        );
      }
    }
  }

  // The insertion of children allow the addition of element with specific behavior
  // such as a date picker for a date query facet, range picker for weight facet etc.
  return (
    <div>
      {facetValues}
      {props.children}
    </div>
  );
};

export default QueryFacet;
