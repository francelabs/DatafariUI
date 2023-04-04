import React, { useContext, useEffect, useState } from 'react';

import { CssBaseline, ThemeProvider } from '@material-ui/core';

import { createTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import Spinner from '../Spinner/Spinner';

const CustomThemeProvider = (props) => {
  const { i18n } = useTranslation();
  const [theme, setTheme] = useState();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);

  useEffect(() => {
    const fetchTheme = async () => {
      const themeFromServer = await (await fetch(`${apiEndpointsContext.getThemeURL}`)).json();
      setTheme(createTheme(themeFromServer, i18n.language));
    };

    fetchTheme();
  }, [i18n.language, apiEndpointsContext.getThemeURL]);

  return theme ? (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        {props.children}
      </>
    </ThemeProvider>
  ) : (
    <Spinner />
  );
};

export default CustomThemeProvider;
