import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useSavedSearches = () => {
  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqIdentifier,
    clear,
  } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);

  const getEmptySavedSearchObject = useCallback(() => {
    return {
      name: '',
      search: '',
    };
  }, []);

  const getSavedSearches = useCallback(
    (queryID, savedSearchName) => {
      let url = new URL(
        apiEndpointsContext.currentUserSavedSearchesURL,
        apiEndpointsContext.currentUserSavedSearchesURL
      );
      if (savedSearchName) {
        url = new URL(
          `${apiEndpointsContext.currentUserSavedSearchesURL}/${savedSearchName}`,
          apiEndpointsContext.currentUserSavedSearchesURL
        );
      }
      sendRequest(url, 'GET', null, queryID);
    },
    [apiEndpointsContext.currentUserSavedSearchesURL, sendRequest]
  );

  const addSavedSearch = useCallback(
    (queryID, savedSearch) => {
      sendRequest(
        `${apiEndpointsContext.currentUserSavedSearchesURL}`,
        'POST',
        JSON.stringify(savedSearch),
        queryID
      );
    },
    [apiEndpointsContext.currentUserSavedSearchesURL, sendRequest]
  );

  const removeSavedSearch = useCallback(
    (queryID, savedSearch) => {
      if (savedSearch.name) {
        const url = new URL(
          `${apiEndpointsContext.currentUserSavedSearchesURL}/${savedSearch.name}`,
          apiEndpointsContext.currentUserSavedSearchesURL
        );
        sendRequest(url, 'DELETE', null, queryID);
      }
    },
    [apiEndpointsContext.currentUserSavedSearchesURL, sendRequest]
  );

  const modifySavedSearch = useCallback(
    (queryID, savedSearch) => {
      const url = new URL(
        `${apiEndpointsContext.currentUserSavedSearchesURL}/${savedSearch.name}`,
        apiEndpointsContext.currentUserSavedSearchesURL
      );
      sendRequest(url, 'PUT', savedSearch, queryID);
    },
    [apiEndpointsContext.currentUserSavedSearchesURL, sendRequest]
  );

  return {
    getSavedSearches: getSavedSearches,
    addSavedSearch: addSavedSearch,
    removeSavedSearch: removeSavedSearch,
    modifySavedSearch: modifySavedSearch,
    getEmptySavedSearchObject: getEmptySavedSearchObject,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
    clear: clear,
  };
};

export default useSavedSearches;
