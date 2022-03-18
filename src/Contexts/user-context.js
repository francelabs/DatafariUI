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

    case 'SET_USER_UI': {
      const newState = {
        ...userState,
      };
      newState.state.user.userUi = { ...action.userUi };
      return newState;
    }

    default:
      return userState;
  }
};

export const UserContext = React.createContext();

const SET_USER_LANGUAGE_ID = 'SET_USER_LANGUAGE_ID';
const UPDATE_USER_PREF_ID = 'UPDATE_USER_PREF_ID';

const UserContextProvider = (props) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { uiDefinition, dispatch: uiConfigDispatch } = useContext(UIConfigContext);
  const [queryID, setQueryID] = useState(null);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const { i18n } = useTranslation();

  const autoConnect = useCallback(() => {
    let newQueryID = Math.random().toString(36).substring(2, 15);
    setQueryID(newQueryID);
    sendRequest(`${apiEndpointsContext.currentUserURL}`, 'GET', null, newQueryID);
  }, [apiEndpointsContext.currentUserURL, sendRequest]);

  const updateUserLanguage = useCallback(
    (langugage) => {
      let newQueryID = SET_USER_LANGUAGE_ID;
      setQueryID(newQueryID);
      sendRequest(
        `${apiEndpointsContext.currentUserURL}`,
        'PUT',
        JSON.stringify({ lang: langugage }),
        newQueryID
      );
    },
    [apiEndpointsContext.currentUserURL, sendRequest]
  );

  const updateUserUiDefinition = useCallback(
    (userUi) => {
      let newQueryID = UPDATE_USER_PREF_ID;
      setQueryID(newQueryID);
      sendRequest(
        `${apiEndpointsContext.currentUserURL}`,
        'PUT',
        JSON.stringify({ uiConfig: userUi }),
        newQueryID
      );

      uiConfigDispatch({
        type: SET_UI_DEFINITION,
        definition: {
          ...uiDefinition,
          direction: userUi.direction,
          left: userUi.left,
          right: userUi.right,
          sources: userUi.sources,
        },
      });

      userDispatcher({
        type: 'SET_USER_UI',
        userUi,
      });
    },

    [apiEndpointsContext.currentUserURL, sendRequest, uiConfigDispatch, uiDefinition]
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

  useEffect(() => {
    let timer = null;

    if (!isLoading && !error && data) {
      if (SET_USER_LANGUAGE_ID === reqIdentifier) {
        // nothing to do in return when setting user language
        return;
      }

      if (data.status !== 'OK') {
        userDispatcher({ type: 'SET_GUEST' });
      } else {
        let userData = data.content;
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

        const { userUi = {} } = userData;
        uiConfigDispatch({
          type: SET_UI_DEFINITION,
          definition: {
            ...uiDefinition,
            ...userUi,
          },
        });

        timer = setTimeout(autoConnect, 60000);
      }
    } else if (!isLoading && error) {
      userDispatcher({ type: 'SET_GUEST' });
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
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
    uiDefinition,
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
