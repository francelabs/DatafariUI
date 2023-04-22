import React, { useContext, useEffect, useState } from 'react';
import WarningSessionModal from '../Components/Modal/WarningSessionModal';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';

const DEFAULT_CHECK_INTERVAL_MS = 15_000;
const LOGGED = 'Logged';

function useRefreshSession() {
  const [startRefresh, setStartRefresh] = useState(false);
  const [lastData, setLastData] = useState({});
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [infoComponent, setInfoComponent] = useState();

  const {
    apiEndpointsContext,
    httpClients: { baseApiClient },
  } = useContext(APIEndpointsContext);

  function setSSOEnabled(resp) {
    // Determine if a SSO protocol is enabled
    const {
      samlEnabled = false,
      casEnabled = false,
      kerberosEnabled = false,
      oidcEnabled = false,
      keycloakEnabled = false,
    } = resp;
    const ssoEnabled = samlEnabled || casEnabled || kerberosEnabled || oidcEnabled || keycloakEnabled;
    setSsoEnabled(ssoEnabled);
    return ssoEnabled;
  }

  const handleRefreshSessionResponse = async (res) => {
    if (res.status === 200) {
      setSSOEnabled(res.data);

      const { code, status, user } = res.data;
      if (code === 0 && status === LOGGED && (!lastData.user || lastData.user === user)) {
        setLastData(res.data);
        setInfoComponent();
        return;
      } else if (
        // code !== 0 means not ok with a user defined -> reload page
        (code !== 0 && !lastData.user) ||
        // code == 0 means ok with a user different than actual -> reload
        (code === 0 && lastData?.user !== res.data.user)
      ) {
        window.location.reload();
        return;
      }
    }

    if (
      res.status === 401 ||
      res.responseText?.indexOf('session has been expired') !== -1 ||
      (res.status === 0 && ssoEnabled)
    ) {
      window.location.reload();
    } else {
      setInfoComponent(<WarningSessionModal />);
    }
  };

  const handleRefreshSessionError = (error) => {
    console.error('Refresh session error', error);
    setInfoComponent(<WarningSessionModal />);
  };

  const refreshSession = () =>
    baseApiClient
      .get(apiEndpointsContext.refreshSessionURL)
      .then(handleRefreshSessionResponse)
      .catch(handleRefreshSessionError);

  const startRefreshSession = () => setStartRefresh((start) => !start);

  // Check session configuration
  useEffect(() => {
    baseApiClient.get(apiEndpointsContext.refreshSessionURL).then((res) => {
      // Auto login if SSO is enabled and user is not logged
      if (window && setSSOEnabled(res.data) && res?.data?.status !== LOGGED) {
        window.location.href = `${apiEndpointsContext.authURL.href}?callback=${window.location.href}`;
      }
    });
  }, []);

  // Start checking session
  useEffect(() => {
    if (startRefresh) {
      const intervalID = setInterval(refreshSession, DEFAULT_CHECK_INTERVAL_MS);

      return () => clearInterval(intervalID);
    }
  }, [startRefresh]);

  return {
    startRefreshSession,
    infoComponent,
  };
}

export default useRefreshSession;
