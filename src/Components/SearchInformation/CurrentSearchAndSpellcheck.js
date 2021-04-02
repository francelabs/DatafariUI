import { makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryContext, SET_ELEMENTS } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';

const useStyles = makeStyles((theme) => ({
  spellcheck: {
    cursor: 'pointer',
  },
}));

const CurrentSearchAndSpellcheck = (props) => {
  const { t } = useTranslation();
  const { results } = useContext(ResultsContext);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const classes = useStyles();

  const spellcheckClick = useCallback(() => {
    if (results.spellcheck.collation !== query.elements) {
      let original = undefined;
      if (results.numFound === 0) {
        original = query.elements;
      }
      queryDispatch({
        type: SET_ELEMENTS,
        elements: results.spellcheck.collation,
        spellcheckOriginalQuery: original,
      });
    }
  }, [results.numFound, results.spellcheck, queryDispatch, query.elements]);

  useEffect(() => {
    if (!results.isLoading && results.numFound === 0 && results.spellcheck) {
      spellcheckClick();
    }
  }, [
    results.isLoading,
    results.numFound,
    results.spellcheck,
    spellcheckClick,
  ]);

  return (
    <>
      <Typography>
        {t('Showing results for')}{' '}
        <Typography component="span" color="secondary">
          {query.elements ? query.elements : t('anything')}
        </Typography>
        {results.spellcheck && (
          <>
            {' '}
            - {t('You may have more results with ')}{' '}
            <Typography
              component="span"
              color="secondary"
              onClick={spellcheckClick}
              className={classes.spellcheck}
            >
              {results.spellcheck.collation}
            </Typography>
          </>
        )}
        {query.spellcheckOriginalQuery && (
          <>
            {' '}
            - {t('No results were found for ')}
            <Typography component="span" color="secondary">
              {query.spellcheckOriginalQuery}
            </Typography>
          </>
        )}
      </Typography>
    </>
  );
};

export default CurrentSearchAndSpellcheck;
