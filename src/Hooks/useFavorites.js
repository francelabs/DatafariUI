import { useCallback } from 'react';
import useHttp from './useHttp';

const useFavorites = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const baseURL = '/Datafari';

  const getFavorites = useCallback(
    (queryID, docIDs) => {
      const url = new URL(
        `${baseURL}/GetFavorites`,
        new URL(document.location.href)
      );
      if (docIDs) {
        url.searchParams.set('documentsID', docIDs);
      }
      sendRequest(url, 'GET', null, queryID);
    },
    [sendRequest]
  );

  const addFavorite = useCallback(
    (queryID, docID, docTitle) => {
      const formData = new FormData();
      formData.append('idDocument', docID);
      formData.append('titleDocument', docTitle);
      const body = new URLSearchParams(formData);
      sendRequest(`${baseURL}/addFavorite`, 'POST', body, queryID, {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      });
    },
    [sendRequest]
  );

  const removeFavorite = useCallback(
    (queryID, docID) => {
      const formData = new FormData();
      formData.append('idDocument', docID);
      const body = new URLSearchParams(formData);
      sendRequest(`${baseURL}/deleteFavorite`, 'POST', body, queryID, {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      });
    },
    [sendRequest]
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
