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

const FeedbackBugReportModal = (props) => {
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
              id="datafari-feedback-bug-action"
              label={t('While doing this')}
              placeholder={`${t('Browser')}: Firefox 85
${t('Operating System')}: Windows 10
${t('I was clicking advanced search after doing a first search...')}
${t('Or any other details')}`}
              helperText={t(
                'Describe what you were doing when the bug happened'
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
              id="datafari-feedback-bug-result"
              label={t('I encountered the following bug')}
              placeholder={`${t('Date and time')}: 25/12/2020 at 23:59 GMT+1
${t('The advanced search interface did not show up...')}
${t('Or any other details')}`}
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
        <Button
          onClick={sendFeedback}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Send us this feedback')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackBugReportModal;
