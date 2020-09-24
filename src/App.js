import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import TopMenu from './Components/TopMenu/TopMenu';
import QueryContextProvider from './Contexts/query-context';
import ResultsContextProvider from './Contexts/results-context';
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
  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <QueryContextProvider>
            <ResultsContextProvider>
              <BrowserRouter basename={process.env.PUBLIC_URL}>
                <TopMenu />
                {/* <MainNavigation entries={menuEntries} /> */}
                <div>
                  <Switch>
                    <Route path="/" component={SearchPage} exact />
                    <Route path="/search" component={SearchPage} />
                  </Switch>
                </div>
              </BrowserRouter>
            </ResultsContextProvider>
          </QueryContextProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

function App() {
  return (
    <Suspense fallback="loading">
      <Main />
    </Suspense>
  );
}

export default App;
