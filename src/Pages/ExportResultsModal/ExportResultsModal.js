import React, { useState, useCallback } from 'react';

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
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const ExportResultsModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [format, setFormat] = useState('CSV');

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const generateExport = useCallback(() => {
    props.onClose();
  }, [props]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle onClose={props.onClose}>{t('Export Results')}</DialogTitle>
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-export-number"
              label={t('Number of exported results')}
              defaultValue={10}
              helperText={t('Exported results starting from the first result')}
              type="number"
              variant="filled"
              color="secondary"
              className={classes.fieldsPadding}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={1} />
          <Grid item xs={10}>
            <FormControl>
              <InputLabel id="datafari-export-format-label" color="secondary">
                {t('Update Frequency')}
              </InputLabel>
              <Select
                id="datafari-export-format"
                color="secondary"
                fullWidth={true}
                value={format}
                onChange={handleFormatChange}
              >
                <MenuItem value="CSV">CSV</MenuItem>
                <MenuItem value="TXT">{t('Text')}</MenuItem>
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
          onClick={generateExport}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Generate Export File')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportResultsModal;
