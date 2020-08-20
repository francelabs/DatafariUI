import React, { useContext } from 'react';
import { ResultsContext } from '../../Contexts/results-context';
import ResultEntry from './ResultEntry';
import ResultError from './ResultError';
import Spinner from '../Spinner/Spinner';
import { makeStyles, Divider, List } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  resultsContainer: {
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: '5px',
  },
}));

const ResultsList = (porps) => {
  const { results } = useContext(ResultsContext);
  const classes = useStyles();
  return (
    <List className={classes.resultsContainer}>
      {results.isLoading ? (
        <Spinner />
      ) : results.error ? (
        <ResultError error={results.error.message} />
      ) : results.length === 0 ? (
        <div>No results</div>
      ) : (
        results.results.map((result) => (
          <React.Fragment>
            <ResultEntry {...result} />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default ResultsList;
