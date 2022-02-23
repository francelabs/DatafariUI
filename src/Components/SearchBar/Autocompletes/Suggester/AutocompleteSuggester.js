import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  SearchContext,
  SearchContextActions,
} from "../../../../Contexts/search-context";
import Suggester from "./Suggester";

const TIMEOUT_MS = 4000;

const AutocompleteSuggester = (
  { type, suggester, suggesterProps, onClick, selection },
  ref
) => {
  const {
    querySuggestions,
    suggestions,
    title,
    subtitle,
    isLoading,
    onSelect,
  } = suggester(suggesterProps);

  const { searchState, searchDispatch } = useContext(SearchContext);
  const [isSearching, setSearching] = useState(false); // Inner searching state, more reliable

  // External API from parent to be called
  useImperativeHandle(ref, () => ({
    getSuggestions: () => suggestions,
    onSelect: onSelect,
  }));

  // UseEffect trigger searching with timeout
  let timer = useRef();
  useEffect(() => {
    const suggester = searchState.suggesters.find((s) => s.type === type);
    if (suggester && suggester.isSearching && !isSearching) {
      querySuggestions(searchState.queryText);
      setSearching(true);

      // This timer is used to force the display of the suggesters that have already answered, giving up on the ones that are too slow
      timer.current = setTimeout(() => {
        searchDispatch(SearchContextActions.done(type));
        setSearching(false);
      }, TIMEOUT_MS);
    }
  }, [searchState, querySuggestions, isSearching, type, searchDispatch]);

  // Effect when is done
  useLayoutEffect(() => {
    if (isSearching && !isLoading) {
      // Clear timeout if exists
      if (timer.current) {
        clearTimeout(timer.current);
      }

      searchDispatch(SearchContextActions.done(type));

      setSearching(false);
    }
  }, [isSearching, isLoading, searchDispatch, type]);

  return (
    <Suggester
      type={type}
      suggestions={suggestions}
      title={title}
      subtitle={subtitle}
      onClick={onClick}
      selection={selection}
    />
  );
};

export default forwardRef(AutocompleteSuggester);
