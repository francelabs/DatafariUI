import React, { Suspense, useContext, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import TopMenu from './Components/TopMenu/TopMenu';
import QueryContextProvider from './Contexts/query-context';
import ResultsContextProvider from './Contexts/results-context';
import UserContextProvider, { UserContext } from './Contexts/user-context';
import { create } from 'jss';
import rtl from 'jss-rtl';

import SearchPage from './Pages/Search/Search';
import { StylesProvider, CssBaseline, jssPreset } from '@material-ui/core';

import 'fontsource-montserrat/300.css';
import 'fontsource-montserrat';
import 'fontsource-montserrat/500.css';
import 'fontsource-montserrat/700.css';
import Preview from './Pages/Preview/Preview';
import APIEndpointsContextProvider from './Contexts/api-endpoints-context';
import LicenceContextProvider from './Contexts/licence-context';
import LicenceChecker from './Components/LicenceChecker/LicenceChecker';
import { useTranslation } from 'react-i18next';
import CustomThemeProvider from './Components/CustomThemeProvider/CustomThemeProvider';
import useTitleUpdater from './Hooks/useTitleUpdater';
import HomePage from './Pages/HomePage/HomePage';
import UIConfigContextProvider, { UIConfigContext } from './Contexts/ui-config-context';
import SearchContextProvider from './Contexts/search-context';
import Banner from './Components/Banner';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// AUTO connect interval 60 sec
const AUTOCONNECT_INTERVAL_MS = 60000;

function Main() {
  const { actions: userActions } = useContext(UserContext);
  const { t } = useTranslation();

  const {
    uiDefinition: { devMode = { enable: false } },
  } = useContext(UIConfigContext);

  useTitleUpdater();

  useEffect(() => {
    userActions.autoConnect();

    // add a timeout for autoconnect
    const timer = setInterval(userActions.autoConnect, AUTOCONNECT_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [userActions]);

  document.title = t('Datafari Enterprise Search');

  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={HomePage} />
          <Route path={['/search', '/preview']}>
            <LicenceChecker />
            <TopMenu />
            <Switch>
              <Route path="/search" component={SearchPage} />
              <Route path="/preview" component={Preview} />
            </Switch>
          </Route>
        </Switch>
      </BrowserRouter>

      {devMode.enable ? <Banner {...devMode.banner} /> : null}
    </>
  );
}

function App() {
  /*
   * UserContextProvider and APIEndpointsContextProvider must stay here !
   * UserContextProvider will not behave as expected if put elsewhere and
   * it requires APIEndpointsContextProvider to work. This is because the
   * Main component uses the UserContext and thus it must itself be wrapped
   * by the UserContextProvider to be able to perform the autoConnect action
   * properly.
   */
  return (
    <Suspense fallback="loading">
      <APIEndpointsContextProvider>
        <UIConfigContextProvider>
          <UserContextProvider>
            <StylesProvider jss={jss}>
              <CustomThemeProvider>
                <CssBaseline />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <LicenceContextProvider>
                    <QueryContextProvider>
                      <ResultsContextProvider>
                        <SearchContextProvider>
                          <Main />
                        </SearchContextProvider>
                      </ResultsContextProvider>
                    </QueryContextProvider>
                  </LicenceContextProvider>
                </MuiPickersUtilsProvider>
              </CustomThemeProvider>
            </StylesProvider>
          </UserContextProvider>
        </UIConfigContextProvider>
      </APIEndpointsContextProvider>
    </Suspense>
  );
}

export default App;
