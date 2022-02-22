import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  FormControl,
  InputAdornment,
  InputBase,
  LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import qs from "qs";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { QueryContext } from "../../Contexts/query-context";
import {
  SearchContext,
  SearchContextActions,
} from "../../Contexts/search-context";
import AutocompleteContainer from "./Autocompletes/AutocompleteContainer/AutocompleteContainer";
import "./SimpleSearchBar.css";

const useStyles = makeStyles((theme) => {
  const search = {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    marginRight: theme.spacing(2),
    marginLeft: 0,

    "&:hover": {
      backgroundColor: theme.palette.grey[300],
    },
  };

  return {
    search,

    searchWithSuggestion: {
      ...search,
      borderRadius: "none",
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
    },

    suggestions: {
      display: (props) => (props.showQuerySuggestion ? "block" : "none"),
    },

    clearButton: {
      borderRight: "solid 1px rgba(0,0,0,0.12)",
      borderRadius: "0",
    },

    inputRoot: {
      color: "inherit",
    },

    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
    },
  };
});

const DEBOUCE_TIME_MS = 500;

const SimpleSearchBar = () => {
  const [showQuerySuggestion, setShowQuerySuggestion] = useState(false);
  const [textState, setTextState] = useState({
    queryText: "",
    triggerSuggestion: false,
  });

  const { queryText } = textState;

  const inputSearchRef = useRef();
  const { t } = useTranslation();

  const classes = useStyles({ showQuerySuggestion });

  const { query } = useContext(QueryContext);
  const history = useHistory();
  const { searchState, searchDispatch } = useContext(SearchContext);

  useEffect(() => {
    setTextState({ queryText: query.elements });
  }, [query]);

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
          searchDispatch(SearchContextActions.setSearchingAction(userText));
        }, DEBOUCE_TIME_MS);
      }
    },
    [setTextState, searchDispatch]
  );

  const handleSubmit = (e) => {
    setTextState({ queryText: textState.queryText });
    setShowQuerySuggestion(false);

    e.preventDefault();
    search(textState.queryText);
  };

  const search = useCallback(
    (suggestion) => {
      const params = {
        elements: suggestion === "" ? undefined : suggestion,
      };
      const newLocation = {
        pathname: "/search",
        search: qs.stringify(params, { addQueryPrefix: true }),
      };
      history.push(newLocation);

      setShowQuerySuggestion(false); // Hide suggestions
    },
    [history]
  );

  const handleClear = () => {
    setTextState({ queryText: "" });
    setShowQuerySuggestion(false);
  };

  const onClickSuggestion = (suggestion) => {
    handleChange(suggestion, false);
    search(suggestion);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowQuerySuggestion(false)}>
      <div>
        <form onSubmit={handleSubmit}>
          <FormControl
            fullWidth
            className={
              showQuerySuggestion
                ? classes.searchWithSuggestion
                : classes.search
            }
          >
            <InputBase
              ref={inputSearchRef}
              fullWidth
              placeholder={t("Search")}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search", autocomplete: "off" }}
              id="datafari-search-input"
              type="text"
              value={queryText}
              onChange={(event) => handleChange(event.target.value)}
              onFocus={() => setShowQuerySuggestion(true)}
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

        <div className={classes.suggestions}>
          <AutocompleteContainer
            inputRef={inputSearchRef.current}
            onSelect={handleChange}
            onClick={onClickSuggestion}
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default SimpleSearchBar;
