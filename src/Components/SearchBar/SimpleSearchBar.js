import React, { useCallback, useContext, useEffect, useState } from 'react';

import { QueryContext, SET_ELEMENTS } from '../../Contexts/query-context';

import './SimpleSearchBar.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FilledInput,
  InputAdornment,
  MenuList,
  IconButton,
  ClickAwayListener,
} from '@material-ui/core';
import BasicAutocomplete from './Autocompletes/BasicAutoComplete/BasicAutocomplete';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

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

const SimpleSearchBar = (props) => {
  const classes = useStyles();
  const { query, dispatch: queryDispatch } = useContext(QueryContext);

  const [querySuggestion, setQuerySuggestion] = useState(false);
  const [textState, setTextState] = useState({
    queryText: '',
    triggerSuggestion: false,
  });

  const { queryText, triggerSuggestion } = textState;

  useEffect(() => {
    setQuerySuggestion(false);
    let timer = undefined;
    if (queryText && triggerSuggestion) {
      timer = setTimeout(() => {
        setQuerySuggestion(true);
      }, 500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [setQuerySuggestion, queryText, triggerSuggestion]);

  useEffect(() => {
    setTextState({ queryText: query.elements, triggerSuggestion: false });
  }, [query]);

  const handleChange = useCallback(
    (event) => {
      setTextState({ queryText: event.target.value, triggerSuggestion: true });
    },
    [setTextState]
  );

  const search = (event) => {
    event.stopPropagation();
    queryDispatch({
      type: SET_ELEMENTS,
      elements: queryText,
    });
  };

  const handleSuggestSelect = (suggestion) => {
    queryDispatch({
      type: SET_ELEMENTS,
      elements: suggestion,
    });
  };

  const handleClear = () => {
    setTextState({ queryText: '', triggerSuggestion: false });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          setQuerySuggestion(false);
          e.preventDefault();
          search(e);
        }}
      >
        <FormControl fullWidth variant="filled" margin="dense">
          {/* <InputLabel htmlFor="datafari-search-input">Search</InputLabel> */}
          <FilledInput
            id="datafari-search-input"
            type="text"
            value={queryText}
            onChange={handleChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            endAdornment={
              queryText && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClear}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
            labelWidth={50}
            className={props.className}
          />
        </FormControl>
      </form>
      <div
        className={classes.autocomplete}
        style={{
          visibility: querySuggestion ? 'visible' : 'hidden',
        }}
      >
        <ClickAwayListener onClickAway={() => setQuerySuggestion(false)}>
          <MenuList>
            <BasicAutocomplete
              active={querySuggestion}
              onSelect={handleSuggestSelect}
              queryText={queryText}
              op={query.op}
            />
          </MenuList>
        </ClickAwayListener>
      </div>
    </div>
  );
};

export default SimpleSearchBar;
