import React, { useContext, useEffect, useState } from 'react';
import { QueryContext, SET_FIELD_FACETS } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';
import FacetEntry from './FacetEntry';
import { Divider, IconButton, makeStyles, List } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    color: theme.palette.secondary.main,
    flexGrow: 1,
  },
  facetHeader: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const FieldFacet = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { results } = useContext(ResultsContext);
  const { field, op } = props;

  useEffect(() => {
    if (!query.fieldFacets[field]) {
      const newFieldFacets = { ...query.fieldFacets };
      newFieldFacets[field] = { field: field, tag: field, op: op };
      queryDispatch({ type: SET_FIELD_FACETS, fieldFacets: newFieldFacets });
    }
  }, [field, query, queryDispatch, op]);

  const onClick = (value) => {
    return () => {
      const newQueryFieldFacets = { ...query.fieldFacets };
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
      queryDispatch({
        type: SET_FIELD_FACETS,
        fieldFacets: newQueryFieldFacets,
      });
    };
  };

  let facetValues = [];
  if (results.fieldFacets[field]) {
    for (let i = 0; i < results.fieldFacets[field].length; i += 2) {
      facetValues.push(
        <FacetEntry
          onClick={onClick(results.fieldFacets[field][i])}
          value={results.fieldFacets[field][i]}
          count={results.fieldFacets[field][i + 1]}
          selected={
            query.fieldFacets[field] &&
            query.fieldFacets[field].selected &&
            query.fieldFacets[field].selected.indexOf(
              results.fieldFacets[field][i]
            ) !== -1
          }
          id={`facet-${props.field}-${i}`}
        />
      );
    }
  }

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  return facetValues.length > 0 ? (
    <>
      <div className={classes.facetHeader}>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
        <span className={classes.facetTitleText}>{props.title}</span>
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded && <List dense>{facetValues}</List>}
      <Divider />
    </>
  ) : null;
};

export default FieldFacet;
