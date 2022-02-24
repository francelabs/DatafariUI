import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import deLocale from "date-fns/locale/de";
import enLocale from "date-fns/locale/en-US";
import esLocale from "date-fns/locale/es";
import frLocale from "date-fns/locale/fr";
import itLocale from "date-fns/locale/it";
import ptLocale from "date-fns/locale/pt";
import ruLocale from "date-fns/locale/ru";
import { useTranslation } from "react-i18next";
import useHttp from "../Hooks/useHttp";
import { APIEndpointsContext } from "./api-endpoints-context";

// Used UI locales
const DatafariUILocales = {
  de: { locale: deLocale, dateFormat: "dd.MM.yyyy" },
  en: { locale: enLocale, dateFormat: "MM/dd/yyyy" },
  es: { locale: esLocale, dateFormat: "dd/MM/yyyy" },
  fr: { locale: frLocale, dateFormat: "dd/MM/yyyy" },
  it: { locale: itLocale, dateFormat: "dd/MM/yyyy" },
  pt: { locale: ptLocale, dateFormat: "dd/MM/yyyy" },
  pt_br: { locale: ptLocale, dateFormat: "dd/MM/yyyy" },
  ru: { locale: ruLocale, dateFormat: "dd.MM.yyyy" },
};

const initialState = {
  state: {
    user: null,
    language: "",
    userLocale: "",
    isLoading: false,
    error: null,
  },
  actions: {
    autoConnect: () => {},
  },
};

const userReducer = (userState, action) => {
  switch (action.type) {
    case "SET_GUEST":
      return {
        ...userState,
        state: {
          ...userState.state,
          user: null,
        },
      };

    case "SET_AUTHENTICATED_USER":
      return { ...userState, ...action.user };

    case "SET_LANGUAGE": {
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

const UserContextProvider = (props) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const [queryID, setQueryID] = useState(null);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const { i18n } = useTranslation();

  const autoConnect = useCallback(() => {
    let newQueryID = Math.random().toString(36).substring(2, 15);
    setQueryID(newQueryID);
    sendRequest(
      `${apiEndpointsContext.currentUserURL}`,
      "GET",
      null,
      newQueryID
    );
  }, [apiEndpointsContext.currentUserURL, sendRequest]);

  const actions = useMemo(() => {
    return {
      autoConnect: autoConnect,
    };
  }, [autoConnect]);

  // Define user state
  const [userState, userDispatcher] = useReducer(userReducer, {
    ...initialState,
    actions,
  });

  useEffect(() => {
    let timer = null;
    if (!isLoading && !error && data && reqIdentifier === queryID) {
      if (data.status !== "OK") {
        userDispatcher({ type: "SET_GUEST" });
      } else {
        let userData = data.content;
        userDispatcher({
          type: "SET_AUTHENTICATED_USER",
          user: { ...userData },
        });
        timer = setTimeout(autoConnect, 60000);
      }
    } else if (!isLoading && error) {
      userDispatcher({ type: "SET_GUEST" });
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
    userDispatcher,
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
      type: "SET_LANGUAGE",
      language: i18n.language,
      locale: getLocale(),
    });
  }, [i18n.language, getLocale]);

  return (
    <UserContext.Provider value={userState}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
