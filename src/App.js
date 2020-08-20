import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import TopMenu from './Components/TopMenu/TopMenu';
import QueryContextProvider from './Contexts/query-context';
import ResultsContextProvider from './Contexts/results-context';

import SearchPage from './Pages/Search/Search';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const defaultTheme = createMuiTheme({
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
    <ThemeProvider theme={defaultTheme}>
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
    </ThemeProvider>
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
