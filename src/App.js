import React, { Suspense } from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MainNavigation from './Components/Navigation/MainNavigation';

import HomePage from './Pages/Home/Home';
import SearchPage from './Pages/Search/Search';

function Main() {
  const { t } = useTranslation();
  const menuEntries = [
    { path: '/', label: t('Home Page') },
    { path: '/search', label: t('Search Page') },
  ];
  return (
    <BrowserRouter>
      <MainNavigation entries={menuEntries} />
      <main>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/search" component={SearchPage} />
        </Switch>
      </main>
    </BrowserRouter>
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
