import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Radio,
  ListItemIcon,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useFavorites from '../../Hooks/useFavorites';

const fetchQueryID = 'FETCH_FAVORITES';

const ManageSavedQueriesModal = (props) => {
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getFavorites,
  } = useFavorites();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleClose = () => {
    props.onClose();
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

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
        } else {
          // Servlet returns error code handling (not connected or other...)
        }
      } else if (!isLoading && error) {
        // Network / parsing error handling
      }
    }
  }, [reqIdentifier, data, isLoading, error, setFavorites]);

  return (
    <Dialog open={props.open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{t('My Saved Queries')}</DialogTitle>
      <DialogContent>
        <List dense={true}>
          {favorites.map((row) => {
            return (
              <ListItem key={row.id}>
                <ListItemIcon>
                  <Radio
                    checked={selectedValue === row.title}
                    onChange={handleChange}
                    value={row.title}
                    name="radio-button-saved-queries"
                    inputProps={{ 'aria-label': row.title }}
                  />
                </ListItemIcon>
                <ListItemText primary={row.title} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Run This Query')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageSavedQueriesModal;
