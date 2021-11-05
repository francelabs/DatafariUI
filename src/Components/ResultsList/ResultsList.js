import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ResultsContext } from '../../Contexts/results-context';
import ResultEntry from './ResultEntry';
import ResultError from './ResultError';
import Spinner from '../Spinner/Spinner';
import { makeStyles, Divider, List } from '@material-ui/core';
import useFavorites from '../../Hooks/useFavorites';
import useFolderLinkSources from '../../Hooks/useFolderLinkSources';

const useStyles = makeStyles((theme) => ({
  resultsContainer: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: '5px',
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const ResultsList = (props) => {
  const defaultData = ['filters', 'facets', 'search', 'spellcheck'];
  const { results } = useContext(ResultsContext);
  const classes = useStyles();
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getFavorites,
    addFavorite,
    removeFavorite,
    getFavoritesStatus,
  } = useFavorites();
  const [fetchQueryID, setFetchQueryID] = useState(null);
  const [modifQueries, setModifQueries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoritesEnabled, setFavoritesEnabled] = useState(false);
  const [folderLinkSources] = useFolderLinkSources();
  const displayData =
    props.data && Array.isArray(props.data) ? props.data : defaultData;

  // Retrieve favorite status on mount (getFavortiesStatus should be constant)
  useEffect(() => {
    getFavoritesStatus('FETCH_FAVORITES_STATUS');
  }, [getFavoritesStatus]);

  // Handles reception of the fetch status query
  useEffect(() => {
    if (reqIdentifier === 'FETCH_FAVORITES_STATUS') {
      if (!isLoading && !error && data) {
        if (data.status === 'OK') {
          let enabled = false;
          if (data.content.activated === 'true') {
            enabled = true;
          }
          if (enabled !== favoritesEnabled) {
            setFavoritesEnabled(enabled);
          }
        }
      }
    }
  }, [data, error, favoritesEnabled, isLoading, reqIdentifier]);

  // Upon changes in the results (new search) or favorites status
  // Send a request to get the list of favorite for the user.
  useEffect(() => {
    if (results.results && favoritesEnabled) {
      let newQueryID = Math.random().toString(36).substring(2, 15);
      setFetchQueryID(newQueryID);
      getFavorites(
        newQueryID,
        results.results.map((result) => result.id)
      );
    }
  }, [results.results, getFavorites, setFetchQueryID, favoritesEnabled]);

  // Populate the favorites state variable upon reception of the response
  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === fetchQueryID) {
      if (data.status === 'OK') {
        setFavorites(data.content.favorites.map((favorite) => favorite.id));
      }
    }
  }, [data, error, isLoading, fetchQueryID, reqIdentifier, setFavorites]);

  // Click callback parametrized using the title and ID of the result
  // to save as favorite. Sends the request to add a favorite and
  // populate the modifQueries state to handle response reception.
  const addFavoriteCallback = useCallback(
    (favoriteID, favoriteTitle) => {
      return () => {
        setModifQueries((currentQueries) => {
          const newQueries = { ...currentQueries };
          newQueries[favoriteID] = 'add';
          return newQueries;
        });
        addFavorite(favoriteID, favoriteID, favoriteTitle);
      };
    },
    [setModifQueries, addFavorite]
  );

  // Click callback parametrized using the title and ID of the result
  // to save as favorite. Sends the request to add a favorite and
  // populate the modifQueries state to handle response reception.
  const removeFavoriteCallback = useCallback(
    (favoriteID) => {
      return () => {
        setModifQueries((currentQueries) => {
          const newQueries = { ...currentQueries };
          newQueries[favoriteID] = 'remove';
          return newQueries;
        });
        removeFavorite(favoriteID, favoriteID);
      };
    },
    [setModifQueries, removeFavorite]
  );

  // Handle the reception of modif queries sent by the click callbacks.
  // If there are no errors, change the favorites state according to the
  // type of action (add or remove).
  useEffect(() => {
    if (modifQueries[reqIdentifier]) {
      if (!isLoading && !error && data) {
        if (data.code === 0 || data.status === 'OK') {
          setFavorites((currentFavorites) => {
            if (modifQueries[reqIdentifier] === 'add') {
              return currentFavorites.concat(reqIdentifier);
            } else {
              return currentFavorites.filter(
                (docID) => docID !== reqIdentifier
              );
            }
          });
          setModifQueries((currentQueries) => {
            const newQueries = { ...currentQueries };
            newQueries[reqIdentifier] = undefined;
            delete newQueries[reqIdentifier];
            return newQueries;
          });
        }
      }
    }
  }, [
    data,
    error,
    isLoading,
    reqIdentifier,
    setFavorites,
    modifQueries,
    setModifQueries,
  ]);

  return (
    <>
      {/* Display a spinner while waiting for results, 
      an error message in case of error. */}
      {results.isLoading ? (
        <div className={classes.spinnerContainer}>
          <div>
            <Spinner />
          </div>
        </div>
      ) : results.error ? (
        <ResultError error={results.error.message} />
      ) : results.results.length === 0 ? (
        /* Nothing to display, no results text is displayed by the search info */
        <></>
      ) : (
        /* Display the results list, each result is rendered by a ResultEntry component */
        <List className={classes.resultsContainer}>
          {results.results.map((result, index) => (
            <React.Fragment>
              <ResultEntry
                {...result}
                position={results.start + index}
                bookmarkEnabled={favoritesEnabled}
                bookmarked={favorites.indexOf(result.id) !== -1}
                bookmarkClickCallback={
                  favorites.indexOf(result.id) !== -1
                    ? removeFavoriteCallback(result.id)
                    : addFavoriteCallback(
                        result.id,
                        Array.isArray(result.title)
                          ? result.title[0]
                          : result.title
                      )
                }
                folderLinkSources={folderLinkSources}
                data={displayData}
              />
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </>
  );
};

export default ResultsList;
