import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useFavorites = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);

  const getFavorites = useCallback(
    (queryID, docIDs) => {
      const url = new URL(
        `${apiEndpointsContext.getFavoritesURL}`,
        new URL(document.location.href)
      );
      if (docIDs) {
        url.searchParams.set('documentsID', docIDs);
      }
      sendRequest(url, 'GET', null, queryID);
    },
    [apiEndpointsContext.getFavoritesURL, sendRequest]
  );

  const addFavorite = useCallback(
    (queryID, docID, docTitle) => {
      const formData = new FormData();
      formData.append('idDocument', docID);
      formData.append('titleDocument', docTitle);
      const body = new URLSearchParams(formData);
      sendRequest(
        `${apiEndpointsContext.addFavoriteURL}`,
        'POST',
        body,
        queryID,
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      );
    },
    [apiEndpointsContext.addFavoriteURL, sendRequest]
  );

  const removeFavorite = useCallback(
    (queryID, docID) => {
      const formData = new FormData();
      formData.append('idDocument', docID);
      const body = new URLSearchParams(formData);
      sendRequest(
        `${apiEndpointsContext.deleteFavoriteURL}`,
        'POST',
        body,
        queryID,
        {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      );
    },
    [apiEndpointsContext.deleteFavoriteURL, sendRequest]
  );

  return {
    getFavorites: getFavorites,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
  };
};

export default useFavorites;
