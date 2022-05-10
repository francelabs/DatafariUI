import React, { useState } from 'react';

// Used for context creation, defines all the properties that will
// be filled below in the provider.
const DEFAULT_ENDPOINTS = {
  datafariBaseURL: '',
  restAPIBaseURL: '',
  authURL: '',
  adminURL: '',
  currentUserURL: '',
  currentUserAlertsURL: '',
  currentUserFavoritesURL: '',
  currentUserSavedSearchesURL: '',
  searchURL: '',
  getAutocompleteAdvancedFieldsURL: '',
  getFixedValuesAdvancedFieldsURL: '',
  getLabeledAdvancedFieldsURL: '',
  getFieldsInfoURL: '',
  getExactFieldsURL: '',
  favoritesStatusURL: '',
  docRedirectURL: '',
  getHelpURL: '',
  getPrivacyPolicyURL: '',
  getEmailsAdminURL: '',
  licenceURL: '',
  logoutURL: '',
  getUIDefinitionURL: '',
  getThemeURL: '',
  getAggregatorURL: '',
};

export const APIEndpointsContext = React.createContext(DEFAULT_ENDPOINTS);

// Context defining the URL to all the API endpoints.
// The base Datafari URL is read from the window.datafariBaseURL
// variable and all other URLs are parametrized from this base.
const APIEndpointsContextProvider = (props) => {
  // Getting rid of the last forward slash if it is there.
  const [datafariBaseURL] = useState(
    window.datafariBaseURL.pathname[window.datafariBaseURL.pathname.length - 1] === '/'
      ? new URL(
          window.datafariBaseURL.pathname.substring(0, window.datafariBaseURL.pathname.lenth - 1),
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
    currentUserURL: new URL(`${restAPIBaseURL.pathname}/users/current`, restAPIBaseURL),
    searchURL: new URL(`${restAPIBaseURL.pathname}/search`, restAPIBaseURL),
    currentUserFavoritesURL: new URL(
      `${restAPIBaseURL.pathname}/users/current/favorites`,
      restAPIBaseURL
    ),
    currentUserAlertsURL: new URL(
      `${restAPIBaseURL.pathname}/users/current/alerts`,
      restAPIBaseURL
    ),
    currentUserSavedSearchesURL: new URL(
      `${restAPIBaseURL.pathname}/users/current/savedsearches`,
      restAPIBaseURL
    ),
    getAutocompleteAdvancedFieldsURL: new URL(
      `${restAPIBaseURL.pathname}/fields/autocomplete`,
      restAPIBaseURL
    ),
    getFixedValuesAdvancedFieldsURL: new URL(
      `${restAPIBaseURL.pathname}/fields/fixedvalues`,
      restAPIBaseURL
    ),
    getLabeledAdvancedFieldsURL: new URL(`${restAPIBaseURL.pathname}/fields/label`, restAPIBaseURL),
    getFieldsInfoURL: new URL(`${restAPIBaseURL.pathname}/fields/info`, restAPIBaseURL),
    getExactFieldsURL: new URL(`${restAPIBaseURL.pathname}/fields/exact`, restAPIBaseURL),
    favoritesStatusURL: new URL(
      `${restAPIBaseURL.pathname}/status/features/favorites`,
      datafariBaseURL
    ),
    docRedirectURL: new URL(`${datafariBaseURL.pathname}/URL`, datafariBaseURL),
    getHelpURL: new URL(`${restAPIBaseURL.pathname}/help`, restAPIBaseURL),
    getPrivacyPolicyURL: new URL(`${restAPIBaseURL.pathname}/privacy`, restAPIBaseURL),
    getEmailsAdminURL: new URL(`${restAPIBaseURL.pathname}/emails/admin`, restAPIBaseURL),
    licenceURL: new URL(`${restAPIBaseURL.pathname}/licence`, restAPIBaseURL),
    logoutURL: new URL(`${datafariBaseURL.pathname}/logout`, datafariBaseURL),
    getUIDefinitionURL: new URL(`${process.env.PUBLIC_URL}/ui-config.json`, window.location.href),
    getThemeURL: new URL(`${process.env.PUBLIC_URL}/theme.json`, window.location.href),
    getAggregatorURL: new URL(`${restAPIBaseURL.pathname}/aggregator`, restAPIBaseURL),
  });
  return (
    <APIEndpointsContext.Provider value={value}>{props.children}</APIEndpointsContext.Provider>
  );
};

export default APIEndpointsContextProvider;
