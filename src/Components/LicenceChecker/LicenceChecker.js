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
  const { type, files, users, time, contact, isLoading, error } = useContext(
    LicenceContext
  );
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
      if (
        files !== 'valid' ||
        time !== 'valid' ||
        (users !== undefined && users !== 'valid')
      ) {
        setOpen(true);
        setAlertDisplayed(true);
      }
    }
  }, [
    alertDisplayed,
    error,
    files,
    isLoading,
    setAlertDisplayed,
    setOpen,
    time,
    type,
    users,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleContactClick = () => {
    handleClose();
  };

  const timeEndingContent = (
    <Typography>{t('Datafari licence expiracy date is close.')}</Typography>
  );

  const timeOverdueContent = (
    <Typography>
      {t(
        'Datafari licence expiracy date is passed, Datafari will soon cease to function.'
      )}
    </Typography>
  );

  const timeExpiredContent = (
    <Typography>
      {t(
        'Datafari licence expiracy date passed, licence has expired and search will not be available until it is renewed.'
      )}
    </Typography>
  );

  const filesEndingContent = (
    <Typography>
      {t('Datafari indexed files is close to the licence limit.')}
    </Typography>
  );

  const filesOverdueContent = (
    <Typography>
      {t(
        'Datafari indexed files licence limit has been overtaken, licence update is required or Datafari will cease to function.'
      )}
    </Typography>
  );

  const filesExpiredContent = (
    <Typography>
      {t(
        'Datafari indexed files licence limit has been greatly overtaken, Datafari search capabilities are disabled until the licence is updated.'
      )}
    </Typography>
  );

  const usersEndingContent = (
    <Typography>
      {t(
        'Datafari active users is close to its maximum allowed by the licence.'
      )}
    </Typography>
  );

  const usersExpiredContent = (
    <Typography>
      {t(
        'Datafari active users has reached the maximum number of users allowed by the licence, ' +
          'new users coming to Datafari cannot use the search engine. ' +
          'Consider upgrading the licence if you need to support more users.'
      )}
    </Typography>
  );

  const userActions = (
    <DialogActions>
      <Link href={`mailto:${emailAddress}?subject=${MAIL_SUBJECT}`}>
        <Button
          onClick={handleContactClick}
          color="secondary"
          variant="contained"
          size="small"
        >
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
        <Button
          onClick={handleContactClick}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Contact for a new licence')}
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
          {time === 'ending' && timeEndingContent}
          {time === 'overdue' && timeOverdueContent}
          {time === 'expired' && timeExpiredContent}
          {files === 'ending' && filesEndingContent}
          {files === 'overdue' && filesOverdueContent}
          {files === 'expired' && filesExpiredContent}
          {users === 'ending' && usersEndingContent}
          {users === 'expired' && usersExpiredContent}
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
