import React from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Divider,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';

const AboutModal = (props) => {
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
