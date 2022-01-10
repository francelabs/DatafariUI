import { ClickAwayListener, makeStyles, MenuList } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.drawer,
    borderRadius: '5px',
  },
  menulist: {
    border: 'solid 1px',
    borderRadius: '5px',
    '&:empty': {
      display: 'none',
    },
  },
}));

const AutocompleteContainer = ({
  children,
  className,
  querySuggestion,
  handleClickAway,
}) => {
  const classes = useStyles();
  return (
    <div
      className={className ? className : classes.autocomplete}
      style={{
        visibility: querySuggestion ? 'visible' : 'hidden',
      }}
    >
      <ClickAwayListener onClickAway={() => handleClickAway()}>
        <MenuList classes={{ root: classes.menulist }}>{children}</MenuList>
      </ClickAwayListener>
    </div>
  );
};

export default AutocompleteContainer;
