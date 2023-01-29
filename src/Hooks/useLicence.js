import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useLicence = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);

  const getLicence = useCallback(
    (queryID) => {
      const url = new URL(`${apiEndpointsContext.licenceURL}`, new URL(document.location.href));
      throw new Error('MyError');
      return sendRequest(url, 'GET', null, queryID);
    },
    [apiEndpointsContext.licenceURL, sendRequest]
  );

  return {
    getLicence: getLicence,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
  };
};

export default useLicence;
