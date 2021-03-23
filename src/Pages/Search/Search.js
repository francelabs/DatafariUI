import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Modal from '../../Components/Modal/Modal';

import './Search.css';
import ResultsList from '../../Components/ResultsList/ResultsList';
import FieldFacet from '../../Components/Facet/FieldFacet';
import QueryFacet from '../../Components/Facet/QueryFacet';
import Pager from '../../Components/Pager/Pager';
import SearchTopMenu from '../../Components/SearchTopMenu/SearchTopMenu';
import useDatafari from '../../Hooks/useDatafari';
import { Grid, makeStyles, Hidden } from '@material-ui/core';
import SearchInformation from '../../Components/SearchInformation/SearchInformation';
import DateFacetCustom from '../../Components/DateFacetCustom/DateFacetCustom';

const useStyles = makeStyles((theme) => ({
  searchGrid: {
    backgroundColor: theme.palette.primary.dark,
  },

  facetsSection: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '5px',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: '280px',
  },

  pagerContainer: {
    margin: theme.spacing(2),
    float: 'right',
  },

  facetDivider: {
    '&:last-of-type': {
      display: 'none',
    },
  },
}));

const Search = (props) => {
  useDatafari();
  const classes = useStyles();
  const { path } = useRouteMatch();
  const { t } = useTranslation();

  return (
    <Fragment>
      <SearchTopMenu />
      <Grid container className={classes.searchGrid}>
        <Grid item md={4} lg>
          <Hidden smDown>
            <div className={classes.facetsSection}>
              <FieldFacet
                title={t('Extension')}
                field="extension"
                op="OR"
                dividerClassName={classes.facetDivider}
                minShow={5}
              />
              <FieldFacet
                title={t('Language')}
                field="language"
                op="OR"
                dividerClassName={classes.facetDivider}
                minShow={5}
              />
              <QueryFacet
                title={t('Date')}
                queries={[
                  'creation_date:[NOW/DAY TO NOW]',
                  'creation_date:[NOW/DAY-7DAY TO NOW/DAY]',
                  'creation_date:[NOW/DAY-30DAY TO NOW/DAY-8DAY]',
                  'creation_date:([1970-09-01T00:01:00Z TO NOW/DAY-31DAY] || [* TO 1970-08-31T23:59:59Z])',
                  'creation_date:[1970-09-01T00:00:00Z TO 1970-09-01T00:00:00Z]',
                ]}
                labels={[
                  t('Today'),
                  t('From Yesterday Up To 7 days'),
                  t('From 8 Days Up To 30 days'),
                  t('Older than 31 days'),
                  t('No date'),
                ]}
                id="date_facet"
                dividerClassName={classes.facetDivider}
                minShow={5}
              >
                <DateFacetCustom />
              </QueryFacet>
            </div>
          </Hidden>
        </Grid>
        <Grid item sm={12} md={8}>
          <SearchInformation />
          <ResultsList />
          <div className={classes.pagerContainer}>
            <Pager />
          </div>
        </Grid>
        <Grid item lg={1} />
      </Grid>
      <Switch>
        <Route path={`${path}/alerts`}>
          <Modal />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default Search;
