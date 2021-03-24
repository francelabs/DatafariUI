import React, { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  makeStyles,
  Divider,
  Link,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useEmailsAdmin from '../../Hooks/useEmailsAdmin';

const fetchQueryID = 'FETCH_EMAILS_BUG';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const FeedbackBugReportModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const DEFAULT_ACTION_TEXT = `${t('Browser')}: Firefox 85
${t('Operating System')}: Windows 10
${t('I was clicking advanced search after doing a first search...')}
${t('Or any other details')}`;
  const DEFAULT_BUG_TEXT = `${t('Date and time')}: 25/12/2020 at 23:59 GMT+1
${t('The advanced search interface did not show up...')}
${t('Or any other details')}`;
  const MAIL_SUBJECT = 'Datafari%20Bug%20Report';
  const [actionText, setActionText] = useState(DEFAULT_ACTION_TEXT);
  const [bugText, setBugText] = useState(DEFAULT_BUG_TEXT);
  const [emailAddress, setEmailAddress] = useState('');
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getEmailsAdmin,
  } = useEmailsAdmin();

  useEffect(() => {
    if (props.open) {
      getEmailsAdmin(fetchQueryID);
    }
  }, [getEmailsAdmin, props.open]);

  useEffect(() => {
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.status === 'OK' && data.content.emails) {
          let emails = data.content.emails;
          if (emails.bugs && emails.bugs !== '') {
            setEmailAddress(emails.bugs);
          } else if (emails.feedbacks && emails.feedbacks !== '') {
            setEmailAddress(emails.feedbacks);
          }
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [data, error, isLoading, reqIdentifier]);

  const sendFeedback = useCallback(() => {
    setActionText(DEFAULT_ACTION_TEXT);
    setBugText(DEFAULT_BUG_TEXT);
    props.onClose();
  }, [DEFAULT_ACTION_TEXT, DEFAULT_BUG_TEXT, props]);

  const actionTextChange = useCallback((event) => {
    const newValue = event.target.value;
    setActionText(newValue);
  }, []);

  const bugTextChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      setBugText(newValue);
    },
    [setBugText]
  );

  const handleClose = useCallback(() => {
    setActionText(DEFAULT_ACTION_TEXT);
    setBugText(DEFAULT_BUG_TEXT);
    props.onClose();
  }, [DEFAULT_ACTION_TEXT, DEFAULT_BUG_TEXT, props]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>
        {t('Give us your feedback')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-feedback-bug-action"
              label={t('While doing this')}
              value={actionText}
              helperText={t(
                'Describe what you were doing when the bug happened'
              )}
              onChange={actionTextChange}
              multiline={true}
              rows={4}
              variant="filled"
              color="secondary"
              fullWidth={true}
              className={classes.fieldsPadding}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-feedback-bug-result"
              label={t('I encountered the following bug')}
              value={bugText}
              onChange={bugTextChange}
              helperText={t('Give us as much details as possible')}
              multiline={true}
              rows={4}
              variant="filled"
              color="secondary"
              fullWidth={true}
              className={classes.fieldsPadding}
            />
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Link
          href={`mailto:${emailAddress}?subject=${MAIL_SUBJECT}&body=${encodeURIComponent(
            actionText
          )}%0A%0A${encodeURIComponent(bugText)}`}
        >
          <Button
            onClick={sendFeedback}
            color="secondary"
            variant="contained"
            size="small"
          >
            {t('Send us this feedback')}
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackBugReportModal;
