import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  makeStyles,
  Tooltip,
  FormControlLabel,
} from '@material-ui/core';
import { useState, useEffect } from 'react';

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

const FacetEntry = (props) => {
  const classes = useStyles();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(props.selected);
  }, [props.selected]);

  const prepareValue = () => {
    let value = '';
    if (Array.isArray(props.value)) {
      try {
        value = decodeURIComponent(props.value[0]);
      } catch (e) {
        value = props.value[0];
      }
    } else if (props.value !== undefined && props.value !== null) {
      try {
        value = decodeURIComponent(props.value);
      } catch (e) {
        value = props.value;
      }
    }
    if (value.length > 50) {
      value = (
        <Tooltip title={value} aria-label={value}>
          <span>
            {value.substring(0, 15) +
              '...' +
              value.substring(value.length - 15)}
          </span>
        </Tooltip>
      );
    }
    return value;
  };

  return (
    <>
      <ListItem>
        <FormControlLabel
          control={
            <ListItemIcon>
              <Checkbox
                checked={isChecked}
                onChange={props.onClick}
                edge="start"
              />
            </ListItemIcon>
          }
          label={
            <ListItemText
              id={props.id}
              primary={
                <>
                  <span className={classes.facetTextLabel}>
                    {prepareValue()}
                  </span>
                  <span>{props.count}</span>
                </>
              }
              primaryTypographyProps={{ className: classes.facetTextContainer }}
            />
          }
          classes={{
            root: classes.facetControlInputRoot,
            label: classes.facetControlInputLabel,
          }}
          margin="none"
        />
      </ListItem>
    </>
  );
};

export default FacetEntry;
