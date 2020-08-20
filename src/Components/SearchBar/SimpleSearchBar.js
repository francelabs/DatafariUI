import React, { useCallback, useContext, useEffect, useState } from 'react';

import { QueryContext, SET_ELEMENTS } from '../../Contexts/query-context';

import './SimpleSearchBar.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FilledInput,
  InputLabel,
  InputAdornment,
  MenuList,
} from '@material-ui/core';
import BasicAutocomplete from './Autocompletes/BasicAutoComplete/BasicAutocomplete';
import SearchIcon from '@material-ui/icons/Search';

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
  const [queryText, setQueryText] = useState('');

  useEffect(() => {
    setQuerySuggestion(false);
    let timer = undefined;
    if (queryText) {
      timer = setTimeout(() => {
        setQuerySuggestion(true);
      }, 500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [setQuerySuggestion, queryText]);

  useEffect(() => {
    setQueryText(query.elements);
  }, [query]);

  const handleChange = useCallback(
    (event) => {
      setQueryText(event.target.value);
    },
    [setQueryText]
  );

  const search = (event) => {
    event.stopPropagation();
    queryDispatch({
      type: SET_ELEMENTS,
      elements: queryText,
    });
  };

  const handleSuggestSelect = (suggestion) => {
    setQueryText(suggestion);
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
          <InputLabel htmlFor="datafari-search-input">Search</InputLabel>
          <FilledInput
            id="datafari-search-input"
            type="text"
            value={queryText}
            onChange={handleChange}
            onBlur={() => setQuerySuggestion(false)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            labelWidth={50}
            className={props.className}
          />
        </FormControl>
      </form>
      <div
        className={classes.autocomplete}
        style={{ visibility: querySuggestion ? 'visible' : 'hidden' }}
      >
        <MenuList>
          <BasicAutocomplete
            active={querySuggestion}
            onSelect={handleSuggestSelect}
            queryText={queryText}
            op={query.op}
          />
        </MenuList>
      </div>
    </div>
  );
};

export default SimpleSearchBar;
