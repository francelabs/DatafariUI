import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  QueryContext,
  REGISTER_QUERY_FACET,
  SET_QUERY_FACET_SELECTED,
} from '../../Contexts/query-context';
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
  Link,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useTranslation } from 'react-i18next';

const DISPLAY_ENTRIES = [10, 100];

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    color: theme.palette.secondary.main,
    flexGrow: 1,
  },
  facetHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  showMore: {
    width: '100%',
    marginBottom: theme.spacing(1),
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
  const [showMore, setShowMore] = useState(false);

  const minShow = props.minShow ? props.minShow : DISPLAY_ENTRIES[0];
  const maxShow = props.maxShow ? props.maxShow : DISPLAY_ENTRIES[1];

  const numShowed = showMore ? maxShow : minShow;

  const multipleSelect =
    props.multipleSelect !== undefined && props.multipleSelect !== null
      ? props.multipleSelect
      : false;

  // Effect to add the facet to the query if it is not registered
  useEffect(() => {
    const newFacet = {
      id: id,
      labels: labels,
      queries: queries,
      title: props.title,
    };
    queryDispatch({ type: REGISTER_QUERY_FACET, queryFacet: newFacet });
  }, [id, queryDispatch, labels, queries, props.title]);

  // Handler when clicking on a facet entry.
  // Adds or remove the entry from the selected list
  // depending on its current state.
  const onClick = (value) => {
    return () => {
      // Remember query is immutable, copy array before modifying it.
      let selected = query.selectedQueryFacets[id]
        ? [...query.selectedQueryFacets[id]]
        : [];
      if (multipleSelect) {
        const selectedIndex = selected.indexOf(value);
        if (selectedIndex === -1) {
          selected.push(value);
        } else {
          selected.splice(selectedIndex, 1);
        }
      } else {
        if (selected[0] === value) {
          selected = [];
        } else {
          selected[0] = value;
        }
      }
      const action = {
        type: SET_QUERY_FACET_SELECTED,
        facetId: id,
        selected: selected,
      };
      queryDispatch(action);
    };
  };

  // Build a facet values array from the results to be displayed
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
              query.selectedQueryFacets[id] &&
              query.selectedQueryFacets[id].indexOf(labels[index]) !== -1
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

  // Removes all facet entry selection
  const handleClearFilterClick = () => {
    queryDispatch({
      type: SET_QUERY_FACET_SELECTED,
      facetId: id,
      selected: [],
    });
    setMenuOpen(false);
  };

  // Select all facet entries
  const handleSelectAllClick = () => {
    queryDispatch({
      type: SET_QUERY_FACET_SELECTED,
      facetId: id,
      selected: [...labels],
    });
    setMenuOpen(false);
  };

  const handleOpenMenu = (event) => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleShowMoreClick = (event) => {
    event.preventDefault();
    setShowMore((oldShowMore) => {
      return !oldShowMore;
    });
  };

  // The insertion of children allow the addition of element with specific behavior
  // such as a date picker for a date query facet, range picker for weight facet etc.
  return facetValues.length > 0 || props.children ? (
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
      {expanded && (
        <>
          <List dense>{facetValues.slice(0, numShowed)}</List>
          {!showMore && numShowed < facetValues.length && (
            <Link
              component="button"
              color="secondary"
              onClick={handleShowMoreClick}
              align="right"
              className={classes.showMore}
            >
              <Typography variant="caption">
                {t('Show More')} &gt;&gt;
              </Typography>
            </Link>
          )}
          {showMore && (
            <Link
              component="button"
              color="secondary"
              onClick={handleShowMoreClick}
              align="right"
              className={classes.showMore}
            >
              <Typography variant="caption">
                {t('Show Less')} &lt;&lt;
              </Typography>
            </Link>
          )}
        </>
      )}
      {props.children}
      <Divider className={props.dividerClassName} />
    </>
  ) : null;
};

export default QueryFacet;
