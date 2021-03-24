import React, { useState } from 'react';

const DEFAULT_ENDPOINTS = {
  datafariBaseURL: '',
  restAPIBaseURL: '',
  authURL: '',
  adminURL: '',
  currentUserURL: '',
  currentUserAlertsURL: '',
  currentUserSavedSearchesURL: '',
  searchURL: '',
  getAutocompleteAdvancedFieldsURL: '',
  getFixedValuesAdvancedFieldsURL: '',
  getLabeledAdvancedFieldsURL: '',
  getFieldsInfoURL: '',
  getExactFieldsURL: '',
  getFavoritesURL: '',
  addFavoriteURL: '',
  deleteFavoriteURL: '',
  docRedirectURL: '',
  getHelpURL: '',
  getPrivacyPolicyURL: '',
  getEmailsAdminURL: '',
};

export const APIEndpointsContext = React.createContext(DEFAULT_ENDPOINTS);

const APIEndpointsContextProvider = (props) => {
  // Getting rid of the last forward slash if it is there.
  const [datafariBaseURL] = useState(
    window.datafariBaseURL.pathname[
      window.datafariBaseURL.pathname.length - 1
    ] === '/'
      ? new URL(
          window.datafariBaseURL.pathname.substring(
            0,
            window.datafariBaseURL.pathname.lenth - 1
          ),
          window.datafariBaseURL
        )
      : new URL(window.datafariBaseURL)
  );

  const [restAPIBaseURL] = useState(
    new URL(`${datafariBaseURL.pathname}/rest/v1.0`, datafariBaseURL)
  );

  const [value] = useState({
    datafariBaseURL: datafariBaseURL,
    restAPIBaseURL: restAPIBaseURL,
    authURL: new URL(`${restAPIBaseURL.pathname}/auth`, restAPIBaseURL),
    adminURL: new URL(`${datafariBaseURL.pathname}/admin/`, datafariBaseURL),
    currentUserURL: new URL(
      `${restAPIBaseURL.pathname}/users/current`,
      restAPIBaseURL
    ),
    searchURL: new URL(`${restAPIBaseURL.pathname}/search`, restAPIBaseURL),
    currentUserAlertsURL: new URL(
      `${restAPIBaseURL.pathname}/users/current/alerts`,
      restAPIBaseURL
    ),
    currentUserSavedSearchesURL: new URL(
      `${restAPIBaseURL.pathname}/users/current/savedsearches`,
      restAPIBaseURL
    ),
    getAutocompleteAdvancedFieldsURL: new URL(
      `${datafariBaseURL.pathname}/GetAutocompleteAdvancedFields`,
      datafariBaseURL
    ),
    getFixedValuesAdvancedFieldsURL: new URL(
      `${datafariBaseURL.pathname}/GetFixedValuesAdvancedFields`,
      datafariBaseURL
    ),
    getLabeledAdvancedFieldsURL: new URL(
      `${datafariBaseURL.pathname}/GetLabeledAdvancedFields`,
      datafariBaseURL
    ),
    getFieldsInfoURL: new URL(
      `${datafariBaseURL.pathname}/GetFieldsInfo`,
      datafariBaseURL
    ),
    getExactFieldsURL: new URL(
      `${datafariBaseURL.pathname}/GetExactFields`,
      datafariBaseURL
    ),
    getFavoritesURL: new URL(
      `${datafariBaseURL.pathname}/GetFavorites`,
      datafariBaseURL
    ),
    addFavoriteURL: new URL(
      `${datafariBaseURL.pathname}/addFavorite`,
      datafariBaseURL
    ),
    deleteFavoriteURL: new URL(
      `${datafariBaseURL.pathname}/deleteFavorite`,
      datafariBaseURL
    ),
    docRedirectURL: new URL(`${datafariBaseURL.pathname}/URL`, datafariBaseURL),
    getHelpURL: new URL(
      `${datafariBaseURL.pathname}/resources/helpAssets/helpContent.jsp`,
      datafariBaseURL
    ),
    getPrivacyPolicyURL: new URL(
      `${datafariBaseURL.pathname}/resources/privacyPolicyAssets/privacyPolicyContent.jsp`,
      datafariBaseURL
    ),
    getEmailsAdminURL: new URL(
      `${restAPIBaseURL.pathname}/emails/admin`,
      restAPIBaseURL
    ),
  });
  return (
    <APIEndpointsContext.Provider value={value}>
      {props.children}
    </APIEndpointsContext.Provider>
  );
};

export default APIEndpointsContextProvider;
