import { Checkbox, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import produce from 'immer';
import { CHECKED_STATE, UNDETERMINATE_STATE } from './HierarchicalFacet';

const useStyles = makeStyles((theme) => ({
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelCheckbox: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
}));

const CustomTreeItem = (props) => {
  const classes = useStyles();
  const { id, label, number, children, onClick, checked } = props;

  const checkboxClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(id);
    },
    [id, onClick]
  );

  const labelClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      checkboxClick(event);
    },
    [checkboxClick]
  );

  return (
    <TreeItem
      nodeId={id}
      label={
        <div className={classes.labelRoot} onClick={labelClick}>
          <Checkbox
            className={classes.labelCheckbox}
            checked={
              checked === CHECKED_STATE || checked === UNDETERMINATE_STATE
            }
            indeterminate={checked === UNDETERMINATE_STATE}
            onClick={checkboxClick}
          />
          <Typography variant="body2" className={classes.labelText}>
            {label}
          </Typography>
          <Typography variant="caption">{number}</Typography>
        </div>
      }
    >
      {children}
    </TreeItem>
  );
};

export default CustomTreeItem;
