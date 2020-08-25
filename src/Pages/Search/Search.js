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
              <FieldFacet title={t('Extension')} field="extension" op="OR" />
              <FieldFacet title={t('Language')} field="language" op="OR" />
              <QueryFacet
                title={t('Date')}
                queries={[
                  'last_modified:[NOW-1MONTH TO NOW]',
                  'last_modified:[NOW-1YEAR TO NOW]',
                  'last_modified:[NOW-5YEARS TO NOW]',
                ]}
                labels={[
                  t('less than a month'),
                  t('less than a year'),
                  t('less than five years'),
                ]}
                id="date_facet"
                last={true}
              />
            </div>
          </Hidden>
        </Grid>
        <Grid item sm={12} md={8}>
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
