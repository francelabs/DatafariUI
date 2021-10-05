import React, { useCallback, useContext, useEffect, useState } from 'react';

import { QueryContext } from '../../Contexts/query-context';

import './SimpleSearchBar.css';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputAdornment,
  MenuList,
  ClickAwayListener,
  InputBase,
  Button,
} from '@material-ui/core';
import BasicAutocomplete from './Autocompletes/BasicAutoComplete/BasicAutocomplete';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { useHistory } from 'react-router';
import qs from 'qs';
import EntityAutocomplete from './Autocompletes/EntityAutocomplete/EntityAutocomplete';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.drawer,
    border: 'solid 1px',
    borderRadius: '5px',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.dark,
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.05),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
  },
  clearButton: {
    borderRight: 'solid 1px rgba(0,0,0,0.12)',
    borderRadius: '0',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  inputFocused: {
    backgroundColor: fade(theme.palette.common.black, 0.05),
  },
}));

const SimpleSearchBar = (props) => {
  const classes = useStyles();
  const { query } = useContext(QueryContext);
  const history = useHistory();
  const { t } = useTranslation();

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

  const handleSubmit = (e) => {
    setQuerySuggestion(false);
    e.preventDefault();
    search(e);
  };

  const search = useCallback(
    (event) => {
      event.stopPropagation();
      const params = {
        elements: queryText === '' ? undefined : queryText,
      };
      const newLocation = {
        pathname: '/search',
        search: qs.stringify(params, { addQueryPrefix: true }),
      };
      history.push(newLocation);
    },
    [history, queryText]
  );

  const handleSuggestSelect = useCallback(
    (suggestion) => {
      setTextState({ queryText: suggestion, triggerSuggestion: false });
      setQuerySuggestion(false);
      const params = {
        elements: suggestion,
      };
      const newLocation = {
        pathname: '/search',
        search: qs.stringify(params, { addQueryPrefix: true }),
      };
      history.push(newLocation);
    },
    [history]
  );

  const handleClear = () => {
    setTextState({ queryText: '', triggerSuggestion: false });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth className={classes.search}>
          <InputBase
            fullWidth
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
              focused: classes.inputFocused,
            }}
            inputProps={{ 'aria-label': 'search', autocomplete: 'off' }}
            id="datafari-search-input"
            type="text"
            value={queryText}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                {queryText && (
                  <Button
                    onClick={handleClear}
                    size="small"
                    className={classes.clearButton}
                  >
                    <ClearIcon />
                  </Button>
                )}
                <Button onClick={handleSubmit} size="small" color="secondary">
                  <SearchIcon />
                </Button>
              </InputAdornment>
            }
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
            <EntityAutocomplete
              active={querySuggestion}
              onSelect={handleSuggestSelect}
              queryText={queryText}
              op={query.op}
              suggester="suggestAuthors"
              entityType={t('Author')}
              dictionary="suggesterEntityAuthors"
              field="authorTokens"
              maxSuggestion={3}
              asFacet={true}
            />
            <EntityAutocomplete
              active={querySuggestion}
              onSelect={handleSuggestSelect}
              queryText={queryText}
              op={query.op}
              suggester="suggestAuthors"
              entityType={t('Author')}
              dictionary="suggesterEntityAuthors"
              field="authorTokens"
              maxSuggestion={3}
              asFacet={false}
            />
          </MenuList>
        </ClickAwayListener>
      </div>
    </div>
  );
};

export default SimpleSearchBar;
