import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import useHttp from '../Hooks/useHttp';
import { APIEndpointsContext } from './api-endpoints-context';

const userReducer = (user, action) => {
  switch (action.type) {
    case 'SET_GUEST':
      return null;
    case 'SET_AUTHENTICATED_USER':
      return { ...user, ...action.user };
    default:
      return { ...user };
  }
};

export const UserContext = React.createContext({
  state: {
    user: null,
    isLoading: false,
    error: null,
  },
  actions: {
    autoConnect: () => {},
    login: (login, password) => {},
    logout: () => {},
  },
});

const UserContextProvider = (props) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const [queryID, setQueryID] = useState(null);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [user, userDispatcher] = useReducer(userReducer, null);

  const autoConnect = useCallback(() => {
    let newQueryID = Math.random().toString(36).substring(2, 15);
    setQueryID(newQueryID);
    sendRequest(
      `${apiEndpointsContext.currentUserURL}`,
      'GET',
      null,
      newQueryID
    );
  }, [apiEndpointsContext.currentUserURL, sendRequest]);

  const actions = useMemo(() => {
    return {
      autoConnect: autoConnect,
      login: (login, password) => {},
      logout: () => {},
    };
  }, [autoConnect]);

  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === queryID) {
      if (data.status !== 'OK') {
        userDispatcher({ type: 'SET_GUEST' });
      } else {
        let userData = data.content;
        userDispatcher({
          type: 'SET_AUTHENTICATED_USER',
          user: { ...userData },
        });
      }
    } else if (!isLoading && error) {
      userDispatcher({ type: 'SET_GUEST' });
    }
  }, [data, error, isLoading, queryID, reqIdentifier, userDispatcher]);

  return (
    <UserContext.Provider
      value={{
        state: {
          user: user,
          isLoading: isLoading,
          error: null,
        },
        actions: actions,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
