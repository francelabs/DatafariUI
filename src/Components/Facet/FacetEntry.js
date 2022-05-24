import {
  Checkbox,
  FormControlLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  facetTextContainer: {
    display: 'flex',
  },
  facetTextLabel: {
    flexGrow: 1,
    paddingRight: theme.spacing(1),
  },

  facetControlInputRoot: {
    width: '100%',
    margin: '0',
  },

  facetControlInputLabel: {
    width: '100%',
  },
}));

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
    prepareValue = mappingValues[prepareValue] || prepareValue;

    if (prepareValue.length > 50) {
      prepareValue = (
        <Tooltip title={value} aria-label={value}>
          <span>{value.substring(0, 15) + '...' + value.substring(value.length - 15)}</span>
        </Tooltip>
      );
    }

    return prepareValue;
  };

  return (
    <ListItem>
      <FormControlLabel
        control={
          <ListItemIcon>
            <Checkbox checked={isChecked} onChange={onClick} edge="start" />
          </ListItemIcon>
        }
        label={
          <ListItemText
            id={id}
            primary={
              <>
                <span className={classes.facetTextLabel}>{prepareValue()}</span>
                <span>{count}</span>
              </>
            }
            primaryTypographyProps={{
              className: classes.facetTextContainer,
            }}
          />
        }
        classes={{
          root: classes.facetControlInputRoot,
          label: classes.facetControlInputLabel,
        }}
        margin="none"
      />
    </ListItem>
  );
};

export default FacetEntry;
