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
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  Divider,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import { UIConfigContext, checkUIConfigHelper } from '../../Contexts/ui-config-context';
import { QueryContext } from '../../Contexts/query-context';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const ExportResultsModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { uiDefinition } = useContext(UIConfigContext);
  checkUIConfig(uiDefinition);

  const { exportResults } = uiDefinition;

  const formats = Object.keys(exportResults);
  const [format, setFormat] = useState(formats[0]);
  const [nbResult, setNbResult] = useState(exportResults[formats[0]].defaultResults);

  const { exportQueryResult } = useContext(QueryContext);

  const handleNbResult = (event) => {
    let nb = 1;
    try {
      nb = Number.parseInt(event.target.value);
    } catch (error) {
      console.error('error try parsing nb of result', event.target.value);
    }

    if (isNaN(nb)) {
      nb = 1;
    }

    setNbResult(
      nb < exportResults.minResults
        ? exportResults.minResults
        : nb > exportResults.maxResults
        ? exportResults.maxResults
        : nb
    );
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
    setNbResult(exportResults[event.target.value].defaultResults);
  };

  const generateExport = () => {
    exportQueryResult(format, nbResult, exportResults[format].extension);
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle onClose={props.onClose}>{t('Export Results')}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-export-number"
              label={t('Number of exported results')}
              value={nbResult}
              helperText={t('Exported results starting from the first result', {
                min: exportResults[format].minResults,
                max: exportResults[format].maxResults,
                default: exportResults[format].defaultResults,
              })}
              type="number"
              variant="filled"
              color="secondary"
              className={classes.fieldsPadding}
              onChange={handleNbResult}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={1} />
          <Grid item xs={10}>
            <FormControl>
              <InputLabel id="datafari-export-format-label" color="secondary">
                {t('Export as')}
              </InputLabel>
              <Select
                id="datafari-export-format"
                color="secondary"
                fullWidth={true}
                value={format}
                onChange={handleFormatChange}>
                {formats.map((format) => (
                  <MenuItem value={format}>{format}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('Select a format that suits your needs')}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={generateExport} color="secondary" variant="contained" size="small">
          {t('Generate Export File')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportResultsModal;

function checkUIConfig(uiConfig) {
  const helper = checkUIConfigHelper(uiConfig);
  helper(
    () => typeof uiConfig.exportResults === 'object' && Object.keys(uiConfig).length > 0,
    `exportResults`,
    'exportResults is missing and need at least one key in exportResutls i.e. exportResults: { "excel"... }'
  );

  if (typeof uiConfig.exportResults === 'object' && uiConfig.exportResults) {
    Object.keys(uiConfig.exportResults).forEach((format) => {
      helper(() => typeof format.extension === 'string', `${format}.extension`, 'Type string.');
      helper(() => typeof format.minResults === 'number', `${format}.minResults`, 'Type number.');
      helper(() => typeof format.maxResults === 'number', `${format}.minResults`, 'Type number.');
      helper(
        () => typeof format.defaultResults === 'number',
        `${format}.minResults`,
        'Type number.'
      );
    });
  }
}
