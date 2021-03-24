import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  makeStyles,
  Link,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import { QueryContext } from '../../Contexts/query-context';
import useEmailsAdmin from '../../Hooks/useEmailsAdmin';

const fetchQueryID = 'FETCH_EMAILS_DOC_NOT_FOUND';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const FeedbackDocumentNotFoundModal = (props) => {
  const { t } = useTranslation();
  const { query } = useContext(QueryContext);
  const classes = useStyles();
  const MAIL_SUBJECT = 'Datafari document not found';
  const DEFAULT_DOCUMENT_TEXT = `${t('file name')}: abc.docx
${t('title')}: abc report
${t('url')}: mynetworkdrive\\path\\to\\the\\file\\abc.docx`;
  const [documentText, setDocumentText] = useState(DEFAULT_DOCUMENT_TEXT);
  const [queryText, setQueryText] = useState('');
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

  useEffect(() => {
    setQueryText(query.elements);
  }, [query.elements]);

  const sendFeedback = useCallback(() => {
    setDocumentText(DEFAULT_DOCUMENT_TEXT);
    setQueryText(query.elements);
    props.onClose();
  }, [DEFAULT_DOCUMENT_TEXT, props, query.elements]);

  const handleClose = useCallback(() => {
    setDocumentText(DEFAULT_DOCUMENT_TEXT);
    setQueryText(query.elements);
    props.onClose();
  }, [DEFAULT_DOCUMENT_TEXT, props, query.elements]);

  const queryTextChange = useCallback((event) => {
    setQueryText(event.target.value);
  }, []);

  const documentTextChange = useCallback((event) => {
    setDocumentText(event.target.value);
  }, []);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>
        {t('Give us your feedback')}
      </DialogTitle>
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-feedback-query"
              label={t('Using my current query')}
              value={queryText}
              onChange={queryTextChange}
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
              value={documentText}
              onChange={documentTextChange}
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
            queryText
          )}%0A%0A${encodeURIComponent(documentText)}`}
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

export default FeedbackDocumentNotFoundModal;
