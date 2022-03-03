import React from "react";
import AutocompleteFieldFacet from "./AutocompleteFieldFacet";
import CheckboxFieldFacet from "./CheckboxFieldFacet";

export const CHECKBOX_VARIANT = "checkbox";
export const AUTOCOMPLETE_VARIANT = "autocomplete";

const FacetComponentsByVariant = {
  [CHECKBOX_VARIANT]: CheckboxFieldFacet,
  [AUTOCOMPLETE_VARIANT]: AutocompleteFieldFacet,
};

const FieldFacet = ({ variant = CHECKBOX_VARIANT, ...props }) => {
  const FacetComponent =
    variant in FacetComponentsByVariant
      ? FacetComponentsByVariant[variant]
      : FacetComponentsByVariant[CHECKBOX_VARIANT]; // By default use the classic checkbox field facet

  return <FacetComponent {...props} />;
};

export default FieldFacet;
