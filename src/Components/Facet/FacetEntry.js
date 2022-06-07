import React, { useEffect, useState } from 'react';
import { Checkbox, makeStyles, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 16px',

    '&:hover': {
      cursor: 'pointer',
    },
  },
  facetTextLabel: {
    flexGrow: 1,
    paddingRight: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  facetControlInputRoot: {
    width: '100%',
    margin: '0',
  },

  facetControlInputLabel: {
    width: '100%',
  },
}));

const LABEL_MAX_SIZE = 24;

const FacetEntry = ({ value, selected, onClick, id, count, mappingValues = {} }) => {
  const [isChecked, setIsChecked] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setIsChecked(selected);
  }, [selected]);

  const prepareValue = () => {
    let prepareValue = '';
    if (Array.isArray(value)) {
      try {
        prepareValue = decodeURIComponent(value[0]);
      } catch (e) {
        prepareValue = value[0];
      }
    } else if (value) {
      try {
        prepareValue = decodeURIComponent(value);
      } catch (e) {
        prepareValue = value;
      }
    }

    // Map the value with the given mappingValues if it does exit
    return mappingValues[prepareValue] || prepareValue;
  };

  const label = prepareValue();

  return (
    <div className={classes.container} onClick={onClick}>
      <Checkbox checked={isChecked} onChange={onClick} edge="start" />
      {label.length > LABEL_MAX_SIZE ? (
        <Tooltip title={label} placement="bottom-start" aria-label={label}>
          <span className={classes.facetTextLabel}>{label}</span>
        </Tooltip>
      ) : (
        <span className={classes.facetTextLabel}>{label}</span>
      )}
      <span>{count}</span>
    </div>
  );
};

export default FacetEntry;
