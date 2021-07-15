import React, { useContext, useRef, useState } from 'react';
import {
  Typography,
  makeStyles,
  Grid,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ResultsContext } from '../../Contexts/results-context';
import {
  QueryContext,
  SET_FIELD_FACET_SELECTED,
  SET_QUERY_FACET_SELECTED,
  SET_SORT,
  UNREGISTER_FILTER,
} from '../../Contexts/query-context';
import FilterEntry from './FilterEntry';
import SortIcon from '@material-ui/icons/Sort';
import CurrentSearchAndSpellcheck from './CurrentSearchAndSpellcheck';
import ResultCountInformation from './ResultCountInformation';
import produce from 'immer';
import useFilterFormater from '../../Hooks/useFilterFormater';

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
  const [filterFormat] = useFilterFormater();

  const handleOpenSortMenu = (event) => {
    setSortMenuOpen(true);
  };

  const handleCloseSortMenu = () => {
    setSortMenuOpen(false);
  };

  const handleClearFieldFacet = (key, value) => {
    return () => {
      if (query.selectedFieldFacets[key]) {
        const selected = produce(
          query.selectedFieldFacets[key],
          (selectedDraft) => {
            const index = selectedDraft.indexOf(value);
            if (index !== -1) {
              selectedDraft.splice(index, 1);
            }
          }
        );
        queryDispatch({
          type: SET_FIELD_FACET_SELECTED,
          facetId: key,
          selected: selected,
        });
      }
    };
  };

  const handleClearQueryFacet = (key, value) => {
    return () => {
      if (query.selectedQueryFacets[key]) {
        const selected = produce(
          query.selectedQueryFacets[key],
          (selectedDraft) => {
            const index = selectedDraft.indexOf(value);
            if (index !== -1) {
              selectedDraft.splice(index, 1);
            }
          }
        );
        queryDispatch({
          type: SET_QUERY_FACET_SELECTED,
          facetId: key,
          selected: selected,
        });
      }
    };
  };

  const handleClearFilter = (key) => {
    return () => {
      queryDispatch({
        type: UNREGISTER_FILTER,
        id: key,
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
        label: 'Creation Date',
        value: 'creation_date desc',
      },
    });
    handleCloseSortMenu();
  };

  const filters = [];
  for (const key in query.fieldFacets) {
    if (
      query.selectedFieldFacets[key] &&
      query.selectedFieldFacets[key].length > 0
    ) {
      filters.push(
        <Typography component="span">
          <Typography component="span" color="secondary">
            {query.fieldFacets[key].title}:&nbsp;
          </Typography>
          {query.selectedFieldFacets[key].map((entry) => (
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
      query.selectedQueryFacets[key] &&
      query.selectedQueryFacets[key].length > 0
    ) {
      filters.push(
        <Typography component="span">
          <Typography component="span" color="secondary">
            {query.queryFacets[key].title}:&nbsp;
          </Typography>
          {query.selectedQueryFacets[key].map((entry) => (
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
            value={filterFormat(query.filters[key])}
            onClick={handleClearFilter(key)}
          />
        ))}
      </Typography>
    );
  }

  return (
    !results.isLoading &&
    !results.error && (
      <div className={classes.informationContainer}>
        <Grid container>
          <Grid item xs={8}>
            <Typography component="span">
              <ResultCountInformation
                start={results.start}
                rows={results.rows}
                numFound={results.numFound}
              />
            </Typography>
            <Typography component="span">
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
              <MenuItem onClick={handleSelectDateSort}>
                {t('Creation Date')}
              </MenuItem>
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
    )
  );
};

export default SearchInformation;
