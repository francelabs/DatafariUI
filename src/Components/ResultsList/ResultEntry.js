import React from 'react';

const ResultEntry = (props) => (
  <div>
    <span>{props.title}</span>
    <span>{props.preview_content[0]}</span>
    <span>{props.url}</span>
  </div>
);

export default ResultEntry;
