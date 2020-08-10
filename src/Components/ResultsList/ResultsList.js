import React, { useContext } from 'react';
import { ResultsContext } from '../../Contexts/results-context';
import ResultEntry from './ResultEntry';
import ResultError from './ResultError';
import Spinner from '../Spinner/Spinner';

const ResultsList = (porps) => {
  const { results, isLoading, error } = useContext(ResultsContext);

  return isLoading ? (
    <Spinner />
  ) : error ? (
    <ResultError error={error.message} />
  ) : results.length === 0 ? (
    <div>No results</div>
  ) : (
    <React.Fragment>
      {results.map((result) => (
        <ResultEntry {...result} />
      ))}
    </React.Fragment>
  );
};

export default ResultsList;
