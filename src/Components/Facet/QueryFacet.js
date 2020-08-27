import React, { useContext, useEffect, useState, useRef } from 'react';
import { QueryContext, SET_QUERY_FACETS } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';
import FacetEntry from './FacetEntry';
import {
  Divider,
  IconButton,
  makeStyles,
  List,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useTranslation } from 'react-i18next';

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

const QueryFacet = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { results } = useContext(ResultsContext);
  const { id, labels, queries } = props;
  const menuAnchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const multipleSelect =
    props.multipleSelect !== undefined && props.multipleSelect !== null
      ? props.multipleSelect
      : false;

  useEffect(() => {
    if (!query.queryFacets[id]) {
      const newQueryFacets = { ...query.queryFacets };
      newQueryFacets[id] = { labels: labels, queries: queries };
      queryDispatch({ type: SET_QUERY_FACETS, queryFacets: newQueryFacets });
    }
  }, [id, query, queryDispatch, labels, queries]);

  const onClick = (value) => {
    return () => {
      const newQueryFacets = { ...query.queryFacets };
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
      queryDispatch({ type: SET_QUERY_FACETS, queryFacets: newQueryFacets });
    };
  };

  let facetValues = [];
  if (results.queryFacets[id]) {
    for (let index = 0; index < labels.length; index++) {
      if (results.queryFacets[id][index]) {
        facetValues.push(
          <FacetEntry
            onClick={onClick(labels[index])}
            value={labels[index]}
            count={results.queryFacets[id][index]}
            selected={
              query.queryFacets[id] &&
              query.queryFacets[id].selected &&
              query.queryFacets[id].selected.indexOf(labels[index]) !== -1
            }
            key={`facet-${id}-${index}`}
          />
        );
      }
    }
  }

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleClearFilterClick = () => {
    const newQueryFacets = { ...query.queryFacets };
    newQueryFacets[id].selected = undefined;

    queryDispatch({
      type: SET_QUERY_FACETS,
      queryFacets: newQueryFacets,
    });
    setMenuOpen(false);
  };

  const handleSelectAllClick = () => {
    const newQueryFacets = { ...query.queryFacets };
    newQueryFacets[id].selected = [...labels];

    queryDispatch({
      type: SET_QUERY_FACETS,
      queryFacets: newQueryFacets,
    });
    setMenuOpen(false);
  };

  const handleOpenMenu = (event) => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  // The insertion of children allow the addition of element with specific behavior
  // such as a date picker for a date query facet, range picker for weight facet etc.
  return facetValues.length > 0 ? (
    <>
      <div className={classes.facetHeader}>
        <IconButton
          onClick={handleOpenMenu}
          aria-controls={`${id}-facet-menu`}
          aria-haspopup="true"
          ref={menuAnchorRef}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`${id}-facet-menu`}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          {multipleSelect && (
            <MenuItem onClick={handleSelectAllClick}>
              {t('Select All')}
            </MenuItem>
          )}
          <MenuItem onClick={handleClearFilterClick}>
            {t('Clear Filter')}
          </MenuItem>
        </Menu>
        <Typography color="secondary" className={classes.facetTitleText}>
          {props.title}
        </Typography>
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded && <List dense>{facetValues}</List>}
      {props.children}
      <Divider className={props.dividerClassName} />
    </>
  ) : null;
};

export default QueryFacet;
