import React, { useEffect, useRef, useState } from 'react';

const SearchBarElement = (props) => {
  const { isTag, text, isEditing, onChange, onClick, onBlur, index } = props;

  let cssClasses = 'search-bar__elm';
  if (isEditing) {
    cssClasses += ' search-bar__input';
  } else if (isTag) {
    cssClasses += ' search-bar__tag';
  }

  const [inputWidth, setInputWidth] = useState(10);
  const refinput = useRef(null);
  const refspan = useRef(null);

  const updateInputWidth = () => {
    if (!refspan || typeof refspan.current.scrollWidth === 'undefined') {
      return;
    }
    let newInputWidth = refspan.current.scrollWidth + 2;

    if (newInputWidth !== inputWidth) {
      setInputWidth(newInputWidth);
    }
  };

  useEffect(() => {
    updateInputWidth();
  });

  useEffect(() => {
    if (isEditing) {
      refinput.current.focus();
    }
  }, [isEditing]);

  let onChangeLocal = function (event) {
    onChange(index, event.target.value);
  };

  return (
    <React.Fragment>
      <input
        type="text"
        onChange={onChangeLocal}
        onClick={(event) => event.stopPropagation()}
        ref={refinput}
        value={text}
        className={cssClasses}
        onBlur={() => onBlur(index)}
        style={{
          display: isEditing ? 'initial' : 'none',
          width: inputWidth,
        }}
      />
      <span
        className={cssClasses}
        onClick={(event) => onClick(index, event)}
        style={{
          visibility: isEditing ? 'hidden' : 'visible',
          position: isEditing ? 'absolute' : 'initial',
        }}
        ref={refspan}
      >
        {text}
      </span>
    </React.Fragment>
  );
};

export default SearchBarElement;
