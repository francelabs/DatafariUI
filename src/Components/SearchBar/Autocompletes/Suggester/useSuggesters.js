import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryContext } from '../../../../Contexts/query-context';
import { checkUIConfigHelper, UIConfigContext } from '../../../../Contexts/ui-config-context';
import useBasicAutocomplete from '../BasicAutoComplete/useBasicAutocomplete';
import useCustomSuggesterAutocomplete from '../CustomSuggesterAutocomplete/useCustomSuggesterAutocomplete';
import useEntityAutocomplete from '../EntityAutocomplete/useEntityAutocomplete';

export const BASIC_ID = 'BASIC';
export const ENTITY_ID = 'ENTITY';
export const CUSTOM_ID = 'CUSTOM';

const useSuggesters = () => {
  const { t } = useTranslation();
  const { query } = useContext(QueryContext);

  // Retrieve UI configuration for search bar
  const { uiDefinition } = useContext(UIConfigContext);
  const { searchBar } = uiDefinition;
  checkUIConfig(uiDefinition);

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
      type: CUSTOM_ID,
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
            checkSuggesters(suggester);
            const { type, props } = suggester;
            if (type && props) {
              const findSuggester = definedSuggesters.find((sugg) => sugg.type === type);
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

function checkUIConfig(uiConfig) {
  const helper = checkUIConfigHelper(uiConfig);
  if (
    helper(
      () => typeof uiConfig.searchBar === 'object',
      'searchBar',
      'Object used to configure the search bar with suggesters'
    )
  ) {
    helper(
      () => Array.isArray(uiConfig.searchBar.suggesters),
      'searchBar.suggesters',
      'An array to define suggesters to be used in the search bar'
    );
  }
}

function checkSuggesters(suggester) {
  const helper = checkUIConfigHelper(suggester);
  if (helper(() => typeof suggester === 'object', 'searchBar.suggesters')) {
    helper(
      () => typeof suggester.type === 'string',
      'suggester.type',
      `String to define the suggester type among: ${BASIC_ID}, ${ENTITY_ID}, ${CUSTOM_ID})`
    );
    helper(
      () => typeof suggester.props === 'object',
      'suggester.props',
      'Object to set props for suggester. Cf customization documentation'
    );
  }
}
