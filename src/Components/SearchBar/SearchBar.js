import React, { useCallback, useContext, useEffect, useState } from 'react';

import SearchBarElement from './SearchBarElement';
import {
  QueryContext,
  SET_ELEMENTS,
  RESET_FACETS_SELECTION,
} from '../../Contexts/query-context';

import './SearchBar.css';

const SearchBar = (props) => {
  const { query, dispatch: queryDispatch } = useContext(QueryContext);

  const [querySuggestion, setQuerySuggestion] = useState(false);

  const onClick = useCallback(
    (i, event) => {
      event.stopPropagation();
      let newElements = [...query.elements];
      newElements = newElements.map((element) => {
        return { ...element, isEditing: false };
      });
      newElements[i].isEditing = true;
      queryDispatch({ type: SET_ELEMENTS, elements: newElements });
    },
    [query.elements, queryDispatch]
  );

  useEffect(() => {
    setQuerySuggestion(false);
    const timer = setTimeout(() => {
      setQuerySuggestion(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [setQuerySuggestion, query.elements]);

  const onChange = useCallback(
    (i, newText) => {
      let newElements = [...query.elements];
      let insertedTexts = newText.split(' ').filter((elm) => elm !== '');
      if (insertedTexts.length === 1) {
        newElements[i].text = newText;
      } else if (insertedTexts.length === 0) {
        if (newText === '' && i !== 0) {
          newElements[i - 1].isEditing = true;
          newElements.splice(i, 1);
        } else {
          newElements[i].text = newText;
        }
      } else {
        let insertedElements = insertedTexts.map((elm, idx) => {
          return {
            isTag: false,
            text: elm,
            isEditing: idx === insertedTexts.length - 1,
          };
        });
        newElements.splice(i, 1, ...insertedElements);
      }
      queryDispatch({ type: SET_ELEMENTS, elements: newElements });
    },
    [query, queryDispatch]
  );

  const onBlur = useCallback(
    (i) => {
      let newElements = [...query.elements];
      newElements[i].isEditing = false;
      queryDispatch({ type: SET_ELEMENTS, elements: newElements });
    },
    [query, queryDispatch]
  );

  function addElement(event) {
    if (
      query.elements.length === 0 ||
      query.elements[query.elements.length - 1].text !== ''
    ) {
      let newElements = [...query.elements];
      newElements = newElements.map((element) => {
        return { ...element, isEditing: false };
      });
      queryDispatch({
        type: SET_ELEMENTS,
        elements: [...newElements, { isTag: false, text: '', isEditing: true }],
      });
    } else {
      onClick(query.elements.length - 1, event);
    }
  }

  const search = (event) => {
    event.stopPropagation();
    queryDispatch({ type: RESET_FACETS_SELECTION });
  };

  return (
    <React.Fragment>
      <div className="search-bar__container">
        <div className="search-bar__content" onClick={addElement}>
          {query.elements.map((element, i) => (
            <SearchBarElement
              isTag={element.isTag}
              isEditing={element.isEditing}
              text={element.text}
              onChange={onChange}
              onClick={onClick}
              onBlur={onBlur}
              index={i}
            />
          ))}
          <button onClick={search}>Search</button>
        </div>
      </div>
      <div className="search-bar__suggestions">
        <div style={{ visibility: querySuggestion ? 'visible' : 'hidden' }}>
          Hello
        </div>
      </div>
    </React.Fragment>
  );
};

export default SearchBar;
