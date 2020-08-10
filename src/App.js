import React, { Suspense } from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';

import MainNavigation from './Components/Navigation/MainNavigation';
import QueryContextProvider from './Contexts/query-context';
import ResultsContextProvider from './Contexts/results-context';

import HomePage from './Pages/Home/Home';
import SearchPage from './Pages/Search/Search';

function Main() {
  const { t } = useTranslation();
  const menuEntries = [
    <NavLink to="/">{t('Home Page')}</NavLink>,
    <NavLink to="/search">{t('Search Page')}</NavLink>,
    <a href={'/Datafari/login?redirect=' + window.location.href}>
      {t('Login')}
    </a>,
    <a href={'/Datafari/admin/'}>{t('Admin')}</a>,
  ];
  return (
    <QueryContextProvider>
      <ResultsContextProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <MainNavigation entries={menuEntries} />
          <div>
            <Switch>
              <Route path="/" component={HomePage} exact />
              <Route path="/search" component={SearchPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </ResultsContextProvider>
    </QueryContextProvider>
  );
}

// Main trick required for suspense to work properly.
function App() {
  return (
    <Suspense fallback="loading">
      <Main />
    </Suspense>
  );
}

export default App;
