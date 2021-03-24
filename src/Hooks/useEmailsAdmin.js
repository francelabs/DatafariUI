import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useEmailsAdmin = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);

  const getEmailsAdmin = useCallback(
    (queryID, docIDs) => {
      const url = new URL(
        `${apiEndpointsContext.getEmailsAdminURL}`,
        new URL(document.location.href)
      );
      if (docIDs) {
        url.searchParams.set('documentsID', docIDs);
      }
      sendRequest(url, 'GET', null, queryID);
    },
    [apiEndpointsContext.getEmailsAdminURL, sendRequest]
  );

  return {
    getEmailsAdmin: getEmailsAdmin,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
  };
};

export default useEmailsAdmin;
