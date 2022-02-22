import { useCallback, useContext, useEffect, useState } from "react";
import { APIEndpointsContext } from "../../../../Contexts/api-endpoints-context";
import useHttp from "../../../../Hooks/useHttp.js";

const useBasicAutocomplete = ({ op, maxSuggestion, title, subtitle }) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);

  const [queryID, setQueryID] = useState(null);
  const [queryText, setQueryText] = useState(null);

  const querySuggestions = useCallback(
    (queryText) => {
      setSuggestions([]);
      setQueryText(queryText);

      let newQueryID = Math.random().toString(36).substring(2, 15);
      setQueryID(newQueryID);
      sendRequest(
        `${apiEndpointsContext.searchURL}/suggest?action=suggest&q=${queryText}&autocomplete=true&spellcheck.collateParam.q.op=${op}`,
        "GET",
        null,
        newQueryID
      );
    },
    [apiEndpointsContext.searchURL, op, sendRequest]
  );

  // Handle response from querySuggestions
  useEffect(() => {
    if (!isLoading) {
      if (!error && data && reqIdentifier === queryID) {
        let newSuggestions = [];
        if (!data.error && data.spellcheck && data.spellcheck.collations) {
          newSuggestions = data.spellcheck.collations
            .filter((element) => {
              return (
                element && element !== "collation" && element.collationQuery
              );
            })
            .map((element) => {
              return element.collationQuery;
            })
            .slice(0, maxSuggestion ?? -1);
        }
        setSuggestions(newSuggestions);
      }
    }
  }, [
    data,
    error,
    isLoading,
    setSuggestions,
    reqIdentifier,
    queryID,
    queryText,
    maxSuggestion,
  ]);

  const onSelect = useCallback((value, onSelect) => {
    if (onSelect) {
      onSelect(value);
    }
  }, []);

  return {
    querySuggestions: querySuggestions,
    onSelect: onSelect,
    isLoading,
    suggestions: suggestions,
    title: title,
    subtitle: subtitle,
  };
};

export default useBasicAutocomplete;
