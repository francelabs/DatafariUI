import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  makeStyles,
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
  return (
    <ListItem
      onClick={props.onClick}
      style={{ 'font-weight': props.selected ? 'bold' : 'normal' }}
    >
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
            <span className={classes.facetTextLabel}>{props.value}</span>
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
