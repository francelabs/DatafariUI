import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useRefreshSession from '../../Hooks/useRefreshSession';

export default function WarningSessionModal({ open = true, retryTimeSec = 15 }) {
  const [time, setTime] = useState(retryTimeSec);
  const { refreshSession } = useRefreshSession();
  const { t } = useTranslation();

  useEffect(() => {
    const ID = setTimeout(() => setTime(time - 1), 1000);

    return () => clearTimeout(ID);
  });

  useEffect(() => {
    if (time === 0) {
      handleRetry();
    }
  }, [time]);

  const handleRetry = () => {
    setTime(retryTimeSec);
    refreshSession();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>{t('Connection is lost')}</DialogTitle>
      <Divider />

      <DialogContent>
        <DialogContentText>{t('Connection with the server is lost')}</DialogContentText>
        <DialogContentText>
          {t('Do not continue your work until connection is restored')}
        </DialogContentText>
        <DialogContentText>{t('New try in {{time}}', { time })}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRetry} color="primary" variant="contained" size="small">
          {t('Retry now')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
