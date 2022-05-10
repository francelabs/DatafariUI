import React, { useReducer } from "react";

export const SearchContext = React.createContext();

const initialState = {
  isSearching: false,
  queryText: "",
  suggesters: [],
};

// Action types
const SearchContextActionTypes = {
  SET_SEARCHING: "setSearching",
  SET_SUGGESTERS: "setSuggesters",
  SEARCH_DONE: "searchDone",
};

// Action definitions
export const SearchContextActions = {
  setSuggesters: (types) => ({
    type: SearchContextActionTypes.SET_SUGGESTERS,
    suggesterTypes: types,
  }),

  setSearchingAction: (queryText) => ({
    type: SearchContextActionTypes.SET_SEARCHING,
    queryText,
  }),

  done: (type) => ({
    type: SearchContextActionTypes.SEARCH_DONE,
    suggesterType: type,
  }),
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case SearchContextActionTypes.SET_SEARCHING: {
      return {
        ...state,
        queryText: action.queryText,
        suggesters: state.suggesters.map((suggester) => ({
          ...suggester,
          isSearching: true,
        })),
        isSearching: true,
      };
    }

    case SearchContextActionTypes.SET_SUGGESTERS: {
      return {
        ...state,
        suggesters: action.suggesterTypes.map((type) => ({
          type,
          isSearching: false,
        })),
      };
    }

    case SearchContextActionTypes.SEARCH_DONE: {
      const suggesters = state.suggesters.map((suggester) => {
        if (suggester.type === action.suggesterType) {
          return {
            type: action.suggesterType,
            isSearching: false,
          };
        }
        return suggester;
      });

      return {
        ...state,
        suggesters,
        // Done if all has been done
        isSearching: !suggesters.every((suggester) => !suggester.isSearching),
      };
    }

    default:
      return state;
  }
};

const SearchContextProvider = ({ children }) => {
  const [searchState, searchDispatch] = useReducer(searchReducer, initialState);

  return (
    <SearchContext.Provider value={{ searchState, searchDispatch }}>
      {children}{" "}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
