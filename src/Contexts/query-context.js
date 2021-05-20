import React, { useCallback, useReducer } from 'react';
import produce from 'immer';

export const REGISTER_FIELD_FACET = 'REGISTER_FIELD_FACET';
export const SET_FIELD_FACET_SELECTED = 'SET_FIELD_FACET_SELECTED';
export const REGISTER_QUERY_FACET = 'REGISTER_QUERY_FACET';
export const SET_QUERY_FACET_SELECTED = 'SET_QUERY_FACET_SELECTED';
export const SET_ROWS = 'SET_ROWS';
export const SET_PAGE = 'SET_PAGE';
export const SET_ELEMENTS = 'SET_ELEMENTS';
export const SET_SORT = 'SET_SORT';
export const SET_FILTERS = 'SET_FILTERS';
export const REGISTER_FILTER = 'REGISTER_FILTER';
export const UNREGISTER_FILTER = 'UNREGISTER_FILTER';
export const SET_ELEMENTS_NO_RESET = 'SET_ELEMENTS_NO_RESET';
export const SET_QUERY = 'SET_QUERY';
export const FILL_FROM_URL_PARAMS = 'FILL_FROM_URL_PARAMS';
export const SET_OP = 'SET_OP';

const resetFacetSelection = (fieldFacets, queryFacets) => {
  const newFieldFacets = { ...fieldFacets };
  for (const key in newFieldFacets) {
    newFieldFacets[key] = { ...fieldFacets[key] };
    newFieldFacets[key].selected = null;
    delete newFieldFacets[key].selected;
  }
  const newQueryFacets = { ...queryFacets };
  for (const key in newQueryFacets) {
    newQueryFacets[key] = { ...queryFacets[key] };
    newQueryFacets[key].selected = null;
    delete newQueryFacets[key].selected;
  }
  return [newFieldFacets, newQueryFacets];
};

const defaultQuery = {
  fieldFacets: {},
  selectedFieldFacets: {},
  queryFacets: {},
  selectedQueryFacets: {},
  filters: {},
  elements: '',
  rows: 10,
  page: 1,
  op: 'AND',
  sort: { label: 'Relevance', value: 'score desc' },
};

