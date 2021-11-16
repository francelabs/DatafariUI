import React, { useContext, useEffect, useMemo, useState } from 'react';

import { ThemeProvider } from '@material-ui/core';

import { createTheme } from '@material-ui/core/styles';
import useHttp from '../../Hooks/useHttp';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';

const defaultThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#ffffff',
      dark: '#fafafa',
      contrastText: '#000000',
    },
    secondary: {
      light: '#99cc33',
      main: '#679439',
      dark: '#648542',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
  },
};

const CustomThemeProvider = (props) => {
  const [currentThemeOptions, setCurrentThemeOptions] =
    useState(defaultThemeOptions);
  const theme = useMemo(
    () => createTheme(currentThemeOptions),
    [currentThemeOptions]
  );
  const [queryID, setQueryID] = useState(null);
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();

  useEffect(() => {
    let newQueryID = Math.random().toString(36).substring(2, 15);
    setQueryID(newQueryID);
    sendRequest(`${apiEndpointsContext.getThemeURL}`, 'GET', null, newQueryID);
  }, [apiEndpointsContext.getThemeURL, sendRequest]);

  useEffect(() => {
    if (
      !isLoading &&
      !error &&
      data &&
      reqIdentifier === queryID &&
      typeof data === 'object'
    ) {
      setCurrentThemeOptions(data);
    }
  }, [data, error, isLoading, reqIdentifier, queryID]);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default CustomThemeProvider;
