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
    queryDispatch({
      type: SET_ELEMENTS,
      elements: results.spellcheck.collation,
    });
  }, [results.spellcheck, queryDispatch]);

  useEffect(() => {
    if (results.numFound === 0 && results.spellcheck) {
      spellcheckClick();
    }
  }, [results.numFound, results.spellcheck, spellcheckClick]);

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
      </Typography>
    </>
  );
};

export default CurrentSearchAndSpellcheck;
