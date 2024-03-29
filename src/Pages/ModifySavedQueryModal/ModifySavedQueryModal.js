import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { QueryContext } from '../../Contexts/query-context';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import Spinner from '../../Components/Spinner/Spinner';
import useSavedSearches from '../../Hooks/useSavedSearches';

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

const ModifySavedQueryModal = (props) => {
  const { t } = useTranslation();
  const { query, buildSavedSearchQuery } = useContext(QueryContext);
  const classes = useStyles();
  const [keepFacets, setKeepFacets] = useState(false);
  const [userSavedSearch, setUserSavedSearch] = useState([]);
  const [formError, setFormError] = useState(false);

  const {
    addSavedSearch,
    getEmptySavedSearchObject,
    getSavedSearches,
    // eslint-disable-next-line no-unused-vars
    isLoading,
    // eslint-disable-next-line no-unused-vars
    data,
    // eslint-disable-next-line no-unused-vars
    error,
    // eslint-disable-next-line no-unused-vars
    reqIdentifier,
    clear,
  } = useSavedSearches();

  const [savedSearch, setSavedSearch] = useState(
    props.savedSearch ? { ...props.savedSearch } : { ...getEmptySavedSearchObject() }
  );

  const keepFacetsChange = () => {
    setKeepFacets((value) => !value);
  };

  useEffect(() => {
    const newSearchElements = { search: `q=${query.elements}` };

    newSearchElements.name = query.elements.split(' ').length > 0 ? query.elements.split(' ')[0] : '';

    setSavedSearch((currentSavedSearch) => {
      return {
        ...currentSavedSearch,
        ...newSearchElements,
      };
    });
    getSavedSearches('FETCH_SAVED_SEARCH');
  }, [props.open, query.elements, getSavedSearches]);

  useEffect(() => {
    setFormError((userSavedSearch || []).some((search) => search.name === savedSearch.name));
  }, [savedSearch, userSavedSearch]);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setSavedSearch((currentSavedSearch) => {
      return { ...currentSavedSearch, name: newName };
    });
  };

  const validateForm = useCallback(() => {
    return true;
  }, []);

  const handleClose = useCallback(() => {
    setSavedSearch({ ...getEmptySavedSearchObject() });
    setKeepFacets(false);
    clear();
    props.onClose();
  }, [clear, getEmptySavedSearchObject, props]);

  const saveQuery = useCallback(() => {
    if (validateForm()) {
      const searchToSave = { ...savedSearch };
      if (searchToSave.keyword === '') {
        searchToSave.keyword = '*:*';
      }
      if (keepFacets) {
        searchToSave.search = buildSavedSearchQuery();
      }
      addSavedSearch('createSavedSearch', searchToSave);
    }
  }, [addSavedSearch, buildSavedSearchQuery, keepFacets, savedSearch, validateForm]);

  useEffect(() => {
    // Handling response from the server, close if OK, show error else
    if (!isLoading && !error && data) {
      if (data.status === 'OK') {
        // Case fetch saved queries
        if (reqIdentifier === 'FETCH_SAVED_SEARCH') {
          setUserSavedSearch(data?.content?.savedsearches || []);
        } else {
          handleClose();
        }
      } else {
        // Servlet returns error code handling (not connected or other...)
      }
    } else if (!isLoading && error) {
      // Network / parsing error handling
    }
  }, [data, isLoading, error, reqIdentifier, handleClose, clear]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('Save Query')}</DialogTitle>
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
            {t('An error occured while retrieving the data, if this error persists contact an administrator')}
          </Typography>
        </DialogContent>
      )}
      {!isLoading && !error && (
        <DialogContent>
          <Grid container justify="space-between">
            <Grid item xs={1} />
            <Grid item xs={10}>
              <TextField
                id="datafari-query-name"
                label={t('Query Name')}
                value={savedSearch.name}
                onChange={handleNameChange}
                helperText={
                  formError
                    ? t('This name already exists. Please choose another name')
                    : t('Type here the name used to store your query')
                }
                variant="filled"
                color="secondary"
                fullWidth={true}
                className={classes.fieldsPadding}
                error={formError}
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
                    control={<Checkbox checked={keepFacets} onChange={keepFacetsChange} name="keep-facets" />}
                    label={t('Save current facets')}
                  />
                </FormGroup>
                <FormHelperText>{t('Check this box if you want to save the current facets')}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        </DialogContent>
      )}
      {!isLoading && !error && (
        <DialogActions>
          <Button onClick={saveQuery} color="secondary" variant="contained" size="small" disabled={formError}>
            {t('Save This Query')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModifySavedQueryModal;
