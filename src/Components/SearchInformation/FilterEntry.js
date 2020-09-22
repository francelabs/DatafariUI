import React from 'react';
import {
  Typography,
  Link,
  Icon,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  clearIcon: {
    height: '1rem',
    width: '1rem',
  },
}));

const FilterEntry = (props) => {
  const classes = useStyles();
  return (
    <Typography component="span">
      {props.value}
      <IconButton className={classes.clearIcon} onClick={props.onClick}>
        <ClearIcon className={classes.clearIcon} />
      </IconButton>
    </Typography>
  );
};

export default FilterEntry;
