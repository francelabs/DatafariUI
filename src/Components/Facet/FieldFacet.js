import React, { useContext, useEffect, useState, useRef } from 'react';
import { QueryContext, SET_FIELD_FACETS } from '../../Contexts/query-context';
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

const FieldFacet = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { results } = useContext(ResultsContext);
  const { field, op } = props;
  const { t } = useTranslation();
  const menuAnchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const minShow = props.minShow ? props.minShow : DISPLAY_ENTRIES[0];
  const maxShow = props.maxShow ? props.maxShow : DISPLAY_ENTRIES[1];

  const numShowed = showMore ? maxShow : minShow;

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
    for (
      let i = 0;
      i < results.fieldFacets[field].length && i / 2 < numShowed;
      i += 2
    ) {
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
          key={`facet-${props.field}-${i}`}
        />
      );
    }
  }

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleOpenMenu = (event) => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleClearFilterClick = () => {
    const newQueryFieldFacets = { ...query.fieldFacets };
    newQueryFieldFacets[field].selected = undefined;

    queryDispatch({
      type: SET_FIELD_FACETS,
      fieldFacets: newQueryFieldFacets,
    });
    setMenuOpen(false);
  };

  const handleSelectAllClick = () => {
    const newQueryFieldFacets = { ...query.fieldFacets };
    newQueryFieldFacets[field].selected = [
      ...results.fieldFacets[field].filter((value, index) => {
        return index % 2 === 0;
      }),
    ];

    queryDispatch({
      type: SET_FIELD_FACETS,
      fieldFacets: newQueryFieldFacets,
    });
    setMenuOpen(false);
  };

  const handleShowMoreClick = (event) => {
    event.preventDefault();
    setShowMore((oldShowMore) => {
      return !oldShowMore;
    });
  };

  return facetValues.length > 0 ? (
    <>
      <div className={classes.facetHeader}>
        <IconButton onClick={handleOpenMenu}>
          <MoreVertIcon
            aria-controls={`${field}-facet-menu`}
            aria-haspopup="true"
            ref={menuAnchorRef}
          />
        </IconButton>
        <Menu
          id={`${field}-facet-menu`}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleSelectAllClick}>{t('Select All')}</MenuItem>
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
          <List dense>{facetValues}</List>
          {!showMore && numShowed < results.fieldFacets[field].length / 2 && (
            <Link
              component="button"
              color="secondary"
              onClick={handleShowMoreClick}
              align="right"
              className={classes.showMore}
            >
              {t('Show More')} &gt;&gt;
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
              {t('Show Less')} &lt;&lt;
            </Link>
          )}
        </>
      )}
      <Divider className={props.dividerClassName} />
    </>
  ) : null;
};

export default FieldFacet;
