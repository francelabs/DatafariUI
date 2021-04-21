import React, { Suspense, useContext, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import TopMenu from './Components/TopMenu/TopMenu';
import QueryContextProvider from './Contexts/query-context';
import ResultsContextProvider from './Contexts/results-context';
import UserContextProvider, { UserContext } from './Contexts/user-context';
import { create } from 'jss';
import rtl from 'jss-rtl';

import SearchPage from './Pages/Search/Search';
import {
  StylesProvider,
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  jssPreset,
} from '@material-ui/core';

import 'fontsource-montserrat/300.css';
import 'fontsource-montserrat';
import 'fontsource-montserrat/500.css';
import 'fontsource-montserrat/700.css';
import Preview from './Pages/Preview/Preview';
import APIEndpointsContextProvider from './Contexts/api-endpoints-context';
import LicenceContextProvider from './Contexts/licence-context';
import LicenceChecker from './Components/LicenceChecker/LicenceChecker';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const defaultTheme = createMuiTheme({
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: '#fafafa',
      },
    },
  },
  typography: {
    fontFamily: 'montserrat, Helvetica, Arial, sans-serif',
  },
  palette: {
    primary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#fafafa',
    },
    secondary: {
      light: '#99cc33',
      main: '#679439',
      dark: '#648542',
    },
  },
});

function Main() {
  const { actions: userActions } = useContext(UserContext);

  useEffect(() => {
    userActions.autoConnect();
  }, [userActions]);

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <LicenceContextProvider>
            <QueryContextProvider>
              <ResultsContextProvider>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                  <LicenceChecker />
                  <TopMenu />
                  <div>
                    <Switch>
                      <Route path="/" component={SearchPage} exact />
                      <Route path="/search" component={SearchPage} />
                      <Route path="/preview" component={Preview} />
                    </Switch>
                  </div>
                </BrowserRouter>
              </ResultsContextProvider>
            </QueryContextProvider>
          </LicenceContextProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StylesProvider>
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
        <UserContextProvider>
          <Main />
        </UserContextProvider>
      </APIEndpointsContextProvider>
    </Suspense>
  );
}

export default App;
