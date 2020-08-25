import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  makeStyles,
  Tooltip,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  facetTextContainer: {
    display: 'flex',
  },
  facetTextLabel: {
    flexGrow: 1,
    paddingRight: theme.spacing(1),
  },
}));

const FacetEntry = (props) => {
  const classes = useStyles();

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
    <ListItem onClick={props.onClick}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={props.selected}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': props.id }}
        />
      </ListItemIcon>
      <ListItemText
        id={props.id}
        primary={
          <>
            <span className={classes.facetTextLabel}>{prepareValue()}</span>
            <span>{props.count}</span>
          </>
        }
        primaryTypographyProps={{ className: classes.facetTextContainer }}
      />
      {/* <ListItemSecondaryAction>{props.count}</ListItemSecondaryAction> */}
    </ListItem>
  );
};

export default FacetEntry;
