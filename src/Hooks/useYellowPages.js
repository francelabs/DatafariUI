import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useYellowPages = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);

  const getYellowPages = useCallback(
    (queryText) => {
      const url = new URL(`${apiEndpointsContext.getYellowPageURL}`, new URL(document.location.href));
      sendRequest(url, 'GET', null, queryText);
    },
    [apiEndpointsContext.getYellowPageURL, sendRequest]
  );

  return {
    getYellowPages: getYellowPages,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
  };
};

export default useYellowPages;
