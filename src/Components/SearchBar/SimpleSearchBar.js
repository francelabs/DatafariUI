import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  InputAdornment,
  InputBase,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import qs from 'qs';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { QueryContext } from '../../Contexts/query-context';
import { SearchContext, SearchContextActions } from '../../Contexts/search-context';
import { checkUIConfigHelper, UIConfigContext } from '../../Contexts/ui-config-context';
import useHotkey, { ACTIVE_SEARCH_BAR_ID, DEACTIVE_SEARCH_BAR_ID } from '../../Hooks/useHotkey';
import AutocompleteContainer from './Autocompletes/AutocompleteContainer/AutocompleteContainer';
import './SimpleSearchBar.css';

const useStyles = makeStyles((theme) => {
  const search = {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    marginRight: theme.spacing(2),
    marginLeft: 0,

    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },

    '&::first-letter': {
      textTransform: 'lowercase',
    },
  };

  return {
    search,

    searchWithSuggestion: {
      ...search,
      borderRadius: 'none',
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
    },

    suggestions: {
      display: (props) => (props.showQuerySuggestion ? 'block' : 'none'),
      zIndex: 2,
    },

    clearButton: {
      borderRight: 'solid 1px rgba(0,0,0,0.12)',
      borderRadius: '0',

      [theme.breakpoints.down('sm')]: {
        minWidth: 25,
      },
    },

    searchButton: {
      [theme.breakpoints.down('sm')]: {
        minWidth: 25,
      },
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

      [theme.breakpoints.down('xs')]: {
        paddingLeft: 5,
      },
    },

    formContainer: {
      position: 'relative',
      zIndex: 2,
      width: '100%',
    },

    searchBackground: {
      display: (props) => (props.showQuerySuggestion ? 'block' : 'none'),
      width: '100%',
      height: '100%',
      background: theme.palette.grey[600] + 'AA', // grey with alpha
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1,
      backdropFilter: 'blur(2px)',
    },
  };
});

const DEBOUCE_TIME_MS = 500;

