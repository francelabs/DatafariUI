import React, { useContext, useEffect, useState } from 'react';
import './Pager.css';
import { QueryContext, SET_PAGE } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';

const Pager = (props) => {
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { results } = useContext(ResultsContext);
  const [clicked, setClicked] = useState(false);

  const lastPageRows = results.numFound % query.rows;
  const maxPage =
    (results.numFound - lastPageRows) / query.rows + (lastPageRows > 0 ? 1 : 0);

  const onClickHandler = (i) => {
    return () => {
      queryDispatch({ type: SET_PAGE, page: i });
      setClicked(true);
    };
  };

  useEffect(() => {
    if (clicked) {
      setClicked(false);
      // makeRequest();
    }
  }, [clicked, setClicked]);

  let pages = [];

  if (query.page > 1) {
    pages.push(
      <button className={`pager__button`} onClick={onClickHandler(1)}>
        &lt;&lt;
      </button>
    );
    pages.push(
      <button
        className={`pager__button`}
        onClick={onClickHandler(query.page - 1)}
      >
        &lt;
      </button>
    );
  }
  if (maxPage <= 5) {
    for (let i = 1; i <= maxPage; i++) {
      pages.push(
        <button
          className={`pager__button ${
            query.page === i ? 'pager__button__active' : ''
          }`}
          onClick={onClickHandler(i)}
        >
          {i}
        </button>
      );
    }
  } else {
    if (query.page <= 3) {
      for (let i = 1; (query.page === 3 && i <= 4) || i <= 3; i++) {
        pages.push(
          <button
            className={`pager__button ${
              query.page === i && 'pager__button__active'
            }`}
            onClick={onClickHandler(i)}
          >
            {i}
          </button>
        );
      }
      pages.push(<span>...</span>);
      pages.push(
        <button
          className={`pager__button ${
            query.page === maxPage && 'pager__button__active'
          }`}
          onClick={onClickHandler(maxPage)}
        >
          {maxPage}
        </button>
      );
    } else if (query.page >= maxPage - 2) {
      pages.push(
        <button
          className={`pager__button ${
            query.page === 1 && 'pager__button__active'
          }`}
          onClick={onClickHandler(1)}
        >
          1
        </button>
      );
      pages.push(<span>...</span>);
      if (query.page === maxPage - 2) {
        pages.push(
          <button
            className={`pager__button ${
              query.page === maxPage - 3 && 'pager__button__active'
            }`}
            onClick={onClickHandler(maxPage - 3)}
          >
            {maxPage - 3}
          </button>
        );
      }
      for (let i = maxPage - 2; i <= maxPage; i++) {
        pages.push(
          <button
            className={`pager__button ${
              query.page === i && 'pager__button__active'
            }`}
            onClick={onClickHandler(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          className={`pager__button ${
            query.page === 1 && 'pager__button__active'
          }`}
          onClick={onClickHandler(1)}
        >
          1
        </button>
      );
      pages.push(<span>...</span>);
      for (let i = query.page - 1; i <= query.page + 1; i++) {
        pages.push(
          <button
            className={`pager__button ${
              query.page === i && 'pager__button__active'
            }`}
            onClick={onClickHandler(i)}
          >
            {i}
          </button>
        );
      }
      pages.push(<span>...</span>);
      pages.push(
        <button
          className={`pager__button ${
            query.page === maxPage && 'pager__button__active'
          }`}
          onClick={onClickHandler(maxPage)}
        >
          {maxPage}
        </button>
      );
    }
  }
  if (query.page < maxPage) {
    pages.push(
      <button
        className={`pager__button`}
        onClick={onClickHandler(query.page + 1)}
      >
        &gt;
      </button>
    );
    pages.push(
      <button className={`pager__button`} onClick={onClickHandler(maxPage)}>
        &gt;&gt;
      </button>
    );
  }

  return <>{pages}</>;
};

export default Pager;
