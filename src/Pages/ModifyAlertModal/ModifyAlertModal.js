import React, { useState, useCallback, useContext } from 'react';

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
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import { QueryContext } from '../../Contexts/query-context';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const ModifyAlertModal = (props) => {
  const { t } = useTranslation();
  const { query } = useContext(QueryContext);
  const classes = useStyles();
  const [keepFacets, setKeepFacets] = useState(false);
  const [periodicity, setPeriodicity] = useState('daily');

  const keepFacetsChange = () => {
    setKeepFacets((value) => !value);
  };

  const handlePeriodicityChange = (event) => {
    setPeriodicity(event.target.value);
  };

  const sendFeedback = useCallback(() => {
    props.onClose();
  }, [props]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle onClose={props.onClose}>{t('Create Alert')}</DialogTitle>
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-alert-name"
              label={t('Alert Name')}
              defaultValue={query.elements}
              helperText={t('Type here the name used to store your alert')}
              variant="filled"
              color="secondary"
              fullWidth={true}
              className={classes.fieldsPadding}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={1} />
          <Grid item xs={10}>
            <FormControl component="fieldset">
              <FormLabel variant="filled" color="secondary" component="legend">
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
                  label={t(
                    'Check this box if you want to save the current facets'
                  )}
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-alert-email"
              label={t('Email address')}
              placeholder="youremail@yourcompany"
              helperText={t('Type here the email that will receive the alert')}
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
                value={periodicity}
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
      <DialogActions>
        <Button
          onClick={sendFeedback}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Activate this alert')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyAlertModal;
