import { makeStyles, MenuList } from "@material-ui/core";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SearchContext,
  SearchContextActions,
} from "../../../../Contexts/search-context";
import AutocompleteSuggester from "../Suggester/AutocompleteSuggester";
import useSuggesters from "../Suggester/useSuggesters";

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    backgroundColor: theme.palette.grey[200],
    position: "absolute",
    width: "100%",
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    zIndex: theme.zIndex.drawer,
    boxShadow: "0px 15px 15px -15px " + theme.palette.grey[500],
    padding: "unset", // Padding is from MUI
  },
}));

const AutocompleteContainer = ({ inputRef, onSelect, onClick }) => {
  // states
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selection, setSelection] = useState();

  // Hooks
  const classes = useStyles();
  const { searchState, searchDispatch } = useContext(SearchContext);

  // Define suggesters
  const [autocompletePool] = useSuggesters();
  const autocompleteRefs = useRef({});

  const getSuggesterKeyId = useCallback((type, index) => {
    return `${type}-${index}`;
  }, []);

  const getSuggesterById = useCallback(
    (type, index) => {
      return autocompleteRefs.current[getSuggesterKeyId(type, index)];
    },
    [autocompleteRefs, getSuggesterKeyId]
  );

  // Effect to update suggesters on search context
  useEffect(() => {
    searchDispatch(
      SearchContextActions.setSuggesters(
        autocompletePool.map((suggester, index) =>
          getSuggesterKeyId(suggester.type, index)
        )
      )
    );
  }, [autocompletePool, searchDispatch, getSuggesterKeyId]);

  // Effect on searching
  useEffect(() => {
    if (searchState.isSearching) {
      setCurrentIndex(-1);
      setSelection();
    }
  }, [searchState]);

  // Effect on keydown events
  useEffect(() => {
    if (inputRef) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();

          // Build root suggestions based on each suggester and key/ID, with their suggestions and their corresponding index
          // Result is like following :
          // {id: 'BASIC-0', suggestion: 'enron', index: 0}
          // {id: 'BASIC-0', suggestion: 'energy', index: 1}
          // {id: 'BASIC-1', suggestion: 'enron', index: 0}
          // {id: 'BASIC-1', suggestion: 'energy', index: 1}
          // {id: 'BASIC-1', suggestion: 'end', index: 2}
          // {id: 'ENTITY-2', suggestion: 'enron', index: 0}
          // {id: 'ENTITY-2', suggestion: 'energy', index: 1}
          // {id: 'ENTITY-2', suggestion: 'engineering', index: 2}
          // {id: 'ENTITY-2', suggestion: 'end', index: 3}
          // {id: 'ENTITY-2', suggestion: 'ener', index: 4}

          const rootSuggestions = autocompletePool
            .map((suggester, indexSuggester) => {
              const suggesterRef = getSuggesterById(
                suggester.type,
                indexSuggester
              );
              return suggesterRef.getSuggestions().map((suggestion, index) => ({
                id: getSuggesterKeyId(suggester.type, indexSuggester),
                suggestion,
                index,
              }));
            })
            .flat();

          const index =
            e.key === "ArrowDown"
              ? Math.min(currentIndex + 1, rootSuggestions.length - 1)
              : Math.max(currentIndex - 1, 0);

          if (index > -1) {
            setCurrentIndex(index);
            const selectSuggestion = rootSuggestions[index];
            const suggesterRef = autocompleteRefs.current[selectSuggestion.id];
            suggesterRef.onSelect(
              selectSuggestion.suggestion,
              (formattedValue) => onSelect(formattedValue, false)
            );
            setSelection(selectSuggestion);
          }
        }
      };

      inputRef.addEventListener("keydown", handleKeyDown);

      return () => inputRef.removeEventListener("keydown", handleKeyDown);
    }
  }, [
    currentIndex,
    autocompletePool,
    getSuggesterById,
    getSuggesterKeyId,
    inputRef,
    onSelect,
  ]);

  return (
    <MenuList className={classes.autocomplete}>
      {autocompletePool.map((autocomplete, index) => {
        const { type, suggester, suggesterProps } = autocomplete;
        // To allow create multiple of the same suggester, they need different ID/key to be displayed
        const keyId = getSuggesterKeyId(type, index);
        return (
          <AutocompleteSuggester
            type={keyId}
            key={keyId}
            ref={(ref) => (autocompleteRefs.current[keyId] = ref)}
            suggester={suggester}
            suggesterProps={suggesterProps}
            onClick={onClick}
            selection={selection}
          />
        );
      })}
    </MenuList>
  );
};

export default AutocompleteContainer;
