import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
  Typography,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useEmailsAdmin from '../../Hooks/useEmailsAdmin';

const fetchQueryID = 'FETCH_EMAILS_PRIVACY_SETTINGS';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const PrivacySettingsModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const MAIL_SUBJECT = 'Datafari Privacy Settings Question';
  const DEFAULT_QUESTION_TEXT = useMemo(() => t('I want to know ...'), [t]);
  const DEFAULT_CONTACT_TEXT = useMemo(
    () => `${t('Email')}: my.email@work
${t('Phone')}: 123456789
${t('or any means')}`,
    [t]
  );
  const [questionText, setQuestionText] = useState(DEFAULT_QUESTION_TEXT);
  const [contactText, setContactText] = useState(DEFAULT_CONTACT_TEXT);
  const [emailAddress, setEmailAddress] = useState('');
  const { isLoading, data, error, reqIdentifier, getEmailsAdmin } =
    useEmailsAdmin();

  useEffect(() => {
    if (props.open) {
      getEmailsAdmin(fetchQueryID);
      setQuestionText(DEFAULT_QUESTION_TEXT);
      setContactText(DEFAULT_CONTACT_TEXT);
    }
  }, [DEFAULT_CONTACT_TEXT, DEFAULT_QUESTION_TEXT, getEmailsAdmin, props.open]);

  useEffect(() => {
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.status === 'OK' && data.content.emails) {
          let emails = data.content.emails;
          if (emails.dpo && emails.dpo !== '') {
            setEmailAddress(emails.dpo);
          } else if (emails.feedbacks && emails.feedbacks !== '') {
            setEmailAddress(emails.feedbacks);
          } else if (emails.bugs && emails.bugs !== '') {
            setEmailAddress(emails.bugs);
          }
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [data, error, isLoading, reqIdentifier]);

  const handleClose = useCallback(() => {
    props.onClose();
  }, [props]);

  const questionTextChange = useCallback((event) => {
    setQuestionText(event.target.value);
  }, []);

  const contactTextChange = useCallback((event) => {
    setContactText(event.target.value);
  }, []);

  const sendFeedback = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle onClose={props.onClose}>{t('Privacy Settings')}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Typography>
              {t(
                'For any question and settings about privacy, you should contact the DPO. You can prepare an email using the form below.'
              )}
            </Typography>
            <TextField
              id="datafari-privacy-settings-question"
              label={t('Your question')}
              value={questionText}
              onChange={questionTextChange}
              helperText={t(
                'Type here your privacy settings related questions'
              )}
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
              id="datafari-privacy-settings-contact-back"
              label={t('How do you want us to contact you back')}
              value={contactText}
              onChange={contactTextChange}
              helperText={t('Tell us how to contact you (optional)')}
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
            questionText
          )}%0A%0A${encodeURIComponent(contactText)}`}
        >
          <Button
            onClick={sendFeedback}
            color="secondary"
            variant="contained"
            size="small"
          >
            {t('Send us this suggestion')}
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacySettingsModal;