const SimpleSearchBar = () => {
  const [showQuerySuggestion, setShowQuerySuggestion] = useState(false);
  const [textState, setTextState] = useState({
    queryText: '',
    triggerSuggestion: false,
  });
  const { queryText } = textState;

  const inputSearchRef = useRef();
  const { t } = useTranslation();

  const classes = useStyles({ showQuerySuggestion });

  const { query } = useContext(QueryContext);
  const history = useHistory();
  const { searchState, searchDispatch } = useContext(SearchContext);

  const { uiDefinition } = useContext(UIConfigContext);
  checkUIConfig(uiDefinition);

  const { hotkeys = {}, searchBar: { backdrop = false } = { backdrop: false } } = uiDefinition;

  // Hotkey handlers
  const handleHotkey = useCallback(() => inputSearchRef.current.focus(), [inputSearchRef]);

  const handeEscapeHotkey = useCallback(() => {
    setShowQuerySuggestion(false);
    inputSearchRef.current.blur();
  }, [inputSearchRef, setShowQuerySuggestion]);

  // Focus on input search bar
  const { hotkey: searchHotkey } = useHotkey({
    ...hotkeys[ACTIVE_SEARCH_BAR_ID],
    callback: handleHotkey,
  });

  // Hide suggestions panel and blur input
  const { hotkey: escapeHotkey } = useHotkey({
    ...hotkeys[DEACTIVE_SEARCH_BAR_ID],
    callback: handeEscapeHotkey,
  });

  // USE EFFECTS
  useEffect(() => {   
    setTextState({ queryText: query.elements });
  }, [query]);

  useEffect(() => {
    console.log('selected field facets', query.fieldFacets, query.selectedFieldFacets);
    const { queryText } = textState;
    let sanitizeText = queryText;

    // Remove suggestion like author:"name"from search bar if not selected in field facets anymore
    // From the begining of the search text
    queryText
      .split(' ')
      .filter((q) => q.includes(':'))
      .map((fieldValueSuggestion) => {
        const [field, value] = fieldValueSuggestion.split(':');
        if (
          (!query.selectedFieldFacets[field] ||
            !query.selectedFieldFacets[field].includes(value.replaceAll('"', ''))) &&
          query.fieldFacets[field]
        ) {
          sanitizeText = queryText.slice(fieldValueSuggestion.length + 1);
        }
      });

    if (queryText !== sanitizeText) {
      setTextState({ queryText: sanitizeText });
      search(sanitizeText);
    }
  }, [query.fieldFacets, query.selectedFieldFacets]);

  // CALLBACKS
  let timeoutId = useRef();

  const handleChange = useCallback(
    (userText, triggerSuggestion = true) => {
      setTextState({
        queryText: userText,
      });

      setShowQuerySuggestion(true);   
      

      if (triggerSuggestion) {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
          searchDispatch(
            SearchContextActions.setSearchingAction(replaceSpacesWithHTMLSpace(userText))
          );
        }, DEBOUCE_TIME_MS);
      }
    },
    [setTextState, searchDispatch]
  );

  function replaceSpacesWithHTMLSpace(str) {  
    if (str.trim().length === 0) {
      return '';
    }
    return str.replace(/\s/g, '*');
  }
  
  const handleSubmit = (e) => {    
    setTextState({ queryText: textState.queryText });
    setShowQuerySuggestion(false);

    e.preventDefault();
    search(textState.queryText);
  };

  const search = useCallback(
    (suggestion) => {
      const params = {
        elements: suggestion === '' ? undefined : suggestion,
      };
      const newLocation = {
        pathname: '/search',
        search: qs.stringify(params, { addQueryPrefix: true }),
      };
      history.push(newLocation);

      setShowQuerySuggestion(false); // Hide suggestions
    },
    [history]
  );

  const handleClear = () => {
    setTextState({ queryText: '' });
    setShowQuerySuggestion(false);
  };

  const onClickSuggestion = (suggestion) => {
    handleChange(suggestion, false);
    search(suggestion);
  };

  return (
    <>
      {backdrop ? <div className={classes.searchBackground} /> : null}
      <ClickAwayListener onClickAway={() => setShowQuerySuggestion(false)}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmit}>
            <FormControl
              fullWidth
              className={showQuerySuggestion ? classes.searchWithSuggestion : classes.search}>
              <InputBase
                inputRef={inputSearchRef}
                fullWidth
                placeholder={t('Search')}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{
                  'aria-label': 'search',
                  autocomplete: 'off',
                  autoCapitalize: 'none',
                }}
                id="datafari-search-input"
                type="text"
                value={queryText}
                onChange={(event) => handleChange(event.target.value)}
                onFocus={() => setShowQuerySuggestion(true)}
                endAdornment={
                  <InputAdornment position="end">
                    {showQuerySuggestion ? escapeHotkey : searchHotkey}
                    {queryText && (
                      <Button onClick={handleClear} size="small" className={classes.clearButton}>
                        <ClearIcon />
                      </Button>
                    )}
                    <Button
                      onClick={handleSubmit}
                      size="small"
                      color="secondary"
                      className={classes.searchButton}>
                      <SearchIcon />
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>
            {searchState.isSearching && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress style={{ height: 2 }} color={'secondary'} />
              </Box>
            )}
          </form>

          <div className={classes.suggestions}>
            <AutocompleteContainer
              inputRef={inputSearchRef.current}
              onSelect={handleChange}
              onClick={onClickSuggestion}
            />
          </div>
        </div>
      </ClickAwayListener>
    </>
  );
};

export default SimpleSearchBar;

function checkUIConfig(uiConfig) {
  const helper = checkUIConfigHelper(uiConfig);
  if (typeof uiConfig.searchBar === 'object' && uiConfig.searchBar.backdrop) {
    helper(
      () => typeof uiConfig.searchBar.backdrop === 'boolean',
      'searchBar.backdrop',
      'Type boolean.'
    );
  }
}
