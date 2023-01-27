import React, { useContext, useEffect, useState } from 'react';
import WarningSessionModal from '../Components/Modal/WarningSessionModal';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';

const DEFAULT_CHECK_INTERVAL_MS = 15_000;
const LOGGED = 'Logged';

function useRefreshSession() {
  const [lastData, setLastData] = useState({});
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [infoComponent, setInfoComponent] = useState();

  const {
    apiEndpointsContext,
    httpClients: { baseApiClient },
  } = useContext(APIEndpointsContext);

  function setSSOEnabled(resp) {
    // Determine if a SSO protocol is enabled
    const { samlEnabled = false, casEnabled = false, kerberosEnabled = false } = resp;
    setSsoEnabled(samlEnabled || casEnabled || kerberosEnabled);
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

  // Start checking session
  useEffect(() => {
    const intervalID = setInterval(refreshSession, DEFAULT_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalID);
  }, []);

  return {
    refreshSession,
    infoComponent,
  };
}

export default useRefreshSession;
