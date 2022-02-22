import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { QueryContext } from "../../../../Contexts/query-context";
import {
  SearchContext,
  SearchContextActions,
} from "../../../../Contexts/search-context";
import { UIConfigContext } from "../../../../Contexts/ui-config-context";
import useBasicAutocomplete from "../BasicAutoComplete/useBasicAutocomplete";
import useCustomSuggesterAutocomplete from "../CustomSuggesterAutocomplete/useCustomSuggesterAutocomplete";
import useEntityAutocomplete from "../EntityAutocomplete/useEntityAutocomplete";

export const BASIC_ID = "BASIC";
export const ENTITY_ID = "ENTITY";
export const CUSTOM_ID = "CUSTOM";

const useSuggesters = () => {
  const { t } = useTranslation();
  const { query } = useContext(QueryContext);

  // Retrieve UI configuration for search bar
  const { uiDefinition } = useContext(UIConfigContext);
  const { searchBar } = uiDefinition;

  const { searchDispatch } = useContext(SearchContext);

  // Defined default suggesters with default props
  const [definedSuggesters] = useState([
    {
      type: BASIC_ID,
      suggester: useBasicAutocomplete,
    },

    {
      type: ENTITY_ID,
      suggester: useEntityAutocomplete,
    },

    {
      type: [CUSTOM_ID],
      suggester: useCustomSuggesterAutocomplete,
    },
  ]);

  // Build suggesters accordingly to ui-config as an object map with ID as key
  const [builtSuggesters, setBuiltSuggesters] = useState([]);

  useEffect(() => {
    if (searchBar && searchBar.suggesters) {
      const { suggesters } = searchBar;

      setBuiltSuggesters(
        suggesters
          .map((suggester) => {
            const { type, props } = suggester;
            if (type && props) {
              const findSuggester = definedSuggesters.find(
                (sugg) => sugg.type === type
              );
              if (findSuggester) {
                return {
                  ...findSuggester,
                  suggesterProps: {
                    // Default props
                    op: query.op,
                    // Props from uiConfig
                    ...props,
                    title: t(props.title),
                    subtitle: t(props.subtitle),
                  },
                };
              }
            }
            return null;
          })
          // Remove null suggester
          .filter((suggester) => suggester)
      );
    }
  }, [definedSuggesters, searchBar, t, query.op]);

  return [builtSuggesters];
};

export default useSuggesters;
