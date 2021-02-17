import React, { useState, useCallback, useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  makeStyles,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  Divider,
  Typography,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import { QueryContext } from '../../Contexts/query-context';
import useAlerts from '../../Hooks/useAlerts';
import Spinner from '../../Components/Spinner/Spinner';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const CREATE_ALERT_QUERY_ID = 'createAlert';

const ModifyAlertModal = (props) => {
  const { t } = useTranslation();
  const { query, prepareFiltersForAlerts } = useContext(QueryContext);
  const {
    addAlert,
    modifyAlert,
    getEmptyAlertObject,
    isLoading,
    data,
    error,
    clear,
  } = useAlerts();
  const classes = useStyles();
  const [keepFacets, setKeepFacets] = useState(false);
  const [alert, setAlert] = useState(
    props.alert ? { ...props.alert } : { ...getEmptyAlertObject() }
  );

  useEffect(() => {
    if (!props.open) {
      const subject =
        query.elements.split(' ').length > 0
          ? query.elements.split(' ')[0]
          : query.elements;
      setAlert((currentAlert) => {
        return {
          ...currentAlert,
          subject: subject,
          keyword: query.elements,
          frequency: 'daily',
          core: 'FileShare',
        };
      });
    }
  }, [props.open, query.elements]);

  useEffect(() => {
    if (props.alert) {
      setAlert(props.alert);
    }
  }, [props.alert]);

  const keepFacetsChange = () => {
    setKeepFacets((value) => !value);
  };

  const handlePeriodicityChange = (event) => {
    const value = event.target.value;
    setAlert((currentAlert) => {
      return { ...currentAlert, frequency: value };
    });
  };

  const handleSubjectChange = (event) => {
    const value = event.target.value;
    setAlert((currentAlert) => {
      return { ...currentAlert, subject: value };
    });
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setAlert((currentAlert) => {
      return { ...currentAlert, mail: value };
    });
  };

  const handleClose = useCallback(() => {
    if (!isLoading && props.open) {
      props.onClose();
      setAlert({ ...getEmptyAlertObject() });
      clear();
      setKeepFacets(false);
    }
  }, [clear, getEmptyAlertObject, isLoading, props]);

  const validateForm = useCallback(() => {
    return true;
  }, []);

  const buildFiltersFromFacets = useCallback(() => {
    return prepareFiltersForAlerts();
  }, [prepareFiltersForAlerts]);

  const saveAlert = useCallback(() => {
    if (validateForm()) {
      if (props.alert) {
        modifyAlert(alert._id, alert);
      } else {
        const alertToSave = { ...alert };
        if (alertToSave.keyword === '') {
          alertToSave.keyword = '*:*';
        }
        if (keepFacets) {
          alertToSave.filters = buildFiltersFromFacets();
        }
        addAlert(CREATE_ALERT_QUERY_ID, alertToSave);
      }
    }
  }, [
    addAlert,
    alert,
    buildFiltersFromFacets,
    keepFacets,
    validateForm,
    props.alert,
    modifyAlert,
  ]);

  useEffect(() => {
    // Handling response from the server, close if OK, show error else
    if (!isLoading && !error && data) {
      if (data.status === 'OK') {
        handleClose();
      } else {
        // Servlet returns error code handling (not connected or other...)
      }
    } else if (!isLoading && error) {
      // Network / parsing error handling
    }
  }, [data, isLoading, error, handleClose, clear]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('Create Alert')}</DialogTitle>
      <Divider />
      {isLoading && (
        <DialogContent className={classes.spinnerContainer}>
          <div>
            <Spinner />
          </div>
        </DialogContent>
      )}
      {!isLoading && error && (
        <DialogContent>
          <Typography>
            {t(
              'An error occured while retrieving the data, if this error persists contact an administrator'
            )}
          </Typography>
        </DialogContent>
      )}
      {!isLoading && !error && (
        <DialogContent>
          <Grid container justify="space-between">
            <Grid item xs={1} />
            <Grid item xs={10}>
              <TextField
                id="datafari-alert-name"
                label={t('Alert Name')}
                value={alert.subject}
                onChange={handleSubjectChange}
                helperText={t('Type here the name used to store your alert')}
                variant="filled"
                color="secondary"
                fullWidth={true}
                className={classes.fieldsPadding}
              />
            </Grid>
            <Grid item xs={1} />
            {!props.alert && (
              <>
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <FormControl component="fieldset">
                    <FormLabel
                      variant="filled"
                      color="secondary"
                      component="legend"
                    >
                      {t('Keep facets')}
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={keepFacets}
                            onChange={keepFacetsChange}
                            name="keep-facets"
                          />
                        }
                        label={t('Save current facets')}
                      />
                    </FormGroup>
                    <FormHelperText>
                      {t(
                        'Check this box if you want to save the current facets'
                      )}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={1} />
              </>
            )}
            <Grid item xs={1} />
            <Grid item xs={10}>
              <TextField
                id="datafari-alert-email"
                label={t('Email address')}
                placeholder="youremail@yourcompany"
                helperText={t(
                  'Type here the email that will receive the alert'
                )}
                value={alert.mail}
                onChange={handleEmailChange}
                variant="filled"
                color="secondary"
                fullWidth={true}
                className={classes.fieldsPadding}
              />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <FormControl>
                <InputLabel
                  id="datafari-alert-periodicity-label"
                  color="secondary"
                >
                  {t('Update Frequency')}
                </InputLabel>
                <Select
                  id="datafari-alert-periodicity"
                  color="secondary"
                  fullWidth={true}
                  value={alert.frequency}
                  onChange={handlePeriodicityChange}
                >
                  <MenuItem value="hourly">{t('Hourly')}</MenuItem>
                  <MenuItem value="daily">{t('Daily')}</MenuItem>
                  <MenuItem value="weekly">{t('Weekly')}</MenuItem>
                </Select>
                <FormHelperText>
                  {t(
                    'Pick how frequently you wish to receive email notifications'
                  )}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        </DialogContent>
      )}
      {!isLoading && !error && (
        <DialogActions>
          <Button
            onClick={saveAlert}
            color="secondary"
            variant="contained"
            size="small"
          >
            {t('Activate this alert')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModifyAlertModal;
