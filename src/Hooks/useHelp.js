import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useHelp = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier, clear } = useHttp();
  const { i18n } = useTranslation();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);

  const getHelp = useCallback(
    (queryID) => {
      let lang = i18n.language;
      let url = new URL(
        `${apiEndpointsContext.getHelpURL}/${lang}`,
        apiEndpointsContext.getHelpURL
      );
      sendRequest(url, 'GET', null, queryID, {
        'Content-Type': 'text/html',
      });
    },
    [apiEndpointsContext.getHelpURL, i18n.language, sendRequest]
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
