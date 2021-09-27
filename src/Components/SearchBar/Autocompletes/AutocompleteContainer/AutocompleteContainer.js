import { ClickAwayListener, makeStyles, MenuList } from '@material-ui/core';
import React, {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.drawer,
    border: 'solid 1px',
    borderRadius: '5px',
  },
}));

const AutocompleteContainer = ({ children, queryText, className }) => {
  const classes = useStyles();
  const [querySuggestion, setQuerySuggestion] = useState(false);
  const firstUpdate = useRef(true);

  useEffect(() => {
    let timer = undefined;
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      setQuerySuggestion(false);
      if (queryText) {
        timer = setTimeout(() => {
          setQuerySuggestion(true);
        }, 500);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [setQuerySuggestion, queryText]);

  const buildOnSelect = useCallback((onSelectFn) => {
    return (suggestion) => {
      setQuerySuggestion(false);
      firstUpdate.current = true;
      onSelectFn(suggestion);
    };
  }, []);

  return (
    <div
      className={className ? className : classes.autocomplete}
      style={{
        visibility: querySuggestion ? 'visible' : 'hidden',
      }}
    >
      <ClickAwayListener onClickAway={() => setQuerySuggestion(false)}>
        <MenuList>
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child, {
                active: querySuggestion,
                onSelect: buildOnSelect(child.props.onSelect),
              });
            }

            return child;
          })}
        </MenuList>
      </ClickAwayListener>
    </div>
  );
};

export default AutocompleteContainer;
