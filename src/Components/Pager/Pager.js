import React, { useContext, useEffect, useState } from 'react';
import './Pager.css';
import { QueryContext } from '../../Contexts/query-context';
import { ResultsContext } from '../../Contexts/results-context';
import useDatafari from '../../Hooks/useDatafari';

const Pager = (props) => {
  const { page, setPage, rows } = useContext(QueryContext);
  const { numFound } = useContext(ResultsContext);
  const { makeRequest } = useDatafari();
  const [clicked, setClicked] = useState(false);

  const lastPageRows = numFound % rows;
  const maxPage = (numFound - lastPageRows) / rows + (lastPageRows > 0 ? 1 : 0);

  const onClickHandler = (i) => {
    return () => {
      setPage(i);
      setClicked(true);
    };
  };

  useEffect(() => {
    if (clicked) {
      setClicked(false);
      makeRequest();
    }
  }, [clicked, makeRequest, setClicked]);

  let pages = [];
  if (page > 1) {
    pages.push(
      <button className={`pager__button`} onClick={onClickHandler(1)}>
        &lt;&lt;
      </button>
    );
    pages.push(
      <button className={`pager__button`} onClick={onClickHandler(page - 1)}>
        &lt;
      </button>
    );
  }
  if (maxPage <= 5) {
    for (let i = 1; i <= maxPage; i++) {
      pages.push(
        <button
          className={`pager__button ${
            page === i ? 'pager__button__active' : ''
          }`}
          onClick={onClickHandler(i)}
        >
          {i}
        </button>
      );
    }
  } else {
    if (page <= 3) {
      for (let i = 1; (page === 3 && i <= 4) || i <= 3; i++) {
        pages.push(
          <button
            className={`pager__button ${page === i && 'pager__button__active'}`}
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
            page === maxPage && 'pager__button__active'
          }`}
          onClick={onClickHandler(maxPage)}
        >
          {maxPage}
        </button>
      );
    } else if (page >= maxPage - 2) {
      pages.push(
        <button
          className={`pager__button ${page === 1 && 'pager__button__active'}`}
          onClick={onClickHandler(1)}
        >
          1
        </button>
      );
      pages.push(<span>...</span>);
      if (page === maxPage - 2) {
        pages.push(
          <button
            className={`pager__button ${
              page === maxPage - 3 && 'pager__button__active'
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
            className={`pager__button ${page === i && 'pager__button__active'}`}
            onClick={onClickHandler(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          className={`pager__button ${page === 1 && 'pager__button__active'}`}
          onClick={onClickHandler(1)}
        >
          1
        </button>
      );
      pages.push(<span>...</span>);
      for (let i = page - 1; i <= page + 1; i++) {
        pages.push(
          <button
            className={`pager__button ${page === i && 'pager__button__active'}`}
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
            page === maxPage && 'pager__button__active'
          }`}
          onClick={onClickHandler(maxPage)}
        >
          {maxPage}
        </button>
      );
    }
  }
  if (page < maxPage) {
    pages.push(
      <button className={`pager__button`} onClick={onClickHandler(page + 1)}>
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
