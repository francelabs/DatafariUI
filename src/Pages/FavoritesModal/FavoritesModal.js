import React, { useEffect, useState, useCallback, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Dialog,
  DialogActions,
  DialogContent,
  Checkbox,
  Button,
} from '@material-ui/core';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useFavorites from '../../Hooks/useFavorites';
import { ResultsContext, SET_RESULTS } from '../../Contexts/results-context';

const fetchQueryID = 'FETCH_FAVORITES';

const FavortiesModal = (props) => {
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getFavorites,
    removeFavorite,
  } = useFavorites();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const { results, dispatch: resultsDispatch } = useContext(ResultsContext);

  const handleClose = () => {
    // Dirty hack to force favorite state update on ResultsList
    resultsDispatch({
      type: SET_RESULTS,
      results: { results: [...results.results] },
    });
    props.onClose();
  };

  const columns = [
    { id: 'title', label: t('Favorite Document Title'), minWidth: 350 },
    { id: 'id', label: t('Favorite Document Path'), minWidth: 350 },
  ];

  useEffect(() => {
    if (props.open) {
      getFavorites(fetchQueryID);
    }
  }, [getFavorites, props.open]);

  useEffect(() => {
    // Effect for fetching favorites query
    if (reqIdentifier === fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.code === 0) {
          setFavorites(
            data.favoritesList.map((element) => JSON.parse(element))
          );
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [reqIdentifier, data, isLoading, error, setFavorites]);

  const handleCheckboxClick = useCallback(
    (favoriteID) => {
      return () => {
        if (allSelected) {
          let newSelected = favorites.map((favorite) => favorite.id);
          if (newSelected.indexOf(favoriteID) !== -1) {
            newSelected.splice(newSelected.indexOf(favoriteID), 1);
          }
          setAllSelected(false);
          setSelected(newSelected);
        } else {
          setSelected((currentSelection) => {
            if (currentSelection.indexOf(favoriteID) !== -1) {
              return currentSelection.filter(
                (favorite) => favorite !== favoriteID
              );
            } else {
              return currentSelection.concat(favoriteID);
            }
          });
        }
      };
    },
    [setSelected, setAllSelected, allSelected, favorites]
  );

  const handleSelectAllClick = useCallback(() => {
    if (allSelected) {
      setAllSelected(false);
    } else {
      if (selected.length !== 0) {
        setSelected([]);
      } else {
        setAllSelected(true);
      }
    }
  }, [allSelected, selected, setAllSelected, setSelected]);

  const handleRemoveSelectedClick = useCallback(() => {
    let toBeRemoved = selected.slice(0, selected.length);
    if (allSelected) {
      toBeRemoved = favorites.map((favorite) => favorite.id);
    }
    toBeRemoved.forEach((favoriteID) => {
      removeFavorite(favoriteID, favoriteID);
    });
  }, [selected, favorites, allSelected, removeFavorite]);

  useEffect(() => {
    // Effect for removing favorites query
    if (reqIdentifier !== fetchQueryID) {
      if (!isLoading && !error && data) {
        if (data.code === 0) {
          setFavorites((currentFavorites) => {
            const favoritesIDs = currentFavorites.map(
              (favorite) => favorite.id
            );
            if (favoritesIDs.indexOf(reqIdentifier) !== -1) {
              const newFavorites = currentFavorites.slice(
                0,
                currentFavorites.length
              );
              newFavorites.splice(favoritesIDs.indexOf(reqIdentifier), 1);
              return newFavorites;
            } else {
              return currentFavorites;
            }
          });
          setSelected((currentSelected) => {
            const newSelected = currentSelected.slice(
              0,
              currentSelected.length
            );
            if (currentSelected.indexOf(reqIdentifier) !== -1) {
              newSelected.splice(currentSelected.indexOf(reqIdentifier), 1);
            }
            return newSelected;
          });
          setAllSelected(false);
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [
    reqIdentifier,
    data,
    isLoading,
    error,
    setFavorites,
    setAllSelected,
    setSelected,
  ]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle onClose={handleClose}>{t('My Favorites')}</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell key="checkbox" padding="checkbox">
                  <Checkbox
                    onChange={handleSelectAllClick}
                    checked={allSelected || selected.length > 0}
                    indeterminate={
                      selected.length > 0 &&
                      selected.length !== favorites.length
                    }
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {favorites.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={handleCheckboxClick(row.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allSelected || selected.indexOf(row.id) !== -1}
                      />
                    </TableCell>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleRemoveSelectedClick}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Delete Selected')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FavortiesModal;
