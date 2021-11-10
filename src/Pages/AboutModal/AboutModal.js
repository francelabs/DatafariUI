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

const AboutModal = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('About DatafariUI')}</DialogTitle>
      <Divider />
      <DialogContent>
        Version {process.env.REACT_APP_DATAFARIUI_VERSION} - commit
        {process.env.REACT_APP_DATAFARIUI_COMMIT}
      </DialogContent>
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

export default AboutModal;
