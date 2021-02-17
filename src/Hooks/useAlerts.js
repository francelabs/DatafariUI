import { useCallback, useContext } from 'react';
import { APIEndpointsContext } from '../Contexts/api-endpoints-context';
import useHttp from './useHttp';

const useAlerts = () => {
  const {
    isLoading,
    data,
    error,
    sendRequest,
    reqIdentifier,
    clear,
  } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);

  const getEmptyAlertObject = useCallback(() => {
    return {
      core: '',
      mail: '',
      subject: '',
      filters: '',
      keyword: '',
      frequency: '',
    };
  }, []);

  const getAlerts = useCallback(
    (queryID, alertID) => {
      let url = new URL(
        apiEndpointsContext.currentUserAlertsURL,
        apiEndpointsContext.currentUserAlertsURL
      );
      if (alertID) {
        url = new URL(
          `${apiEndpointsContext.currentUserAlertsURL}/${alertID}`,
          apiEndpointsContext.currentUserAlertsURL
        );
      }
      sendRequest(url, 'GET', null, queryID);
    },
    [apiEndpointsContext.currentUserAlertsURL, sendRequest]
  );

  const addAlert = useCallback(
    (queryID, alert) => {
      sendRequest(
        `${apiEndpointsContext.currentUserAlertsURL}`,
        'POST',
        JSON.stringify(alert),
        queryID
      );
    },
    [apiEndpointsContext.currentUserAlertsURL, sendRequest]
  );

  const removeAlert = useCallback(
    (queryID, alert) => {
      if (alert['_id']) {
        const url = new URL(
          `${apiEndpointsContext.currentUserAlertsURL}/${alert['_id']}`,
          apiEndpointsContext.currentUserAlertsURL
        );
        sendRequest(url, 'DELETE', null, queryID);
      }
    },
    [apiEndpointsContext.currentUserAlertsURL, sendRequest]
  );

  const modifyAlert = useCallback(
    (queryID, alert) => {
      const url = new URL(
        `${apiEndpointsContext.currentUserAlertsURL}/${alert['_id']}`,
        apiEndpointsContext.currentUserAlertsURL
      );
      sendRequest(url, 'PUT', JSON.stringify(alert), queryID);
    },
    [apiEndpointsContext.currentUserAlertsURL, sendRequest]
  );

  return {
    getAlerts: getAlerts,
    addAlert: addAlert,
    removeAlert: removeAlert,
    modifyAlert: modifyAlert,
    getEmptyAlertObject: getEmptyAlertObject,
    isLoading: isLoading,
    data: data,
    error: error,
    reqIdentifier: reqIdentifier,
    clear: clear,
  };
};

export default useAlerts;
