import React, { useCallback, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  makeStyles,
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

  const sendFeedback = useCallback(() => {
    props.onClose();
  }, [props]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle onClose={props.onClose}>
        {t('Give us your feedback')}
      </DialogTitle>
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-feedback-comment"
              label={t('Your comment')}
              placeholder={t('I think it would be much easier to ...')}
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
              placeholder={`${t('Email')}: my.email@work
${t('Phone')}: 123456789
${t('or any means')}`}
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
        <Button
          onClick={sendFeedback}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Send us this comment')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackCommentModal;
