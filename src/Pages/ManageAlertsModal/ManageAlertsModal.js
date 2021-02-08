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
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import useFavorites from '../../Hooks/useFavorites';

const fetchQueryID = 'FETCH_FAVORITES';

const ManageAlertsModal = (props) => {
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getFavorites,
  } = useFavorites();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);

  const handleClose = () => {
    props.onClose();
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
      <DialogTitle onClose={handleClose}>{t('My Alerts')}</DialogTitle>
      <DialogContent>
        <List dense={true}>
          {favorites.map((row) => {
            return (
              <ListItem key={row.id}>
                <ListItemText primary={row.title} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <NotificationsIcon />
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
          {t('Exit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageAlertsModal;
