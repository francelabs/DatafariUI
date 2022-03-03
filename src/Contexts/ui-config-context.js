import React, { useContext, useEffect, useReducer } from "react";
import useHttp from "../Hooks/useHttp";
import { APIEndpointsContext } from "./api-endpoints-context";

const DEFAULT_UI = {
  left: [
    {
      type: "FieldFacet",
      title: "Extension",
      field: "extension",
      op: "OR",
      minShow: 2,
      maxShow: 5,
    },
    {
      type: "FieldFacet",
      title: "Language",
      field: "language",
      op: "OR",
      minShow: 2,
      maxShow: 5,
    },
    {
      type: "FieldFacet",
      title: "Source",
      field: "repo_source",
      op: "OR",
      minShow: 2,
      maxShow: 5,
    },
    {
      type: "QueryFacet",
      title: "Creation Date",
      queries: [
        "creation_date:[NOW/DAY TO NOW]",
        "creation_date:[NOW/DAY-7DAY TO NOW/DAY]",
        "creation_date:[NOW/DAY-30DAY TO NOW/DAY-8DAY]",
        "creation_date:([1970-09-01T00:01:00Z TO NOW/DAY-31DAY] || [* TO 1970-08-31T23:59:59Z])",
        "creation_date:[1970-09-01T00:00:00Z TO 1970-09-01T00:00:00Z]",
      ],
      labels: [
        "Today",
        "From Yesterday Up To 7 days",
        "From 8 Days Up To 30 days",
        "Older than 31 days",
        "No date",
      ],
      id: "date_facet",
      minShow: 5,
      children: [
        {
          type: "DateFacetCustom",
        },
      ],
    },
    {
      type: "HierarchicalFacet",
      field: "urlHierarchy",
      title: "hierarchical facet",
      separator: "/",
    },
  ],
  center: {
    main: [
      {
        type: "SearchInformation",
        data: ["filters", "facets"],
      },
      {
        type: "ResultsList",
        data: ["title", "url", "logo", "previewButton", "extract"],
      },
    ],
    tabs: [
      { type: "FieldFacet", field: "extension", max: 3 }, // Display tabs as much as extension exist from results
      { type: "FieldFacet", field: "repo_source", max: 3 }, // Display tabs as much as source exist from results
      { type: "Raw", label: "google", url: "https://www.google.fr" }, // Display a tab named google that opens a new tab on www.google.fr
    ],
  },
  right: [],

  searchBar: {
    suggesters: [
      {
        type: "BASIC",
        props: {
          maxSuggestion: 5,
          title: "SUGGESTED QUERIES",
          subtitle: "Queries extending your current query terms",
        },
      },
      {
        type: "ENTITY",
        props: {
          field: "authorTokens",
          suggester: "suggestAuthors",
          dictionary: "suggesterEntityAuthors",
          asFacet: false,
          maxSuggestion: 5,
          title: "Entities suggested",
          subtitle: "Queries extending your current query terms",
        },
      },
    ],
  },
};

export const UIConfigContext = React.createContext();

// ACTION TYPES
export const SET_UI_DEFINITION = "SET_UI_DEFINITION";
export const SET_MASK_FIELD = "SET_MASK_FIELD";

const initialState = {
  uiDefinition: DEFAULT_UI,
  maskFieldFacet: "",
  isLoading: true,
};

// REDUCER
const uiConfigReducer = (state, action) => {
  switch (action.type) {
    case SET_UI_DEFINITION: {
      return {
        ...state,
        uiDefinition: action.definition,
        isLoading: false,
      };
    }

    case SET_MASK_FIELD: {
      return {
        ...state,
        maskFieldFacet: action.field,
      };
    }

    default:
      return state;
  }
};

const UIConfigContextProvider = ({ children }) => {
  const { getUIDefinitionURL } = useContext(APIEndpointsContext);
  const { isLoading, error, data, sendRequest } = useHttp();
  const [uiState, dispatch] = useReducer(uiConfigReducer, initialState);

  // Sends request to get ui definition json file
  useEffect(() => {
    sendRequest(getUIDefinitionURL, "GET");
  }, [getUIDefinitionURL, sendRequest]);

  // Process request events (loading status change, data reception, error)
  useEffect(() => {
    if (!isLoading) {
      if (!error && data && typeof data === "object") {
        dispatch({
          type: SET_UI_DEFINITION,
          definition: data,
        });
      }
    }
  }, [data, error, isLoading, dispatch]);

  return (
    <UIConfigContext.Provider value={{ ...uiState, dispatch }}>
      {children}
    </UIConfigContext.Provider>
  );
};

export default UIConfigContextProvider;
