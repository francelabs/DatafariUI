import React, { useCallback, useState } from 'react';

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

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const FeedbackCommentModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const MAIL_SUBJECT = 'Datafari comment';
  const DEFAULT_COMMENT_TEXT = t('I think it would be much easier to ...');
  const DEFAULT_CONTACT_TEXT = `${t('Email')}: my.email@work
  ${t('Phone')}: 123456789
  ${t('or any means')}`;
  const [commentText, setCommentText] = useState(DEFAULT_COMMENT_TEXT);
  const [contactText, setContactText] = useState(DEFAULT_CONTACT_TEXT);

  const commentTextChange = useCallback((event) => {
    setCommentText(event.target.value);
  }, []);

  const contactTextChange = useCallback((event) => {
    setContactText(event.target.value);
  }, []);

  const sendFeedback = useCallback(() => {
    setCommentText(DEFAULT_COMMENT_TEXT);
    setContactText(DEFAULT_CONTACT_TEXT);
    props.onClose();
  }, [DEFAULT_COMMENT_TEXT, DEFAULT_CONTACT_TEXT, props]);

  const handleClose = useCallback(() => {
    setCommentText(DEFAULT_COMMENT_TEXT);
    setContactText(DEFAULT_CONTACT_TEXT);
    props.onClose();
  }, [DEFAULT_COMMENT_TEXT, DEFAULT_CONTACT_TEXT, props]);

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
          href={`mailto:?subject=${MAIL_SUBJECT}&body=${encodeURIComponent(
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
