import { makeStyles, MenuList } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { QueryContext } from "../../../../Contexts/query-context";
import AutocompleteSuggester from "../Suggester/AutocompleteSuggester";
import useSuggesters, { BASIC_ID, ENTITY_ID } from "../Suggester/useSuggesters";

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    backgroundColor: theme.palette.grey[200],
    position: "absolute",
    width: "100%",
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    zIndex: theme.zIndex.drawer,
    boxShadow: "0px 15px 15px -15px " + theme.palette.grey[500],
    padding: "unset" // Padding is from MUI
  }
}));

const DEBOUCE_TIME_MS = 500;

const AutocompleteContainer = ({
  useAutocomplete = [BASIC_ID, ENTITY_ID],
  inputRef,
  queryText,
  onSelect,
  triggerSuggestion,
  onClick
}) => {
  // states
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selection, setSelection] = useState();
  const [autocompletePool, setAutocompletePool] = useState([]);

  // Hooks
  const classes = useStyles();
  const { t } = useTranslation();
  const { query } = useContext(QueryContext);

  // Define suggesters
  const [autocompleteById] = useSuggesters(query, t);

  // Effect autocomplete pool
  useEffect(() => {
    setAutocompletePool(useAutocomplete.map((id) => autocompleteById[id]));
  }, [autocompleteById, useAutocomplete]);

  // Effect trigger suggestions
  let timeoutId = useRef();
  useEffect(() => {
    if (triggerSuggestion) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        autocompletePool.forEach((suggester) => {
          suggester.ref.current.triggerQuery(queryText);
        });
        setCurrentIndex(-1);
        setSelection();
      }, DEBOUCE_TIME_MS);

      return () => clearTimeout(timeoutId.current);
    }
  }, [autocompletePool, queryText, triggerSuggestion]);

  // Effect on keydown events
  useEffect(() => {
    if (inputRef) {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();

          // Build root suggestions
          const rootSuggestions = autocompletePool
            .map((suggester) =>
              suggester.ref.current.getSuggestions().map((suggestion, index) => ({
                id: suggester.ref.current.getId(),
                suggestion,
                index
              }))
            )
            .flat();

          const index =
            e.key === "ArrowDown"
              ? Math.min(currentIndex + 1, rootSuggestions.length - 1)
              : Math.max(currentIndex - 1, 0);

          if (index > -1) {
            setCurrentIndex(index);
            const selectSuggestion = rootSuggestions[index];
            onSelect(selectSuggestion.suggestion, false);
            setSelection(selectSuggestion);
          }
        }
      };

      inputRef.addEventListener("keydown", handleKeyDown);

      return () => inputRef.removeEventListener("keydown", handleKeyDown);
    }
  }, [currentIndex, autocompletePool, inputRef, onSelect]);

  return (
    <MenuList className={classes.autocomplete}>
      {useAutocomplete.map((id) => {
        if (autocompleteById[id]) {
          const { suggester, suggesterProps, ref } = autocompleteById[id];

          return (
            <AutocompleteSuggester
              key={id}
              ref={ref}
              id={id}
              suggester={suggester}
              suggesterProps={suggesterProps}
              onClick={onClick}
              selection={selection}
            />
          );
        }

        return null;
      })}
    </MenuList>
  );
};

export default AutocompleteContainer;
