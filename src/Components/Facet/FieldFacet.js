import React, { useContext, useEffect } from 'react';
import {
  QueryContext,
  REGISTER_FIELD_FACET,
} from '../../Contexts/query-context';
import AutocompleteFieldFacet from './AutocompleteFieldFacet';
import CheckboxFieldFacet from './CheckboxFieldFacet';

export const CHECKBOX_VARIANT = 'checkbox';
export const AUTOCOMPLETE_VARIANT = 'autocomplete';

const FacetComponentsByVariant = {
  [CHECKBOX_VARIANT]: CheckboxFieldFacet,
  [AUTOCOMPLETE_VARIANT]: AutocompleteFieldFacet,
};

const FieldFacet = ({
  variant = CHECKBOX_VARIANT,
  show = true,
  sendToSolr = true,
  ...props
}) => {
  const { field, op, title } = props;
  const { dispatch: queryDispatch } = useContext(QueryContext);

  // Effect to add the facet to the query if it is not registered
  useEffect(() => {
    if (sendToSolr) {
      const newFacet = {
        id: field,
        field: field,
        tag: field,
        op: op,
        title: title,
      };
      queryDispatch({ type: REGISTER_FIELD_FACET, fieldFacet: newFacet });
    }
  }, [field, queryDispatch, op, title, sendToSolr]);

  const FacetComponent =
    variant in FacetComponentsByVariant
      ? FacetComponentsByVariant[variant]
      : FacetComponentsByVariant[CHECKBOX_VARIANT]; // By default use the classic checkbox field facet

  return show ? <FacetComponent {...props} /> : null;
};

export default FieldFacet;