const newQueryReducer = produce((queryDraft, action) => {
  switch (action.type) {
    case SET_ELEMENTS:
      queryDraft.page = 1;
      queryDraft.elements = action.elements ? action.elements : '';
      queryDraft.selectedQueryFacets = {};
      queryDraft.selectedFieldFacets = {};
      queryDraft.filters = {};
      queryDraft.spellcheckOriginalQuery = action.spellcheckOriginalQuery
        ? action.spellcheckOriginalQuery
        : undefined;
      break;
    case SET_ELEMENTS_NO_RESET:
      queryDraft.page = 1;
      queryDraft.elements = action.elements ? action.elements : '';
      break;
    case SET_PAGE:
      if (
        action.page &&
        typeof action.page === 'number' &&
        isFinite(action.page) &&
        Math.floor(action.page) === action.page
      ) {
        queryDraft.page = action.page;
      }
      break;
    case SET_ROWS:
      if (
        action.rows &&
        typeof action.rows === 'number' &&
        isFinite(action.rows) &&
        Math.floor(action.rows) === action.rows
      ) {
        queryDraft.page = 1;
        queryDraft.rows = action.rows;
      }
      break;
    case SET_SORT:
      if (action.sort && action.sort.label && action.sort.value) {
        queryDraft.sort = action.sort;
      }
      break;
    case REGISTER_FIELD_FACET:
      const candidateFieldFacet = action.fieldFacet;
      if (
        candidateFieldFacet &&
        candidateFieldFacet.id &&
        candidateFieldFacet.field &&
        candidateFieldFacet.tag &&
        candidateFieldFacet.op &&
        candidateFieldFacet.title
      ) {
        if (!queryDraft.fieldFacets[candidateFieldFacet.id]) {
          // No field facet with this id exist, lets create it
          queryDraft.fieldFacets[candidateFieldFacet.id] = {
            field: candidateFieldFacet.field,
            tag: candidateFieldFacet.tag,
            op: candidateFieldFacet.op,
            title: candidateFieldFacet.title,
          };
        }
        // If a field facet with the same id exists it won't be replaced
        // It may be intentional (two visualization of the same facet) but
        // can also come from an error (not changing the id when defining a
        // new facet).
      }
      break;
    case REGISTER_QUERY_FACET:
      const candidateQueryFacet = action.queryFacet;
      if (
        candidateQueryFacet &&
        candidateQueryFacet.id &&
        candidateQueryFacet.labels &&
        candidateQueryFacet.queries &&
        candidateQueryFacet.title
      ) {
        if (!queryDraft.queryFacets[candidateQueryFacet.id]) {
          // No query facet with this id exist, lets create it
          queryDraft.queryFacets[candidateQueryFacet.id] = {
            labels: candidateQueryFacet.labels,
            queries: candidateQueryFacet.queries,
            title: candidateQueryFacet.title,
          };
        }
        // If a query facet with the same id exists it won't be replaced
        // It may be intentional (two visualization of the same facet) but
        // can also come from an error (not changing the id when defining a
        // new facet).
      }
      break;
    case SET_FIELD_FACET_SELECTED:
      if (action.facetId && action.selected) {
        queryDraft.selectedFieldFacets[action.facetId] = action.selected;
      }
      break;
    case SET_QUERY_FACET_SELECTED:
      if (action.facetId && action.selected) {
        queryDraft.selectedQueryFacets[action.facetId] = action.selected;
      }
      break;
    case REGISTER_FILTER:
      if (action.filter && action.filter.id && action.filter.value) {
        if (!queryDraft.filters[action.filter.id]) {
          // No filter with this id, we can add it
          queryDraft.filters[action.filter.id] = {
            value: action.filter.value,
            extra: action.filter.extra,
          };
          // If a filter with the same id already exists we do nothing
        }
      }
      break;
    case UNREGISTER_FILTER:
      if (action.id && queryDraft.filters[action.id]) {
        // Delete the existing filter with the provided id
        delete queryDraft.filters[action.id];
      }
      // If no filter with the id exists, just do nothing
      break;
    case SET_OP:
      if (action.op === 'OR' || action.op === 'AND') {
        queryDraft.op = action.op;
      }
      break;
    case FILL_FROM_URL_PARAMS:
      const urlParams = action.params;
      const currentRegisteredFacets = {
        queryFacets: queryDraft.queryFacets,
        fieldFacets: queryDraft.fieldFacets,
      };
      // We base on the default query
      // We Keep field facets and query facets registration from current query as they should not change
      // and override data with anything that is present in urlParams (urlParams has precedence over everything)
      // TODO: Prone to injection of data from the URL, consider limiting the keys that are copied instead.
      // Note that a producer can return a new object provided it did not modify the draft which is the case here.
      return {
        ...defaultQuery,
        ...currentRegisteredFacets,
        ...urlParams,
      };
    default:
      // Nothing to do, query should remain unchanged
      break;
  }
});

// const queryReducer = (query, action) => {
//   const [newFieldFacets, newQueryFacets] = resetFacetSelection(
//     query.fieldFacets,
//     query.queryFacets
//   );
//   switch (action.type) {
//     case SET_FIELD_FACETS:
//       return produce(query, (queryDraft) => {
//         queryDraft.page = 1;
//         queryDraft.fieldFacets = produce(action.fieldFacets, (draft) => {});
//       });
//     case SET_QUERY_FACETS:
//       return produce(query, (queryDraft) => {
//         queryDraft.page = 1;
//         queryDraft.queryFacets = produce(action.queryFacets, (draft) => {});
//       });
//     case SET_ROWS:
//       return produce(query, (queryDraft) => {
//         queryDraft.page = 1;
//         queryDraft.rows = action.row;
//       });
//     case SET_PAGE:
//       return produce(query, (queryDraft) => {
//         queryDraft.page = action.page;
//       });
//     case SET_ELEMENTS:
//       return produce(query, (queryDraft) => {
//         queryDraft.page = 1;
//         queryDraft.elements = action.elements;
//         queryDraft.queryFacets = newQueryFacets;
//         queryDraft.fieldFacets = newFieldFacets;
//         queryDraft.filters = {};
//         queryDraft.spellcheckOriginalQuery = action.spellcheckOriginalQuery
//           ? action.spellcheckOriginalQuery
//           : undefined;
//       });
//     case SET_ELEMENTS_NO_RESET:
//       return produce(query, (queryDraft) => {
//         queryDraft.page = 1;
//         queryDraft.elements = action.elements;
//       });
//     case SET_SORT:
//       return produce(query, (queryDraft) => {
//         queryDraft.sort = produce(action.sort, (draft) => {});
//       });
//     case RESET_FACETS_SELECTION:
//       return produce(query, (queryDraft) => {
//         queryDraft.queryFacets = newQueryFacets;
//         queryDraft.fieldFacets = newFieldFacets;
//         queryDraft.filters = {};
//       });
//     case SET_FILTERS:
//       return produce(query, (queryDraft) => {
//         queryDraft.page = 1;
//         queryDraft.filters = action.filters;
//       });
//     case SET_QUERY:
//       return produce(action.query, (draft) => {});
//     default:
//       return produce(query, (queryDraft) => {});
//   }
// };
/*
 {
   fieldFacets: {
     extension: {
       field: 'extension',
       tag: 'extention',
       selected: ['pdf', 'doc'],
       op: 'OR',
     }
   },
   queryFacets: {
     date: {
       labels: ['Less than a month', 'Less than a year'],
       queries: ['last_modified:[NOW-1MONTH TO NOW]', 'last_modified:[NOW-1YEAR TO NOW]'],
       op: 'OR',
       selected: ['Less than a month'],
     }
   }
   elements: "some query here",
   rows: 10,
   page: 1,
 }
 */

