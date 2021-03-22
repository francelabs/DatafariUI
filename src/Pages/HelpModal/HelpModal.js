import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Divider,
  makeStyles,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import Spinner from '../../Components/Spinner/Spinner';
import useHelp from '../../Hooks/useHelp';

const fetchQueryID = 'FETCH_HELP';

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const HelpModal = (props) => {
  const classes = useStyles();
  const { isLoading, data, error, reqIdentifier, getHelp, clear } = useHelp();
  const { t } = useTranslation();
  const [helpContent, setHelpContent] = useState(null);

  const handleClose = () => {
    props.onClose();
    setHelpContent(null);
    clear();
  };

  useEffect(() => {
    if (props.open && !isLoading && !data && helpContent === null && !error) {
      getHelp(fetchQueryID);
    }
  }, [helpContent, data, getHelp, isLoading, props.open, error]);

  useEffect(() => {
    // Effect for fetching help content
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data) {
        setHelpContent(data);
        clear();
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [reqIdentifier, data, isLoading, error, setHelpContent, clear]);

  useEffect(() => {
    // Effect for removing alert query
    if (reqIdentifier !== fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.status === 'OK') {
          setHelpContent((currentAlerts) => {
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
  }, [reqIdentifier, data, isLoading, error, setHelpContent]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('Search Tips')}</DialogTitle>
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
          {error && (
            <div>
              {t(
                'An error occured while retrieving the data, if this error persists contact an administrator'
              )}
            </div>
          )}
          {!error && (
            <div dangerouslySetInnerHTML={{ __html: helpContent }}></div>
          )}
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
    </Dialog>
  );
};

export default HelpModal;
