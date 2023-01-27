import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const usePrivacyPolicy = () => {
  const { isLoading, data, error, sendRequest, reqIdentifier, clear } = useHttp();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const { i18n } = useTranslation();

  const getPrivacyPolicy = useCallback(
    (queryID) => {
      let lang = i18n.language;
      let url = new URL(
        `${apiEndpointsContext.getPrivacyPolicyURL}/${lang}`,
        apiEndpointsContext.getPrivacyPolicyURL
      );
      sendRequest(url, 'GET', null, queryID, {
        'Content-Type': 'text/html',
      });
    },
    [apiEndpointsContext.getPrivacyPolicyURL, i18n.language, sendRequest]
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
