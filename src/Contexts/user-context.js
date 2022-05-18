import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import esLocale from 'date-fns/locale/es';
import frLocale from 'date-fns/locale/fr';
import itLocale from 'date-fns/locale/it';
import ptLocale from 'date-fns/locale/pt';
import ruLocale from 'date-fns/locale/ru';
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useHttp from '../Hooks/useHttp';
import { APIEndpointsContext } from './api-endpoints-context';
import { SET_UI_DEFINITION, UIConfigContext } from './ui-config-context';

// Used UI locales
const DatafariUILocales = {
  de: { locale: deLocale, dateFormat: 'dd.MM.yyyy' },
  en: { locale: enLocale, dateFormat: 'MM/dd/yyyy' },
  es: { locale: esLocale, dateFormat: 'dd/MM/yyyy' },
  fr: { locale: frLocale, dateFormat: 'dd/MM/yyyy' },
  it: { locale: itLocale, dateFormat: 'dd/MM/yyyy' },
  pt: { locale: ptLocale, dateFormat: 'dd/MM/yyyy' },
  pt_br: { locale: ptLocale, dateFormat: 'dd/MM/yyyy' },
  ru: { locale: ruLocale, dateFormat: 'dd.MM.yyyy' },
};

const initialState = {
  state: {
    user: null,
    language: '',
    userLocale: '',
    isLoading: false,
    error: null,
  },
  actions: {
    autoConnect: () => {},
  },
};

const userReducer = (userState, action) => {
  switch (action.type) {
    case 'SET_GUEST':
      return {
        ...userState,
        state: {
          ...userState.state,
          user: null,
        },
      };

    case 'SET_AUTHENTICATED_USER':
      return {
        ...userState,
        state: {
          ...userState.state,
          user: action.user,
        },
      };

    case 'SET_LANGUAGE': {
      return {
        ...userState,
        state: {
          ...userState.state,
          language: action.language,
          userLocale: action.locale,
        },
      };
    }

    default:
      return userState;
  }
};

export const UserContext = React.createContext();

const USER_LOGIN = 'USER_LOGIN';
const SET_USER_LANGUAGE_ID = 'SET_USER_LANGUAGE_ID';
const UPDATE_USER_PREF_ID = 'UPDATE_USER_PREF_ID';
const AUTOCONNECT_ID = 'AUTOCONNECT_ID';

const UserContextProvider = (props) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { dispatch: uiConfigDispatch } = useContext(UIConfigContext);
  const [queryID, setQueryID] = useState(null);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const { i18n } = useTranslation();

  const autoConnect = useCallback(() => {
    setQueryID(USER_LOGIN);
    sendRequest(`${apiEndpointsContext.currentUserURL}`, 'GET', AUTOCONNECT_ID, USER_LOGIN);
  }, [apiEndpointsContext.currentUserURL, sendRequest]);

  const updateUserLanguage = useCallback(
    (langugage) => {
      setQueryID(SET_USER_LANGUAGE_ID);
      sendRequest(
        `${apiEndpointsContext.currentUserURL}`,
        'PUT',
        JSON.stringify({ lang: langugage }),
        SET_USER_LANGUAGE_ID
      );
    },
    [apiEndpointsContext.currentUserURL, sendRequest]
  );

  const updateUserUiDefinition = useCallback(
    (userUi) => {
      setQueryID(UPDATE_USER_PREF_ID);
      sendRequest(
        `${apiEndpointsContext.currentUserURL}`,
        'PUT',
        JSON.stringify({ uiConfig: userUi }),
        UPDATE_USER_PREF_ID
      );
    },

    [apiEndpointsContext.currentUserURL, sendRequest]
  );

  const actions = useMemo(() => {
    return {
      autoConnect,
      updateUserLanguage,
      updateUserUiDefinition,
    };
  }, [autoConnect, updateUserLanguage, updateUserUiDefinition]);

  // Define user state
  const [userState, userDispatcher] = useReducer(userReducer, {
    ...initialState,
    actions,
  });

  // Effect when user changed language, user logged in or user saved preferences
  useEffect(() => {
    if (!isLoading && !error && data) {
      if (data.status !== 'OK') {
        userDispatcher({ type: 'SET_GUEST' });
      } else {
        let userData = data.content;
        // If it is an autoconnect request, perform changes only if the user name has changed
        if (reqIdentifier !== AUTOCONNECT_ID || userData.user !== userState.state.user) {
          userDispatcher({
            type: 'SET_AUTHENTICATED_USER',
            user: userData,
          });

          // Set language according to user language
          const { lang } = userData;
          try {
            if (lang) {
              new Intl.Locale(lang); // If no error thrown, it's a valid language

              i18n.changeLanguage(lang);
            }
          } catch (error) {
            console.error('Error change language', error, lang);
          }

          // Dispatch UI configuration from user preference, only direction, left, right and sources
          const { uiConfig = {} } = userData; // uiConfig is the key from backend
          uiConfigDispatch({
            type: SET_UI_DEFINITION,
            uiDefinition: uiConfig,
          });
        }

        // add a timeout for autoconnect
        const timer = setTimeout(autoConnect, 60000);

        return () => clearTimeout(timer);
      }
    } else if (!isLoading && error) {
      userDispatcher({ type: 'SET_GUEST' });
    }
  }, [
    autoConnect,
    data,
    error,
    isLoading,
    queryID,
    reqIdentifier,
    i18n,
    userDispatcher,
    uiConfigDispatch,
  ]);

  const getLocale = useCallback(() => {
    if (i18n.language && DatafariUILocales[i18n.language]) {
      return DatafariUILocales[i18n.language];
    }
    return enLocale;
  }, [i18n.language]);

  // Effect on language change
  useEffect(() => {
    userDispatcher({
      type: 'SET_LANGUAGE',
      language: i18n.language,
      locale: getLocale(),
    });
  }, [i18n.language, getLocale]);

  return <UserContext.Provider value={userState}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;
