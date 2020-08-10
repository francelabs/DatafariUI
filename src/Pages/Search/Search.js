import React, { Fragment } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import SearchBar from '../../Components/SearchBar/SearchBar';
import Modal from '../../Components/Modal/Modal';

import './Search.css';
import ResultsList from '../../Components/ResultsList/ResultsList';
import FieldFacet from '../../Components/Facet/FieldFacet';
import QueryFacet from '../../Components/Facet/QueryFacet';
import Pager from '../../Components/Pager/Pager';

const Search = (props) => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();
  return (
    <Fragment>
      <h1>
        <Trans t={t}>Search Page</Trans>
      </h1>
      <SearchBar />
      <FieldFacet field="extension" op="OR" />
      <FieldFacet field="language" op="OR" />
      <QueryFacet
        queries={[
          'last_modified:[NOW-1MONTH TO NOW]',
          'last_modified:[NOW-1YEAR TO NOW]',
          'last_modified:[NOW-5YEARS TO NOW]',
        ]}
        labels={[
          'less than a month',
          'less than a year',
          'less than five years',
        ]}
        id="date_facet"
      />
      <ResultsList />
      <Pager />
      <Switch>
        <Route path={`${path}/alerts`}>
          <Modal />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default Search;
