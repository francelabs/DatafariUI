import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  SearchContext,
  SearchContextActions,
} from "../../../../Contexts/search-context";
import Suggester from "./Suggester";

const AutocompleteSuggester = (
  { type, suggester, suggesterProps, onClick, selection },
  ref
) => {
  const { querySuggestions, suggestions, title, subtitle, isLoading } =
    suggester(suggesterProps);

  const { searchState, searchDispatch } = useContext(SearchContext);
  const [isSearching, setSearching] = useState(false); // Inner searching state, more reliable

  // External API from parent to be called
  useImperativeHandle(ref, () => ({
    getSuggestions: () => suggestions,
  }));

  // UseEffect trigger searching
  useEffect(() => {
    const suggester = searchState.suggesters.find((s) => s.type === type);
    if (suggester && suggester.isSearching) {
      querySuggestions(searchState.queryText);
      setSearching(true);
    }
  }, [searchState, querySuggestions, type]);

  // Effect when is done
  useEffect(() => {
    if (isSearching && !isLoading) {
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
