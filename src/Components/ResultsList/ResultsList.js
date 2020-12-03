import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ResultsContext } from '../../Contexts/results-context';
import ResultEntry from './ResultEntry';
import ResultError from './ResultError';
import Spinner from '../Spinner/Spinner';
import { makeStyles, Divider, List } from '@material-ui/core';
import useFavorites from '../../Hooks/useFavorites';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  resultsContainer: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: '5px',
  },
}));

const ResultsList = (porps) => {
  const { t } = useTranslation();
  const { results } = useContext(ResultsContext);
  const classes = useStyles();
  // const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const {
    isLoading,
    data,
    error,
    reqIdentifier,
    getFavorites,
    addFavorite,
    removeFavorite,
  } = useFavorites();
  const [fetchQueryID, setFetchQueryID] = useState(null);
  const [modifQueries, setModifQueries] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (results.results) {
      let newQueryID = Math.random().toString(36).substring(2, 15);
      setFetchQueryID(newQueryID);
      getFavorites(
        newQueryID,
        results.results.map((result) => result.id)
      );
    }
  }, [results.results, getFavorites, setFetchQueryID]);

  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === fetchQueryID) {
      if (data.code === 0) {
        setFavorites(
          data.favoritesList.map((favorite) => JSON.parse(favorite).id)
        );
      }
    }
  }, [data, error, isLoading, fetchQueryID, reqIdentifier, setFavorites]);

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

  useEffect(() => {
    if (modifQueries[reqIdentifier]) {
      if (!isLoading && !error && data) {
        if (data.code === 0) {
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
    <List className={classes.resultsContainer}>
      {results.isLoading ? (
        <Spinner />
      ) : results.error ? (
        <ResultError error={results.error.message} />
      ) : results.results.length === 0 ? (
        <div>{t('No results')}</div>
      ) : (
        results.results.map((result) => (
          <React.Fragment>
            <ResultEntry
              {...result}
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
            />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default ResultsList;
