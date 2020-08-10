import React from 'react';

const FacetEntry = (props) => {
  return (
    <span
      onClick={props.onClick}
      style={{ 'font-weight': props.selected ? 'bold' : 'normal' }}
    >
      {props.value} ({props.count})
    </span>
  );
};

export default FacetEntry;
