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

const FeedbackSuggestionModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const MAIL_SUBJECT = 'Datafari Suggestion';
  const DEFAULT_SUGGESTION_TEXT = t('I think it would be much easier to ...');
  const DEFAULT_CONTACT_TEXT = `${t('Email')}: my.email@work
${t('Phone')}: 123456789
${t('or any means')}`;

  const [suggestionText, setSuggestionText] = useState(DEFAULT_SUGGESTION_TEXT);
  const [contactText, setContactText] = useState(DEFAULT_CONTACT_TEXT);

  const handleClose = useCallback(() => {
    setSuggestionText(DEFAULT_SUGGESTION_TEXT);
    setContactText(DEFAULT_CONTACT_TEXT);
    props.onClose();
  }, [DEFAULT_CONTACT_TEXT, DEFAULT_SUGGESTION_TEXT, props]);

  const suggestionTextChange = useCallback((event) => {
    setSuggestionText(event.target.value);
  }, []);

  const contactTextChange = useCallback((event) => {
    setContactText(event.target.value);
  }, []);

  const sendFeedback = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle onClose={props.onClose}>
        {t('Give us your feedback')}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-feedback-suggestion"
              label={t('Your suggestion')}
              value={suggestionText}
              onChange={suggestionTextChange}
              helperText={t('Describe your suggestion')}
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
              id="datafari-feedback-contact-back"
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
            suggestionText
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

export default FeedbackSuggestionModal;
