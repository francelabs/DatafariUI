import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const usePrivacyPolicy = () => {
  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqIdentifier,
    clear,
  } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);

  const getPrivacyPolicy = useCallback(
    (queryID) => {
      let url = new URL(
        apiEndpointsContext.getPrivacyPolicyURL,
        apiEndpointsContext.getPrivacyPolicyURL
      );
      sendRequest(url, 'GET', null, queryID, {
        'Content-Type': 'text/html',
      });
    },
    [apiEndpointsContext.getPrivacyPolicyURL, sendRequest]
  );

  return {
    getPrivacyPolicy: getPrivacyPolicy,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
    clear: clear,
  };
};

export default usePrivacyPolicy;
