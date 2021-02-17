import React, { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  Divider,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
// eslint-disable-next-line no-unused-vars
import NotificationsIcon from '@material-ui/icons/Notifications';
// eslint-disable-next-line no-unused-vars
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useAlerts from '../../Hooks/useAlerts';
import ModifyAlertModal from '../ModifyAlertModal/ModifyAlertModal';
import Spinner from '../../Components/Spinner/Spinner';

const fetchQueryID = 'FETCH_ALERTS';

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const ManageAlertsModal = (props) => {
  const classes = useStyles();
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getAlerts,
    removeAlert,
    clear,
  } = useAlerts();
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState(null);
  const [alertToEdit, setAlertToEdit] = useState(null);

  const handleClose = () => {
    props.onClose();
    setAlerts(null);
  };

  useEffect(() => {
    if (props.open && !isLoading && !data && alerts === null) {
      getAlerts(fetchQueryID);
    }
  }, [alerts, data, getAlerts, isLoading, props.open]);

  useEffect(() => {
    // Effect for fetching alerts query
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.status === 'OK') {
          setAlerts(data.content.alerts);
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
        clear();
      } else if (!isLoading && error) {
        // Network / parsing error handling
        clear();
      }
    }
  }, [reqIdentifier, data, isLoading, error, setAlerts, clear]);

  useEffect(() => {
    // Effect for removing alert query
    if (reqIdentifier !== fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.status === 'OK') {
          setAlerts((currentAlerts) => {
            const alertsIDs = currentAlerts.map((alert) => alert._id);
            if (alertsIDs.indexOf(reqIdentifier) !== -1) {
              const newAlerts = currentAlerts.slice(0, currentAlerts.length);
              newAlerts.splice(alertsIDs.indexOf(reqIdentifier), 1);
              return newAlerts;
            } else {
              return currentAlerts;
            }
          });
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [reqIdentifier, data, isLoading, error, setAlerts]);

  const handleRemove = useCallback(
    (alert) => {
      removeAlert(alert._id, alert);
    },
    [removeAlert]
  );

  const handleEditModalClose = useCallback(() => {
    setAlertToEdit(null);
    getAlerts(fetchQueryID);
  }, [getAlerts]);

  const prepareString = (string, maxlen) => {
    let result = '';
    if (Array.isArray(string)) {
      try {
        result = decodeURIComponent(string[0]);
      } catch (e) {
        result = string[0];
      }
    } else if (string !== undefined && string !== null) {
      try {
        result = decodeURIComponent(string);
      } catch (e) {
        result = string;
      }
    }
    if (result.length > maxlen) {
      result = (
        <Tooltip title={result} placement="right" aria-label={result}>
          <span>
            {result.substring(0, Math.floor((maxlen - 3) / 2)) +
              '...' +
              result.substring(
                result.length - (maxlen - 3 - Math.floor((maxlen - 3) / 2))
              )}
          </span>
        </Tooltip>
      );
    }
    return result;
  };

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('My Alerts')}</DialogTitle>
      <Divider />
      {isLoading && (
        <DialogContent className={classes.spinnerContainer}>
          <div>
            <Spinner />
          </div>
        </DialogContent>
      )}
      {!isLoading && (
        <DialogContent>
          <TableContainer>
            <Table size="small" stickyHeader aria-label="alerts table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Name')}</TableCell>
                  <TableCell>{t('Keywords')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {error && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      {t(
                        'An error occured while retrieving the data, if this error persists contact an administrator'
                      )}
                    </TableCell>
                  </TableRow>
                )}
                {!error &&
                  alerts !== null &&
                  alerts.length > 0 &&
                  alerts.map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row._id}>
                        <TableCell>{row.subject}</TableCell>
                        <TableCell>{prepareString(row.keyword, 50)}</TableCell>
                        <TableCell>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => setAlertToEdit(row)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          {/* <IconButton edge="end" aria-label="activateAlert" size='small'>
                            <NotificationsIcon />
                          </IconButton> */}
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              handleRemove(row);
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Exit')}
        </Button>
      </DialogActions>
      <ModifyAlertModal
        onClose={handleEditModalClose}
        open={alertToEdit !== null}
        alert={alertToEdit}
      />
    </Dialog>
  );
};

export default ManageAlertsModal;
