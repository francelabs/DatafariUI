import { useRef, useState } from "react";
import useBasicAutocomplete from "../BasicAutoComplete/useBasicAutocomplete";
import useCustomSuggesterAutocomplete from "../CustomSuggesterAutocomplete/useCustomSuggesterAutocomplete";
import useEntityAutocomplete from "../EntityAutocomplete/useEntityAutocomplete";

export const BASIC_ID = "BASIC";
export const ENTITY_ID = "ENTITY";
export const CUSTOM_ID = "CUSTOM";

const useSuggesters = (query, t) => {
  return useState({
    [BASIC_ID]: {
      suggester: useBasicAutocomplete,
      suggesterProps: {
        op: query.op,
        maxSuggestion: 5,
        title: t("SUGGESTED QUERIES"),
        subtitle: t("Queries extending your current query terms")
      },
      ref: useRef()
    },

    [ENTITY_ID]: {
      suggester: useEntityAutocomplete,
      suggesterProps: {
        field: "authorTokens",
        op: query.op,
        suggester: "suggestAuthors",
        dictionary: "suggesterEntityAuthors",
        asFacet: false,
        maxSuggestion: 5,
        title: t("Entities suggested"),
        subtitle: t("Queries extending your current query terms")
      },
      ref: useRef()
    },

    [CUSTOM_ID]: {
      suggester: useCustomSuggesterAutocomplete,
      suggesterProps: {
        op: query.op,
        suggester: "authorTokens",
        maxSuggestions: 5,
        title: "Custom requested",
        subtitle: t("Queries extending your current query terms")
      },
      ref: useRef()
    }
  });
};

export default useSuggesters;
