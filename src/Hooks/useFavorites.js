import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useFavorites = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);

  const getFavorites = useCallback(
    (queryID, docIDs) => {
      const url = new URL(
        `${apiEndpointsContext.currentUserFavoritesURL}`,
        new URL(document.location.href)
      );
      if (docIDs) {
        url.searchParams.set('documentsID', docIDs);
      }
      sendRequest(url, 'GET', null, queryID);
    },
    [apiEndpointsContext.currentUserFavoritesURL, sendRequest]
  );

  const addFavorite = useCallback(
    (queryID, docID, docTitle) => {
      const favorite = {
        id: docID,
        title: docTitle,
      };
      sendRequest(
        `${apiEndpointsContext.currentUserFavoritesURL}`,
        'POST',
        JSON.stringify(favorite),
        queryID
      );
    },
    [apiEndpointsContext.currentUserFavoritesURL, sendRequest]
  );

  const removeFavorite = useCallback(
    (queryID, docID) => {
      const body = {
        id: docID,
      };
      sendRequest(
        `${apiEndpointsContext.currentUserFavoritesURL}`,
        'DELETE',
        JSON.stringify(body),
        queryID
      );
    },
    [apiEndpointsContext.currentUserFavoritesURL, sendRequest]
  );

  const getFavoritesStatus = useCallback(
    (queryID) => {
      sendRequest(`${apiEndpointsContext.favoritesStatusURL}`, 'GET', null, queryID);
    },
    [apiEndpointsContext.favoritesStatusURL, sendRequest]
  );

  return {
    getFavorites: getFavorites,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
    getFavoritesStatus: getFavoritesStatus,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
  };
};

export default useFavorites;
