import React, { useContext } from 'react';
import './Pager.css';
import { QueryContext, SET_PAGE } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  IconButton,
  Button,
  makeStyles,
  Divider,
  Grid,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  pagerContainer: {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    width: 'fit-content',
  },

  currentPage: {
    fontWeight: 'bold',
  },
}));

const Pager = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { results } = useContext(ResultsContext);

  const lastPageRows = results.numFound % query.rows;
  const maxPage =
    (results.numFound - lastPageRows) / query.rows + (lastPageRows > 0 ? 1 : 0);

  const onClickHandler = (i) => {
    return () => {
      queryDispatch({ type: SET_PAGE, page: i });
    };
  };

  let pages = [];

  if (query.page > 1) {
    pages.push(
      <IconButton
        onClick={onClickHandler(query.page - 1)}
        aria-label={t('Previous page')}
      >
        <ChevronLeftIcon />
      </IconButton>
    );
  }
  if (maxPage <= 5) {
    for (let i = 1; i <= maxPage; i++) {
      pages.push(
        <Button
          className={query.page === i && classes.currentPage}
          onClick={onClickHandler(i)}
        >
          {i}
        </Button>
      );
    }
  } else {
    if (query.page <= 3) {
      for (let i = 1; (query.page === 3 && i <= 4) || i <= 3; i++) {
        pages.push(
          <Button
            className={query.page === i ? classes.currentPage : ''}
            onClick={onClickHandler(i)}
          >
            {i}
          </Button>
        );
      }
      pages.push(<Button disabled>...</Button>);
      pages.push(<Button onClick={onClickHandler(maxPage)}>{maxPage}</Button>);
    } else if (query.page >= maxPage - 2) {
      pages.push(<Button onClick={onClickHandler(1)}>1</Button>);
      pages.push(<Button disabled>...</Button>);
      if (query.page === maxPage - 2) {
        pages.push(
          <Button onClick={onClickHandler(maxPage - 3)}>{maxPage - 3}</Button>
        );
      }
      for (let i = maxPage - 2; i <= maxPage; i++) {
        pages.push(
          <Button
            className={query.page === i && classes.currentPage}
            onClick={onClickHandler(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      pages.push(<Button onClick={onClickHandler(1)}>1</Button>);
      pages.push(<Button disabled>...</Button>);
      let pageNum = parseInt(query.page, 10);
      for (let i = pageNum - 1; i <= pageNum + 1; i++) {
        pages.push(
          <Button
            className={pageNum === i && classes.currentPage}
            onClick={onClickHandler(i)}
          >
            {i}
          </Button>
        );
      }
      pages.push(<Button disabled>...</Button>);
      pages.push(<Button onClick={onClickHandler(maxPage)}>{maxPage}</Button>);
    }
  }
  if (query.page < maxPage) {
    pages.push(
      <IconButton
        onClick={onClickHandler(query.page + 1)}
        aria-label={t('Next page')}
      >
        <ChevronRightIcon />
      </IconButton>
    );
  }

  return (
    !results.isLoading &&
    !results.error && (
      <Grid container alignItems="center" className={classes.pagerContainer}>
        {pages.map((element, index) => {
          return (
            <>
              {element}
              {index < pages.length - 1 && (
                <Divider orientation="vertical" flexItem />
              )}
            </>
          );
        })}
      </Grid>
    )
  );
};

export default Pager;
