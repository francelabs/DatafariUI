import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  Radio,
  Divider,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
// eslint-disable-next-line no-unused-vars
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useSavedSearches from '../../Hooks/useSavedSearches';
import Spinner from '../../Components/Spinner/Spinner';
import { QueryContext } from '../../Contexts/query-context';

const fetchQueryID = 'FETCH_SAVED_SEARCHES';

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const ManageSavedQueriesModal = (props) => {
  const classes = useStyles();
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getSavedSearches,
    removeSavedSearch,
  } = useSavedSearches();
  const { runQueryFromSavedSearch } = useContext(QueryContext);
  const { t } = useTranslation();
  const [savedSearches, setSavedSearches] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleClose = useCallback(() => {
    setSelectedValue(null);
    props.onClose();
  }, [props]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    if (props.open) {
      getSavedSearches(fetchQueryID);
    }
  }, [getSavedSearches, props.open]);

  useEffect(() => {
    // Effect for fetching savedsearches query
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.status === 'OK') {
          setSavedSearches(data.content.savedsearches);
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [reqIdentifier, data, isLoading, error, setSavedSearches]);

  useEffect(() => {
    // Effect for removing savedsearch query
    if (reqIdentifier !== fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.status === 'OK') {
          setSavedSearches((currentSavedSearches) => {
            const savedSearchNames = currentSavedSearches.map(
              (savedSearch) => savedSearch.name
            );
            if (savedSearchNames.indexOf(reqIdentifier) !== -1) {
              const newSavedSearches = currentSavedSearches.slice(
                0,
                currentSavedSearches.length
              );
              newSavedSearches.splice(
                savedSearchNames.indexOf(reqIdentifier),
                1
              );
              return newSavedSearches;
            } else {
              return currentSavedSearches;
            }
          });
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [reqIdentifier, data, isLoading, error, setSavedSearches]);

  const executeSelectedSearch = useCallback(() => {
    const selectedQuery = savedSearches.filter(
      (query) => query.name === selectedValue
    );
    if (selectedQuery && selectedQuery.length > 0) {
      runQueryFromSavedSearch(selectedQuery[0].search);
      handleClose();
    }
  }, [handleClose, runQueryFromSavedSearch, savedSearches, selectedValue]);

  const handleDeleteSavedSearch = useCallback(
    (savedSearch) => {
      removeSavedSearch(savedSearch.name, savedSearch);
    },
    [removeSavedSearch]
  );

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('My Saved Queries')}</DialogTitle>
      <Divider />
      {isLoading && (
        <DialogContent className={classes.spinnerContainer}>
          <div>
            <Spinner />
          </div>
        </DialogContent>
      )}
      {!isLoading && (
        <DialogContent>
          <TableContainer>
            <Table size="small" stickyHeader aria-label="saved searches table">
              <TableHead>
                <TableRow>
                  <TableCell key="radio" padding="checkbox"></TableCell>
                  <TableCell>{t('Name')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {error && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      {t(
                        'An error occured while retrieving the data, if this error persists contact an administrator'
                      )}
                    </TableCell>
                  </TableRow>
                )}
                {!error &&
                  savedSearches.map((row) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.id}
                        onClick={() => setSelectedValue(row.name)}
                      >
                        <TableCell padding="checkbox">
                          <Radio
                            checked={selectedValue === row.name}
                            onChange={handleChange}
                            value={row.name}
                            name="radio-button-saved-queries"
                            inputProps={{ 'aria-label': row.name }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          {/* <IconButton edge="end" aria-label="edit" size='small'>
                          <EditIcon />
                        </IconButton> */}
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              handleDeleteSavedSearch(row);
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      )}
      {!isLoading && (
        <DialogActions>
          <Button
            onClick={executeSelectedSearch}
            color="secondary"
            variant="contained"
            size="small"
          >
            {t('Run This Query')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ManageSavedQueriesModal;
