import React, { useCallback, useContext, useEffect, useState } from 'react';

import SearchBarElement from './SearchBarElement';
import { QueryContext } from '../../Contexts/query-context';

import useDatafari from '../../Hooks/useDatafari';

import './SearchBar.css';

const SearchBar = (props) => {
  const queryContext = useContext(QueryContext);

  const datafari = useDatafari();
  const [querySuggestion, setQuerySuggestion] = useState(false);

  const onClick = useCallback(
    (i, event) => {
      event.stopPropagation();
      let newElements = [...queryContext.elements];
      newElements = newElements.map((element) => {
        return { ...element, isEditing: false };
      });
      newElements[i].isEditing = true;
      queryContext.setElements(newElements);
    },
    [queryContext]
  );

  useEffect(() => {
    setQuerySuggestion(false);
    const timer = setTimeout(() => {
      setQuerySuggestion(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [setQuerySuggestion, queryContext]);

  const onChange = useCallback(
    (i, newText) => {
      let newElements = [...queryContext.elements];
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
      queryContext.setElements(newElements);
    },
    [queryContext]
  );

  const onBlur = useCallback(
    (i) => {
      let newElements = [...queryContext.elements];
      newElements[i].isEditing = false;
      queryContext.setElements(newElements);
    },
    [queryContext]
  );

  function addElement(event) {
    if (
      queryContext.elements.length === 0 ||
      queryContext.elements[queryContext.elements.length - 1].text !== ''
    ) {
      let newElements = [...queryContext.elements];
      newElements = newElements.map((element) => {
        return { ...element, isEditing: false };
      });
      queryContext.setElements([
        ...newElements,
        { isTag: false, text: '', isEditing: true },
      ]);
    } else {
      onClick(queryContext.elements.length - 1, event);
    }
  }

  const search = (event) => {
    event.stopPropagation();
    queryContext.resetFacetSelection();
    datafari.makeRequest();
  };

  return (
    <React.Fragment>
      <div className="search-bar__container">
        <div className="search-bar__content" onClick={addElement}>
          {queryContext.elements.map((element, i) => (
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
