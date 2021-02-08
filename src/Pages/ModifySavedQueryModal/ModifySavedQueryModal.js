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
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import { QueryContext } from '../../Contexts/query-context';

const useStyles = makeStyles((theme) => ({
  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const ModifySavedQueryModal = (props) => {
  const { t } = useTranslation();
  const { query } = useContext(QueryContext);
  const classes = useStyles();
  const [keepFacets, setKeepFacets] = useState(false);

  const keepFacetsChange = () => {
    setKeepFacets((value) => !value);
  };

  const sendFeedback = useCallback(() => {
    props.onClose();
  }, [props]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle onClose={props.onClose}>{t('Save Query')}</DialogTitle>
      <DialogContent>
        <Grid container justify="space-between">
          <Grid item xs={1} />
          <Grid item xs={10}>
            <TextField
              id="datafari-query-name"
              label={t('Query Name')}
              defaultValue={query.elements}
              helperText={t('Type here the name used to store your query')}
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

export default ModifySavedQueryModal;
