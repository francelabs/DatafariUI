import { Checkbox, makeStyles, Typography } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import React, { useCallback } from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import { CHECKED_STATE, UNDETERMINATE_STATE } from './HierarchicalFacet';

const useStyles = makeStyles((theme) => ({
  labelRoot: {
    display: 'grid',
    alignItems: 'flex-start',
    padding: theme.spacing(1, 0),
    gridTemplate: 'auto / 0fr auto 0fr',
  },
  labelCheckbox: {
    marginRight: theme.spacing(1),
    padding: 0,
  },
  undeterminateCheckBox: {
    color: orange[800],
    '&.Mui-checked': {
      color: orange[800],
    },
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
    overflow: 'auto',
    marginInline: '0px 10px',
    wordBreak: 'break-word',
  },
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  caption: {},
}));

const CustomTreeItem = ({
  id,
  label,
  number,
  children,
  onClick,
  checked,
  depth = 0,
  separator = '/',
}) => {
  const classes = useStyles();

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
            className={`${classes.labelCheckbox} ${
              checked === UNDETERMINATE_STATE
                ? classes.undeterminateCheckBox
                : ''
            }`}
            checked={
              checked === CHECKED_STATE || checked === UNDETERMINATE_STATE
            }
            indeterminate={checked === UNDETERMINATE_STATE}
            onClick={checkboxClick}
          />
          <Typography variant="body2" className={classes.labelText}>
            {depth === 0 ? label : label.split(separator)[depth]}
          </Typography>
          <Typography variant="body2" className={classes.caption}>
            {number}
          </Typography>
        </div>
      }
    >
      {children}
    </TreeItem>
  );
};

export default CustomTreeItem;
