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
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useEmailsAdmin from '../../Hooks/useEmailsAdmin';

const fetchQueryID = 'FETCH_EMAILs_COMMENTS';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const FeedbackCommentModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const MAIL_SUBJECT = 'Datafari comment';
  const DEFAULT_COMMENT_TEXT = useMemo(
    () => t('I think it would be much easier to ...'),
    [t]
  );
  const DEFAULT_CONTACT_TEXT = useMemo(
    () => `${t('Email')}: my.email@work
  ${t('Phone')}: 123456789
  ${t('or any means')}`,
    [t]
  );
  const [commentText, setCommentText] = useState(DEFAULT_COMMENT_TEXT);
  const [contactText, setContactText] = useState(DEFAULT_CONTACT_TEXT);
  const [emailAddress, setEmailAddress] = useState('');
  const { isLoading, data, error, reqIdentifier, getEmailsAdmin } =
    useEmailsAdmin();

  useEffect(() => {
    if (props.open) {
      getEmailsAdmin(fetchQueryID);
      setCommentText(DEFAULT_COMMENT_TEXT);
      setContactText(DEFAULT_CONTACT_TEXT);
    }
  }, [DEFAULT_COMMENT_TEXT, DEFAULT_CONTACT_TEXT, getEmailsAdmin, props.open]);

  useEffect(() => {
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data) {
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
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [data, error, isLoading, reqIdentifier]);

  const commentTextChange = useCallback((event) => {
    setCommentText(event.target.value);
  }, []);

  const contactTextChange = useCallback((event) => {
    setContactText(event.target.value);
  }, []);

  const sendFeedback = useCallback(() => {
    props.onClose();
  }, [props]);

  const handleClose = useCallback(() => {
    props.onClose();
  }, [props]);

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
              id="datafari-feedback-comment"
              label={t('Your comment')}
              value={commentText}
              onChange={commentTextChange}
              helperText={t('Put your comment')}
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
              id="datafari-feedback-contact-back-comment"
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
            commentText
          )}%0A%0A${encodeURIComponent(contactText)}`}
        >
          <Button
            onClick={sendFeedback}
            color="secondary"
            variant="contained"
            size="small"
          >
            {t('Send us this comment')}
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackCommentModal;
