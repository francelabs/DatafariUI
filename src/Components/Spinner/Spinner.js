import { CircularProgress } from '@material-ui/core';
import React from 'react';

const Spinner = (props) => {
  return (
    <div>
      <CircularProgress color="secondary" />
    </div>
  );
};

export default Spinner;