export const QueryContext = React.createContext({
  query: defaultQuery,
  dispatch: () => {},
  buildSearchQueryString: () => {},
  prepareFiltersForAlerts: () => {},
  buildSavedSearchQuery: () => {},
  runQueryFromSavedSearch: () => {},
  buildParamsForURL: () => {},
});

const QueryContextProvider = (props) => {
  // const [query, queryDispatcher] = useReducer(queryReducer, {
  //   fieldFacets: {},
  //   queryFacets: {},
  //   filters: {},
  //   elements: '',
  //   rows: 10,
  //   page: 1,
  //   op: 'AND',
  //   sort: { label: 'Relevance', value: 'score desc' },
  // });

  const [query, queryDispatcher] = useReducer(newQueryReducer, defaultQuery);

  const buildQueryStringFromParams = useCallback((queryParams) => {
    let result = '';
    for (const key in queryParams) {
      if (result !== '') {
        result += '&';
      }
      switch (key) {
        case 'facet.query':
        case 'facet.field':
        case 'fq':
          let currentParamString = queryParams[key].reduce(
            (accu, element, index, array) => {
              let next = accu + key + '=' + encodeURIComponent(element);
              if (index < array.length - 1) {
                next += '&';
              }
              return next;
            },
            ''
          );
          result += currentParamString;
          break;
        default:
          result += key + '=' + encodeURIComponent(queryParams[key]);
      }
    }
    return result;
  }, []);

  const buildSavedQueryStringFromParams = useCallback((queryParams) => {
    let result = '';
    for (const key in queryParams) {
      if (result !== '') {
        result += '&';
      }
      switch (key) {
        case 'facet.query':
        case 'facet.field':
        case 'fq':
          let currentParamString = queryParams[key].reduce(
            (accu, element, index, array) => {
              let next = accu + key + '=' + element;
              if (index < array.length - 1) {
                next += '&';
              }
              return next;
            },
            ''
          );
          result += currentParamString;
          break;
        default:
          result += key + '=' + queryParams[key];
      }
    }
    return result;
  }, []);

  const prepareFieldFacets = useCallback(() => {
    const fieldFacetsParams = [];
    const selectedFieldFacets = [];
    for (const key in query.fieldFacets) {
      fieldFacetsParams.push(
        `{!ex=${query.fieldFacets[key].tag}}${query.fieldFacets[key].field}`
      );
      if (
        query.fieldFacets[key].selected &&
        query.fieldFacets[key].selected.length > 0
      ) {
        selectedFieldFacets.push(
          query.fieldFacets[key].selected.reduce(
            (accu, element, index, array) => {
              let next = accu + `${query.fieldFacets[key].field}:${element}`;
              if (index < array.length - 1) {
                next += ` ${query.fieldFacets[key].op} `;
              } else {
                next += ')';
              }
              return next;
            },
            `{!tag=${query.fieldFacets[key].tag}}(`
          )
        );
      }
    }
    return [fieldFacetsParams, selectedFieldFacets];
  }, [query.fieldFacets]);

  const prepareFieldFacetsForAlerts = useCallback(() => {
    const selectedFieldFacets = [];
    for (const key in query.fieldFacets) {
      if (
        query.fieldFacets[key].selected &&
        query.fieldFacets[key].selected.length > 0
      ) {
        selectedFieldFacets.push(
          query.fieldFacets[key].selected.reduce(
            (accu, element, index, array) => {
              let next = accu + `${query.fieldFacets[key].field}:${element}`;
              if (index < array.length - 1) {
                next += ` ${query.fieldFacets[key].op} `;
              } else {
                next += ')';
              }
              return next;
            },
            `(`
          )
        );
      }
    }
    return selectedFieldFacets;
  }, [query.fieldFacets]);

  const prepareQueryFacets = useCallback(() => {
    let queryFacetsParams = [];
    let selectedQueryFacets = [];
    for (const key in query.queryFacets) {
      if (
        query.queryFacets[key].queries &&
        query.queryFacets[key].labels &&
        query.queryFacets[key].queries.length ===
          query.queryFacets[key].labels.length
      ) {
        const currentQueryFacetParams = query.queryFacets[key].queries.map(
          (query, index) => {
            return `{!key=${key}_${index}}${query}`;
          }
        );
        queryFacetsParams = queryFacetsParams.concat(currentQueryFacetParams);
        if (
          query.queryFacets[key].selected &&
          query.queryFacets[key].selected.length > 0
        ) {
          const currentSelectedQueries = query.queryFacets[key].selected
            .filter(
              (label) => query.queryFacets[key].labels.indexOf(label) !== -1
            )
            .map((label) => {
              const index = query.queryFacets[key].labels.indexOf(label);
              return `{!tag=${key}_${index}}${query.queryFacets[key].queries[index]}`;
            });
          selectedQueryFacets = selectedQueryFacets.concat(
            currentSelectedQueries
          );
        }
      }
    }
    return [queryFacetsParams, selectedQueryFacets];
  }, [query.queryFacets]);

  const prepareQueryFacetsForAlerts = useCallback(() => {
    let selectedQueryFacets = [];
    for (const key in query.queryFacets) {
      if (
        query.queryFacets[key].queries &&
        query.queryFacets[key].labels &&
        query.queryFacets[key].queries.length ===
          query.queryFacets[key].labels.length
      ) {
        if (
          query.queryFacets[key].selected &&
          query.queryFacets[key].selected.length > 0
        ) {
          const currentSelectedQueries = query.queryFacets[key].selected
            .filter(
              (label) => query.queryFacets[key].labels.indexOf(label) !== -1
            )
            .map((label) => {
              const index = query.queryFacets[key].labels.indexOf(label);
              return `{!tag=${key}_${index}}${query.queryFacets[key].queries[index]}`;
            });
          selectedQueryFacets = selectedQueryFacets.concat(
            currentSelectedQueries
          );
        }
      }
    }
    return selectedQueryFacets;
  }, [query.queryFacets]);

  const prepareOtherFilters = useCallback(() => {
    let otherFilters = [];
    for (const key in query.filters) {
      if (query.filters[key].value) {
        otherFilters.push(query.filters[key].value);
      }
    }
    return otherFilters;
  }, [query.filters]);

  const prepareFacetsParams = useCallback(() => {
    const facetParams = {};

    // Field facets gathering
    const [fieldFacetsParams, selectedFieldFacets] = prepareFieldFacets();
    if (fieldFacetsParams.length > 0) {
      facetParams.facet = true;
      facetParams['facet.field'] = fieldFacetsParams;
      if (selectedFieldFacets.length > 0) {
        facetParams.fq = selectedFieldFacets;
      }
    }

    // Query facets gathering
    const [queryFacetsParams, selectedQueryFacets] = prepareQueryFacets();
    if (queryFacetsParams.length > 0) {
      facetParams.facet = true;
      facetParams['facet.query'] = queryFacetsParams;
      if (selectedQueryFacets.length > 0) {
        if (facetParams.fq) {
          facetParams.fq = facetParams.fq.concat(selectedQueryFacets);
        } else {
          facetParams.fq = selectedQueryFacets;
        }
      }
    }

    // Other filters gathering
    const otherFilters = prepareOtherFilters();
    if (otherFilters.length > 0) {
      if (facetParams.fq) {
        facetParams.fq = facetParams.fq.concat(otherFilters);
      } else {
        facetParams.fq = otherFilters;
      }
    }

    return facetParams;
  }, [prepareFieldFacets, prepareQueryFacets, prepareOtherFilters]);

  const buildSearchQueryString = useCallback(() => {
    const facetsParams = prepareFacetsParams();
    const queryParameters = {
      q: query.elements,
      // .map((element) => element.text.trim())
      // .join(' ')
      // .trim(),
      fl: [
        'title',
        'url',
        'id',
        'extension',
        'preview_content',
        'last_modified',
        'crawl_date',
        'author',
        'original_file_size',
        'emptied',
        'repo_source',
      ].join(','),
      sort: query.sort.value,
      'q.op': 'AND',
      rows: query.rows,
      start: (query.page - 1) * query.rows,
      ...facetsParams,
    };
    if (queryParameters.q === '') {
      queryParameters.q = '*:*';
    }

    return buildQueryStringFromParams(queryParameters);
  }, [
    buildQueryStringFromParams,
    prepareFacetsParams,
    query.elements,
    query.page,
    query.rows,
    query.sort.value,
  ]);

  const prepareFiltersForAlerts = useCallback(() => {
    const facetsParams = prepareFacetsParams();
    if (facetsParams.fq) {
      const fieldFacets = prepareFieldFacetsForAlerts();
      const queryFacets = prepareQueryFacetsForAlerts();
      let result = '';
      if (fieldFacets.length > 0) {
        result = fieldFacets.join('&');
      }
      if (queryFacets.length > 0) {
        result = `${result}&${queryFacets.join('&')}`;
      }
      return result;
    } else {
      return '';
    }
  }, [
    prepareFacetsParams,
    prepareFieldFacetsForAlerts,
    prepareQueryFacetsForAlerts,
  ]);

  const buildSavedSearchQuery = useCallback(() => {
    const facetsParams = prepareFacetsParams();
    const fq = facetsParams.fq ? { fq: facetsParams.fq } : {};
    const queryParameters = {
      q: query.elements,
      ...fq,
    };
    if (queryParameters.q === '') {
      queryParameters.q = '*:*';
    }

    return buildSavedQueryStringFromParams(queryParameters);
  }, [buildSavedQueryStringFromParams, prepareFacetsParams, query.elements]);

  const runQueryFromSavedSearch = useCallback(
    (savedSearchQuery) => {
      let params = new URLSearchParams(savedSearchQuery);
      const newQuery = produce(query, (draft) => {
        const [newFieldFacets, newQueryFacets] = resetFacetSelection(
          draft.fieldFacets,
          draft.queryFacets
        );
        draft.filters = {};
        // regexfq matches fqs from datafariUI and fqs for query facets from
        // the legacy UI.
        // eslint-disable-next-line no-useless-escape
        const regexfq = /\{!tag=([\w]+)\}\(?([^&\(\)]+)\)?/g;
        // regexQueryFacet matches on tags for query facets from datafariUI
        const regexQueryFacet = /([\w]+)_([\d]+)/g;
        // regexFieldFacet matches on field facets of datafariUI and fqs representing
        // field facets from the legacy UI.
        const regexFieldFacet = /\(?([^:\s]+):("[^"]+"|[^\s]+)\s?\)?/g;

        const fqs = params.getAll('fq');
        if (fqs && fqs.length > 0) {
          fqs.forEach((element, index) => {
            const regexResults = regexfq.exec(element);
            // If we match the fq regex, datafariUI fq or legacyUI query facet fq
            if (regexResults !== null) {
              const tag = regexResults[1];
              const filterInfo = regexResults[2];
              if (newFieldFacets[tag]) {
                // It is a field facet from datafariui as the tag matches
                let fieldFacetResult = regexFieldFacet.exec(filterInfo);
                if (
                  newFieldFacets[tag].selected === null ||
                  newFieldFacets[tag].selected === undefined
                ) {
                  newFieldFacets[tag].selected = [];
                }
                while (fieldFacetResult) {
                  newFieldFacets[tag].selected = newFieldFacets[
                    tag
                  ].selected.concat(fieldFacetResult[2]);
                  fieldFacetResult = regexFieldFacet.exec(filterInfo);
                }
              } else {
                // Check if it is a query facet from datafariUI
                const regexQueryFacetResults = regexQueryFacet.exec(tag);
                if (
                  regexQueryFacetResults !== null &&
                  newQueryFacets[regexQueryFacetResults[1]]
                ) {
                  // It is a query facet
                  const facetName = regexQueryFacetResults[1];
                  const selectedIndex = regexQueryFacetResults[2];
                  if (newQueryFacets[facetName].labels[selectedIndex]) {
                    if (
                      newQueryFacets[facetName].selected === null ||
                      newQueryFacets[facetName].selected === undefined
                    ) {
                      newQueryFacets[facetName].selected = [];
                    }
                    // It is correctly defined and references an existing query lets use it
                    newQueryFacets[facetName].selected = newQueryFacets[
                      facetName
                    ].selected.concat(
                      newQueryFacets[facetName].labels[selectedIndex]
                    );
                  } else {
                    // index out of range, put it in other filters
                    draft.filters[`${facetName}_${index}`] = {
                      value: element,
                    };
                  }
                } else {
                  // Neither a field facet or a query facet currectly declared in datafariUI
                  // despite matching the fq regexp, put it in other filters
                  // Might be a query facet from the legacy datafariUI or a facet that has been
                  // modified since the query was saved.
                  draft.filters[`${tag}_${index}`] = {
                    value: element,
                  };
                }
              }
            } else {
              // does not match the fq regexp, another fq, put in other filters
              // might be a legacy datafari field facet, check if we can recover
              // information from that, else put it in other filters.
              let regexFieldFacetResult = regexFieldFacet.exec(element);
              if (regexFieldFacetResult) {
                const field = regexFieldFacetResult[1];
                if (newFieldFacets[field]) {
                  if (
                    newFieldFacets[field].selected === null ||
                    newFieldFacets[field].selected === undefined
                  ) {
                    newFieldFacets[field].selected = [];
                  }
                  while (regexFieldFacetResult) {
                    let value = regexFieldFacetResult[2];
                    if (value[0] === '"' && value[value.length - 1] === '"') {
                      value = value.substring(1, value.length - 1);
                    }
                    newFieldFacets[field].selected =
                      newFieldFacets[field].selected.concat(value);
                    regexFieldFacetResult = regexFieldFacet.exec(element);
                  }
                }
              } else {
                draft.filters[`undefined_${index}`] = {
                  value: element,
                };
              }
            }
          });
        }
        draft.page = 1;
        if (params.get('q') === '*:*') {
          draft.elements = '';
        } else {
          draft.elements = params.get('q');
        }
        draft.fieldFacets = newFieldFacets;
        draft.queryFacets = newQueryFacets;
      });
      queryDispatcher({ type: SET_QUERY, query: newQuery });
    },
    [query]
  );

  const isEmptyObj = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const buildParamsForURL = () => {
    return produce(query, (draft) => {
      // Registered field and query facets should never come from the URL
      delete draft.fieldFacets;
      delete draft.queryFacets;
      // Delete anything that is null or identical to the default object
      if (!draft.selectedFieldFacets || isEmptyObj(draft.selectedFieldFacets)) {
        delete draft.selectedFieldFacets;
      }
      if (!draft.selectedQueryFacets || isEmptyObj(draft.selectedQueryFacets)) {
        delete draft.selectedQueryFacets;
      }
      if (!draft.filters || isEmptyObj(draft.filters)) {
        delete draft.filters;
      }
      if (!draft.elements || draft.elements === defaultQuery.elements) {
        delete draft.elements;
      }
      if (!draft.page || draft.page === defaultQuery.page) {
        delete draft.page;
      }
      if (!draft.rows || draft.rows === defaultQuery.rows) {
        delete draft.rows;
      }
      if (!draft.op || draft.op === defaultQuery.op) {
        delete draft.op;
      }
      if (
        !draft.sort ||
        (draft.sort.label === 'Relevance' && draft.sort.value === 'score desc')
      ) {
        delete draft.sort;
      }
    });
  };

  return (
    <QueryContext.Provider
      value={{
        query: query,
        dispatch: queryDispatcher,
        buildSearchQueryString: buildSearchQueryString,
        prepareFiltersForAlerts: prepareFiltersForAlerts,
        buildSavedSearchQuery: buildSavedSearchQuery,
        runQueryFromSavedSearch: runQueryFromSavedSearch,
        buildParamsForURL: buildParamsForURL,
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};

export default QueryContextProvider;
