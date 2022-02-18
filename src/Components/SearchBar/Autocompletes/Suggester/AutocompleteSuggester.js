import React, { forwardRef, useImperativeHandle } from "react";
import Suggester from "./Suggester";

const AutocompleteSuggester = ({ id, suggester, suggesterProps, onClick, selection }, ref) => {
  const { querySuggestions, suggestions, title, subtitle } = suggester(suggesterProps);

  // External API from parent to be called
  useImperativeHandle(ref, () => ({
    triggerQuery: (queryText) => querySuggestions(queryText),
    getSuggestions: () => suggestions,
    getId: () => id
  }));

  return (
    <Suggester
      id={id}
      suggestions={suggestions}
      title={title}
      subtitle={subtitle}
      onClick={onClick}
      selection={selection}
    />
  );
};

export default forwardRef(AutocompleteSuggester);
