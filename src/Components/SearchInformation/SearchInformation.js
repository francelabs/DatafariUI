import React, { useContext, useRef, useState } from 'react';
import {
  Typography,
  makeStyles,
  Grid,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ResultsContext } from '../../Contexts/results-context';
import {
  QueryContext,
  SET_FIELD_FACETS,
  SET_FILTERS,
  SET_QUERY_FACETS,
  SET_SORT,
} from '../../Contexts/query-context';
import FilterEntry from './FilterEntry';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import SortIcon from '@material-ui/icons/Sort';
import CurrentSearchAndSpellcheck from './CurrentSearchAndSpellcheck';

const useStyles = makeStyles((theme) => ({
  informationContainer: {
    margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  rightMenu: {
    textAlign: 'right',
  },
}));

const SearchInformation = (props) => {
  const { t } = useTranslation();
  const { results } = useContext(ResultsContext);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const classes = useStyles();
  const sortMenuAnchorRef = useRef(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const handleOpenSortMenu = (event) => {
    setSortMenuOpen(true);
  };

  const handleCloseSortMenu = () => {
    setSortMenuOpen(false);
  };

  const handleClearFieldFacet = (key, value) => {
    return () => {
      const newFieldFacets = { ...query.fieldFacets };
      if (newFieldFacets[key] && newFieldFacets[key].selected) {
        const index = newFieldFacets[key].selected.indexOf(value);
        if (index !== -1) {
          newFieldFacets[key].selected.splice(index, 1);
        }
        queryDispatch({
          type: SET_FIELD_FACETS,
          fieldFacets: newFieldFacets,
        });
      }
    };
  };

  const handleClearQueryFacet = (key, value) => {
    return () => {
      const newQueryFacets = { ...query.queryFacets };
      if (newQueryFacets[key] && newQueryFacets[key].selected) {
        const index = newQueryFacets[key].selected.indexOf(value);
        if (index !== -1) {
          newQueryFacets[key].selected.splice(index, 1);
        }
        queryDispatch({
          type: SET_QUERY_FACETS,
          queryFacets: newQueryFacets,
        });
      }
    };
  };

  const handleClearFilter = (key) => {
    return () => {
      const newFilters = { ...query.filters };
      delete newFilters[key];
      queryDispatch({
        type: SET_FILTERS,
        filters: newFilters,
      });
    };
  };

  const handleSelectRelevanceSort = () => {
    queryDispatch({
      type: SET_SORT,
      sort: {
        label: 'Relevance',
        value: 'score desc',
      },
    });
    handleCloseSortMenu();
  };

  const handleSelectDateSort = () => {
    queryDispatch({
      type: SET_SORT,
      sort: {
        label: 'Date',
        value: 'last_modified desc',
      },
    });
    handleCloseSortMenu();
  };

  const filters = [];
  for (const key in query.fieldFacets) {
    if (
      query.fieldFacets[key].selected &&
      query.fieldFacets[key].selected.length > 0
    ) {
      filters.push(
        <Typography component="span">
          <Typography component="span" color="secondary">
            {key}:&nbsp;
          </Typography>
          {query.fieldFacets[key].selected.map((entry) => (
            <FilterEntry
              value={entry}
              onClick={handleClearFieldFacet(key, entry)}
            />
          ))}
        </Typography>
      );
    }
  }

  for (const key in query.queryFacets) {
    if (
      query.queryFacets[key].selected &&
      query.queryFacets[key].selected.length > 0
    ) {
      filters.push(
        <Typography component="span">
          <Typography component="span" color="secondary">
            {query.queryFacets[key].title}:&nbsp;
          </Typography>
          {query.queryFacets[key].selected.map((entry) => (
            <FilterEntry
              value={entry}
              onClick={handleClearQueryFacet(key, entry)}
            />
          ))}
        </Typography>
      );
    }
  }

  if (Object.keys(query.filters).length > 0) {
    filters.push(
      <Typography component="span">
        <Typography component="span" color="secondary">
          Other filters:&nbsp;
        </Typography>
        {Object.keys(query.filters).map((key) => (
          <FilterEntry
            value={query.filters[key].value}
            onClick={handleClearFilter(key)}
          />
        ))}
      </Typography>
    );
  }

  return (
    <div className={classes.informationContainer}>
      <Grid container>
        <Grid item xs={8}>
          <Typography>
            {t('Results {{ start }} - {{ end }} of {{ total }}', {
              start: results.start + 1,
              end: results.start + results.rows,
              total: results.numFound,
            })}{' '}
            {filters.length > 0 && (
              <>
                - [{t('FILTERS')}]:&nbsp;
                {filters}
              </>
            )}
          </Typography>
          <CurrentSearchAndSpellcheck />
        </Grid>
        <Grid item xs className={classes.rightMenu}>
          <Button
            onClick={handleOpenSortMenu}
            aria-controls={`sort-menu`}
            aria-haspopup="true"
            ref={sortMenuAnchorRef}
          >
            <SortIcon />
            {t(query.sort.label)}
          </Button>
          <Menu
            id={`sort-menu`}
            anchorEl={sortMenuAnchorRef.current}
            open={sortMenuOpen}
            onClose={handleCloseSortMenu}
          >
            <MenuItem onClick={handleSelectRelevanceSort}>
              {t('Relevance')}
            </MenuItem>
            <MenuItem onClick={handleSelectDateSort}>{t('Date')}</MenuItem>
          </Menu>
          {/* 
          <IconButton>
            <ViewListIcon />
          </IconButton>
          <IconButton>
            <ViewModuleIcon />
          </IconButton>
           */}
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchInformation;
