import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useDirectAccess = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);

  const getDirectAccess = useCallback(
    (queryText) => {
      const url = new URL(`${apiEndpointsContext.getDirectAccessURL + queryText}`, new URL(document.location.href));
      sendRequest(url, 'GET', null, queryText);
    },
    [apiEndpointsContext.getDirectAccessURL, sendRequest]
  );

  return {
    getDirectAccess: getDirectAccess,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
  };
};

export default useDirectAccess;
