import { useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';

const useLicence = () => {
  const {
    apiEndpointsContext,
    httpClients: { restApiClient },
  } = useContext(APIEndpointsContext);

  const getLicence = useCallback(
    () => restApiClient.get(apiEndpointsContext.licenceURL),
    [apiEndpointsContext.licenceURL, restApiClient]
  );

  const { status, data, error } = useQuery('getLicence', getLicence);

  return {
    getLicence,
    isLoading: status === 'loading',
    data: data?.data ?? undefined,
    isError: status === 'error',
    error,
  };
};

export default useLicence;
