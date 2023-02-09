import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LicenceContext } from '../../Contexts/licence-context';
import { UserContext } from '../../Contexts/user-context';
import useEmailsAdmin from '../../Hooks/useEmailsAdmin';

const LicenceChecker = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [alertDisplayed, setAlertDisplayed] = useState(false);
  const { type, files, users, time, contact, isLoading, error, isError } = useContext(LicenceContext);
  const [emailAddress, setEmailAddress] = useState('');
  const {
    isLoading: emailAddressLoading,
    data,
    error: emailAddressError,
    reqIdentifier,
    getEmailsAdmin,
  } = useEmailsAdmin();
  const { state: userState } = useContext(UserContext);
  const MAIL_SUBJECT = 'Renew Datafari Licence';
  const fetchQueryID = 'FETCH_EMAILS_LICENCE_CHECKER';

  useEffect(() => {
    getEmailsAdmin(fetchQueryID);
  }, [getEmailsAdmin]);

  useEffect(() => {
    if (reqIdentifier === fetchQueryID) {
      if (!emailAddressLoading && !emailAddressError && data) {
        if (data.status === 'OK' && data.content.emails) {
          let emails = data.content.emails;
          if (emails.feedbacks && emails.feedbacks !== '') {
            setEmailAddress(emails.feedbacks);
          } else if (emails.bugs && emails.bugs !== '') {
            setEmailAddress(emails.bugs);
          }
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!emailAddressLoading && emailAddressError) {
        // Network / parsing error handling
      }
    }
  }, [data, emailAddressError, emailAddressLoading, reqIdentifier]);

  useEffect(() => {
    if (!isLoading && !error && type !== undefined && !alertDisplayed) {
      const isAdmin =
        userState.user &&
        userState.user.roles &&
        (userState.user.roles.indexOf('SearchAdministrator') !== -1 ||
          userState.user.roles.indexOf('SearchExpert') !== -1);
      if (isAdmin && (files !== 'valid' || time !== 'valid' || (users !== undefined && users !== 'valid'))) {
        setOpen(true);
        setAlertDisplayed(true);
      } else if (files === 'overdue' || time === 'overdue' || files === 'expired' || time === 'expired') {
        setOpen(true);
        setAlertDisplayed(true);
      }
    } else if (error) {
      setOpen(true);
      setAlertDisplayed(true);
    }
  }, [alertDisplayed, error, files, isLoading, setAlertDisplayed, setOpen, time, type, userState.user, users]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleContactClick = () => {
    handleClose();
  };

  const timeEndingContent = <Typography>{t('Your Datafari licence will expire soon.')}</Typography>;

  const timeOverdueContent = (
    <Typography>{t('Your Datafari licence has expired, Datafari will soon stop functioning.')}</Typography>
  );

  const timeExpiredContent = (
    <Typography>{t('Your Datafari licence has expired, search will not be available until it is renewed.')}</Typography>
  );

  const filesEndingContent = (
    <Typography>
      {t('The number of indexed files in Datafari is approaching the limit set by your licence.')}
    </Typography>
  );

  const filesOverdueContent = (
    <Typography>
      {t(
        'The number of indexed files in Datafari has overcome the limit set by your licence, please update it or Datafari will soon stop functioning.'
      )}
    </Typography>
  );

  const filesExpiredContent = (
    <Typography>
      {t(
        'The number of indexed files in Datafari has overcome the limit set by your licence, search has been disabled until the licence is updated.'
      )}
    </Typography>
  );

  const usersEndingContent = (
    <Typography>{t('The number of active users in Datafari is approaching the limit set by your licence.')}</Typography>
  );

  const usersExpiredContent = (
    <Typography>
      {t(
        'The number of active Datafari users is greater than the maximum set by your licence, ' +
          'new users connecting to Datafari will not be able to search. ' +
          'Consider upgrading the licence if you need to support more users.'
      )}
    </Typography>
  );

  const userActions = (
    <DialogActions>
      <Link href={`mailto:${emailAddress}?subject=${MAIL_SUBJECT}`}>
        <Button onClick={handleContactClick} color="secondary" variant="contained" size="small">
          {t('Contact admins')}
        </Button>
      </Link>
      <Button onClick={handleClose} color="secondary">
        {t('Dismiss')}
      </Button>
    </DialogActions>
  );

  const adminActions = (
    <DialogActions>
      <Link href={`mailto:${contact}?subject=${MAIL_SUBJECT}`}>
        <Button onClick={handleContactClick} color="secondary" variant="contained" size="small">
          {t('Ask for a new licence')}
        </Button>
      </Link>
      <Button onClick={handleClose} color="secondary">
        {t('Dismiss')}
      </Button>
    </DialogActions>
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('Licence issue')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isError ? (
            error.reason
          ) : (
            <>
              {time === 'ending' && timeEndingContent}
              {time === 'overdue' && timeOverdueContent}
              {time === 'expired' && timeExpiredContent}
              {files === 'ending' && filesEndingContent}
              {files === 'overdue' && filesOverdueContent}
              {files === 'expired' && filesExpiredContent}
              {users === 'ending' && usersEndingContent}
              {users === 'expired' && usersExpiredContent}
            </>
          )}
        </DialogContentText>
      </DialogContent>
      {userState.user &&
      userState.user.roles &&
      (userState.user.roles.indexOf('SearchAdministrator') !== -1 ||
        userState.user.roles.indexOf('SearchExpert') !== -1)
        ? adminActions
        : userActions}
    </Dialog>
  );
};

export default LicenceChecker;
