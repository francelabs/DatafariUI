import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useHelp = () => {
  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqIdentifier,
    clear,
  } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);

  const getHelp = useCallback(
    (queryID) => {
      let url = new URL(
        apiEndpointsContext.getHelpURL,
        apiEndpointsContext.getHelpURL
      );
      sendRequest(url, 'GET', null, queryID, {
        'Content-Type': 'text/html',
      });
    },
    [apiEndpointsContext.getHelpURL, sendRequest]
  );

  return {
    getHelp: getHelp,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
    clear: clear,
  };
};

export default useHelp;
