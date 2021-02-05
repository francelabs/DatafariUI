import React, { useEffect, useState, useCallback, useContext } from 'react';

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
import { QueryContext } from '../../Contexts/query-context';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const FeedbackDocumentNotFoundModal = (props) => {
  const { t } = useTranslation();
  const { query } = useContext(QueryContext);
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
              id="datafari-feedback-query"
              label={t('Using my current query')}
              defaultValue={query.elements}
              helperText={t('This is the query you are currently running')}
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
              id="datafari-feedback-document"
              label={t('I cannot find the following document')}
              placeholder={`${t('file name')}: abc.docx
${t('title')}: abc report
${t('url')}: mynetworkdrive\\path\\to\\the\\file\\abc.docx`}
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

export default FeedbackDocumentNotFoundModal;
