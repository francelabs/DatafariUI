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
import usePrivacyPolicy from '../../Hooks/usePrivacyPolicy';

const fetchQueryID = 'FETCH_PRIVACY_POLICY';

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const PrivacyPolicyModal = (props) => {
  const classes = useStyles();
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getPrivacyPolicy,
    clear,
  } = usePrivacyPolicy();
  const { t } = useTranslation();
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState(null);

  const handleClose = () => {
    props.onClose();
    setPrivacyPolicyContent(null);
    clear();
  };

  useEffect(() => {
    if (
      props.open &&
      !isLoading &&
      !data &&
      privacyPolicyContent === null &&
      !error
    ) {
      getPrivacyPolicy(fetchQueryID);
    }
  }, [
    privacyPolicyContent,
    data,
    getPrivacyPolicy,
    isLoading,
    props.open,
    error,
  ]);

  useEffect(() => {
    // Effect for fetching help content
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data && data.status) {
        if (data.status === 'OK') {
          setPrivacyPolicyContent(data.content.htmlPrivacyContent);
          clear();
        } else {
          //servlet generated error response
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [reqIdentifier, data, isLoading, error, setPrivacyPolicyContent, clear]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('Privacy Policy')}</DialogTitle>
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
            <div
              dangerouslySetInnerHTML={{ __html: privacyPolicyContent }}
            ></div>
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

export default PrivacyPolicyModal;
