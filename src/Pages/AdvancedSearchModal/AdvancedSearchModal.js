import React, { useState, useContext, useCallback, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Button,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  DialogActions,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Container,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import {
  QueryContext,
  SET_ELEMENTS_NO_RESET,
} from '../../Contexts/query-context';
import useHttp from '../../Hooks/useHttp';
import AdvancedSearchTextField from './AdvancedSearchTextField';
import AdvancedSearchDateField from './AdvancedSearchDateField';
import AdvancedSearchNumField from './AdvancedSearchNumField';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';

const OPERATOR = 'OPERATOR';
const FIELD = 'FIELD';
const VALUES = 'VALUES';
const REMOVE = 'REMOVE';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  advancedSearchField: {
    marginBottom: theme.spacing(2),
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  addFieldContainer: {
    marginTop: theme.spacing(1),
  },
  addFieldCaption: {
    marginLeft: theme.spacing(1),
  },
}));

const AdvancedSearchModal = (props) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { t } = useTranslation();
  const classes = useStyles();
  const [additionalFields, setAdditionalFields] = useState(undefined);
  const [availableFields, setAvailableFields] = useState(undefined);
  const [exactFieldsList, setExactFieldsList] = useState(undefined);
  const [autocompleteFields, setAutocompleteFields] = useState(undefined);
  const [fixedValuesFields, setFixedValuesFields] = useState(undefined);
  const [mappingFieldNameValues, setMappingFieldNameValues] = useState(
    undefined
  );
  const [baseSearch, setBaseSearch] = useState({
    all_words_value: undefined,
    exact_expression_value: undefined,
    at_least_one_word_value: undefined,
    none_of_these_words_value: undefined,
  });
  const { isLoading, error, data, sendRequest, reqIdentifier } = useHttp();

  const isEmptyObject = useCallback((obj) => {
    try {
      return Object.getOwnPropertyNames(obj).length === 0;
    } catch {
      return false;
    }
  }, []);

  const extractFilterFromText = useCallback(
    (text, negativeExpression, isBasicSearchText) => {
      let all_words_value = '';
      let exact_expression_value = '';
      let at_least_one_word_value = '';
      let none_of_these_words_value = '';

      // Regex that will match every 'AND expression' (ie [word] AND [word])
      const andExpressionRegex = /[^\s\[\(\]\)\-\"(AND|OR)]+\sAND\s[^\s\[\(\]\)\-\"(AND|OR)]+/g;
      // Regex that will match every 'OR expression' (ie [word] OR [word])
      const orExpressionRegex = /[^\s\[\(\]\)\-\"(AND|OR)]+\sOR\s[^\s\[\(\]\)\-\"(AND|OR)]+/g;

      // Regex that will match any remaining 'AND [word]'
      const cleanANDRegex = /(AND\s(?:(?![^\s\[\(]+AND)[^\s\[\(]+)\s?|[^\s\[\(]+\sAND)/g;
      // Regex that will match any remaining 'OR [word]'
      const cleanORRegex = /(OR\s(?:(?![^\s\[\(]+OR)[^\s\[\(]+)\s?|[^\s\[\(]+\sOR)/g;

      if (!text.startsWith('(') && !isBasicSearchText) {
        // The filter value is a direct value, no needs to apply complex treatment
        // to extract multiple filters

        if (negativeExpression) {
          none_of_these_words_value = text;
        } else {
          if (text.startsWith('"')) {
            exact_expression_value = text.substring(1, text.length - 1);
          } else {
            all_words_value = text;
          }
        }
      } else {
        // Remove the parentheses '()' that surround the expression
        if (!isBasicSearchText) {
          text = text.substring(1, text.length - 1);
        }

        // Try to extract negative exact expression (ie -"france labs")
        const exactNegativeExpressionRegex = /-"[^"]*"/g;
        const exactNegativeExpressions = text.match(
          exactNegativeExpressionRegex
        );
        if (
          exactNegativeExpressions != null &&
          exactNegativeExpressions !== undefined
        ) {
          for (
            let cptNgtExact = 0;
            cptNgtExact < exactNegativeExpressions.length;
            cptNgtExact++
          ) {
            const exactNegativeExpression =
              exactNegativeExpressions[cptNgtExact];
            none_of_these_words_value +=
              ' ' + exactNegativeExpression.substring(1);
            const exactNgtExprIndex = text.search(exactNegativeExpression);
            // If there is a space in front of the exact expression then remove it
            // + the exact expression, otherwise only remove the exact expression
            if (
              exactNgtExprIndex > 0 &&
              text.substring(exactNgtExprIndex - 1, exactNgtExprIndex) === ' '
            ) {
              text = text.replace(' ' + exactNegativeExpression, '');
            } else {
              text = text.replace(exactNegativeExpression, '');
            }
          }
        }

        // Try to extract negative words (ie -nuclear)
        const globalValues = text.split(' ');
        for (let cptGlobal = 0; cptGlobal < globalValues.length; cptGlobal++) {
          const gbValue = globalValues[cptGlobal];
          if (gbValue.startsWith('-')) {
            none_of_these_words_value += ' ' + gbValue.substring(1);
            // If there is a space in front of the negative word then remove it +
            // the negative word, otherwise only remove the negative word
            if (text.search(gbValue) > 0) {
              text = text.replace(' ' + gbValue, '');
            } else {
              text = text.replace(gbValue, '');
            }
          }
        }

        // Try to extract the exact expressions (ie "renew energy")
        const exactExpressionsRegex = /"[^\"]+"/g;
        const exactExpressions = text.match(exactExpressionsRegex);
        if (exactExpressions != null && exactExpressions !== undefined) {
          for (
            let cptExact = 0;
            cptExact < exactExpressions.length;
            cptExact++
          ) {
            const exactExpression = exactExpressions[cptExact];
            exact_expression_value +=
              ' ' + exactExpression.substring(1, exactExpression.length - 1);
            const exactExprIndex = text.search(exactExpression);
            // If there is a space in front of the exact expression then remove it
            // + the exact expression, otherwise only remove the exact expression
            if (
              exactExprIndex > 0 &&
              text.substring(exactExprIndex - 1, exactExprIndex) === ' '
            ) {
              text = text.replace(' ' + exactExpression, '');
            } else {
              text = text.replace(exactExpression, '');
            }
          }
        }

        // Extract OR expressions
        let tempFieldExpression = text; // initialize a temp variable because at
        // the end of this OR expression
        // extraction,
        // the original text variable must stay untouched for the AND regex to
        // work
        while (tempFieldExpression.match(orExpressionRegex) != null) {
          const orExpressions = tempFieldExpression.match(orExpressionRegex);
          if (orExpressions != null) {
            for (let cptExpr = 0; cptExpr < orExpressions.length; cptExpr++) {
              const exprValues = orExpressions[cptExpr].split(' ');
              if (at_least_one_word_value.indexOf(exprValues[0]) === -1) {
                at_least_one_word_value += ' ' + exprValues[0];
              }
              if (at_least_one_word_value.indexOf(exprValues[2]) === -1) {
                at_least_one_word_value += ' ' + exprValues[2];
              }
              const exprIndex = tempFieldExpression.search(
                exprValues[0] + ' OR'
              );
              if (exprIndex !== -1) {
                if (
                  tempFieldExpression.substring(exprIndex - 1).startsWith(' ')
                ) {
                  tempFieldExpression = tempFieldExpression.replace(
                    ' ' + exprValues[0] + ' OR',
                    'OR'
                  );
                } else {
                  tempFieldExpression = tempFieldExpression.replace(
                    exprValues[0] + ' OR',
                    'OR'
                  );
                }
              }
            }
          }
        }

        // Extract AND expressions
        tempFieldExpression = text; // reinit the temp variable with the text
        // variable which has not been modified by the
        // previous OR expression extraction
        while (tempFieldExpression.match(andExpressionRegex) != null) {
          const andExpressions = tempFieldExpression.match(andExpressionRegex);
          if (andExpressions != null) {
            for (let cptExpr = 0; cptExpr < andExpressions.length; cptExpr++) {
              const exprValues = andExpressions[cptExpr].split(' ');
              if (all_words_value.indexOf(exprValues[0]) === -1) {
                all_words_value += ' ' + exprValues[0];
              }
              if (all_words_value.indexOf(exprValues[2]) === -1) {
                all_words_value += ' ' + exprValues[2];
              }
              const exprIndex = tempFieldExpression.search(
                exprValues[0] + ' AND'
              );
              if (exprIndex !== -1) {
                if (
                  tempFieldExpression.substring(exprIndex - 1).startsWith(' ')
                ) {
                  tempFieldExpression = tempFieldExpression.replace(
                    ' ' + exprValues[0] + ' AND',
                    'AND'
                  );
                } else {
                  tempFieldExpression = tempFieldExpression.replace(
                    exprValues[0] + ' AND',
                    'AND'
                  );
                }
              }
            }
          }
        }

        // -----------------------------------------------------------------------------------------------------------------------------------------
        // NB: the following cleaning process of the OR and AND expression seems
        // weird and ugly but after bunch of tests,
        // it appears that it needs to be done this way, in that specific order to
        // work like a charm !

        // Clean OR expressions
        while (text.match(orExpressionRegex) != null) {
          const orExpressions = text.match(orExpressionRegex);
          if (orExpressions != null) {
            for (let cptExpr = 0; cptExpr < orExpressions.length; cptExpr++) {
              const exprValues = orExpressions[cptExpr].split(' ');
              const exprIndex = text.search(exprValues[0] + ' OR');
              if (exprIndex !== -1) {
                if (text.substring(exprIndex - 1).startsWith(' ')) {
                  text = text.replace(' ' + exprValues[0] + ' OR', 'OR');
                } else {
                  text = text.replace(exprValues[0] + ' OR', 'OR');
                }
              }
            }
          }
        }

        // Clean AND expressions
        while (text.match(andExpressionRegex) != null) {
          const andExpressions = text.match(andExpressionRegex);
          if (andExpressions != null) {
            for (let cptExpr = 0; cptExpr < andExpressions.length; cptExpr++) {
              const exprValues = andExpressions[cptExpr].split(' ');
              const exprIndex = text.search(exprValues[0] + ' AND');
              if (exprIndex !== -1) {
                if (text.substring(exprIndex - 1).startsWith(' ')) {
                  text = text.replace(' ' + exprValues[0] + ' AND', 'AND');
                } else {
                  text = text.replace(exprValues[0] + ' AND', 'AND');
                }
              }
            }
          }
        }

        // Clean remaining alone 'OR' words
        while (text.match(cleanORRegex) != null) {
          const orExprToClean = text.match(cleanORRegex);
          for (
            let cptExprToClean = 0;
            cptExprToClean < orExprToClean.length;
            cptExprToClean++
          ) {
            text = text.replace(orExprToClean[cptExprToClean], '');
          }
        }
        text = text.replace(/OR/g, '');

        // Clean remaining alone 'AND' words
        while (text.match(cleanANDRegex) != null) {
          const andExprToClean = text.match(cleanANDRegex);
          for (
            let cptExprToClean = 0;
            cptExprToClean < andExprToClean.length;
            cptExprToClean++
          ) {
            text = text.replace(andExprToClean[cptExprToClean], '');
          }
        }
        text = text.replace(/AND/g, '');
        // ------------------------------------------------------------------------------------------------------------------
        // Weird cleaning process is over

        // Trim the expression
        text = text.trim();

        // Search for potential remaining words to add them to the all_words_value
        const lastWords = text.split(' ');
        for (
          var cptLastWords = 0;
          cptLastWords < lastWords.length;
          cptLastWords++
        ) {
          all_words_value += ' ' + lastWords[cptLastWords];
        }
      }

      // Trim the final values
      all_words_value = all_words_value.trim();
      exact_expression_value = exact_expression_value.trim();
      at_least_one_word_value = at_least_one_word_value.trim();
      none_of_these_words_value = none_of_these_words_value.trim();

      // Put the values in an object and return it
      const returnValues = {};
      returnValues['all_words_value'] = all_words_value;
      returnValues['exact_expression_value'] = exact_expression_value;
      returnValues['at_least_one_word_value'] = at_least_one_word_value;
      returnValues['none_of_these_words_value'] = none_of_these_words_value;

      return returnValues;
    },
    []
  );

  const determineFieldType = useCallback(
    (fieldName) => {
      const field = availableFields.field.find(
        (field) => field.name === fieldName
      );
      let fieldType = field ? field.type : undefined;
      if (fieldType === 'tdate' || fieldType === 'date') {
        fieldType = 'date';
      } else if (
        fieldType === 'int' ||
        fieldType === 'long' ||
        fieldType === 'float' ||
        fieldType === 'double' ||
        fieldType === 'tint' ||
        fieldType === 'tlong' ||
        fieldType === 'tfloat' ||
        fieldType === 'tdouble'
      ) {
        fieldType = 'num';
      } else {
        fieldType = 'text';
      }
      return fieldType;
    },
    [availableFields]
  );

  const buildStartingAdditionalFields = useCallback(() => {
    const newAdditionalFields = [];

    // Retrieve the last executed query
    let baseQuery = query.elements.slice();

    // Regex that matches field filters in the query (ie any [field]:)
    let baseQueryRegEx = /(AND\s|OR\s)*\(*[^\s\(\[\:]+:/g;
    // Get the index of the first field filter found
    let indexOf = baseQuery.search(baseQueryRegEx);
    let baseSearch = '';
    // Extract the base search which is everything before the index of the first
    // field filter or everything at all if not field filter is found
    if (indexOf !== -1) {
      baseSearch = baseQuery.substring(0, indexOf);
    } else {
      baseSearch = baseQuery;
    }

    // Exact expression baseSearch regex
    let baseExactExprVal = '';
    const baseExactExprRegEx = /\((exactContent|exactTitle):[^)]* OR (exactContent|exactTitle):[^)]*\)/g;
    const baseExactExpr = baseQuery.match(baseExactExprRegEx);
    const exactContentRegEx = /exactContent:(?:(?!( AND | OR ))[^)(])+/g;
    const exactTitleRegEx = /exactTitle:(?:(?!( AND | OR ))[^)(])+/g;
    if (
      baseExactExpr != null &&
      baseExactExpr !== undefined &&
      baseExactExpr !== ''
    ) {
      const exactContentExpr = baseExactExpr[0].match(exactContentRegEx);
      const exactTitleExpr = baseExactExpr[0].match(exactTitleRegEx);

      if (
        exactContentExpr != null &&
        exactContentExpr !== undefined &&
        exactContentExpr !== '' &&
        exactTitleExpr !== null &&
        exactTitleExpr !== undefined &&
        exactTitleExpr !== ''
      ) {
        const exactContentVal = exactContentExpr[0]
          .split(':')[1]
          .replace(/"/g, '')
          .trim();
        const exactTitleVal = exactTitleExpr[0]
          .split(':')[1]
          .replace(/"/g, '')
          .trim();

        if (exactContentVal === exactTitleVal) {
          // Remove base exact expression from baseQuery
          baseQuery = baseQuery.replace(baseExactExprRegEx, '');
          // Retrieve base exact expr value
          baseExactExprVal = exactContentVal;
        }
      }
    }

    // Build the base search filters
    const baseSearchValues = extractFilterFromText(baseSearch, false, true);
    baseSearchValues['exact_expression_value'] = baseExactExprVal;
    setBaseSearch(baseSearchValues);

    // Add other fields filters if the base/original query searched by the user
    // is not empty
    if (baseQuery !== '' && baseQuery !== '*' && baseQuery !== '*:*') {
      // Regex that matches every field expression (ie 'AND/OR [field]:[value]')
      const superFieldsRegEx = /(AND\s|OR\s)*[^\s\(\[\:]+:(\[[^\]]+\]|\([^\)]+\)|\"[^\"]+\"|[^\s\(\]]+)/g;
      // Put the matches of the regex in a variable
      const fields = baseQuery.match(superFieldsRegEx);
      // Object which will contain the last found field filter that corresponds
      // to a Solr field used for exact match (ie [field]_exact)
      let lastExact = {};
      if (fields != null && fields !== undefined && fields !== '') {
        // For each field filter, the operator (if any), the fieldname and the
        // filter values are extracted and the corresponding UI is built
        for (let cpt = 0; cpt < fields.length; cpt++) {
          let isExactField = false;
          let exactFilter = '';
          let originalFieldname = '';
          let fieldExpression = fields[cpt];

          // Extract operator if there is one
          let operator = '';
          if (
            fieldExpression.startsWith('AND') ||
            fieldExpression.startsWith('OR')
          ) {
            operator = fieldExpression.split(' ')[0];
            // Remove the found operator from the fieldExpression
            fieldExpression = fieldExpression.substring(operator.length + 1);
          }

          // Extract fieldname
          let fieldname = fieldExpression.substring(
            0,
            fieldExpression.indexOf(':')
          );
          let negativeExpression = false;
          // If the first char of the fieldname is -, it is because it is a
          // negative filter
          // need to remove this char to get the real fieldname
          if (fieldname.startsWith('-')) {
            fieldname = fieldname.substring(1);
            negativeExpression = true;
          }
          // Remove the fielname from the fieldExpression as it only remains the
          // filter expression
          fieldExpression = fieldExpression.substring(fieldname.length + 1);

          // Determine if the previous field was an exact Solr field of this one
          if (!isEmptyObject(lastExact) && fieldname in lastExact) {
            // The previous field was the exact field of this one
            // Get the exact filter to put it in the exact_expression_value
            // filter of the current field
            exactFilter =
              lastExact[fieldname]['extractedValues']['exact_expression_value'];
            // Empty the lastExact object
            lastExact = {};
          } else if (!isEmptyObject(lastExact)) {
            // The lastExact object is not empty
            // This means that the previous field was an exact Solr field and it
            // doesn't match with the current field
            // Thus it was not added to the UI and need to be added now !
            let lastExactOriginalFieldname = '';
            for (let key in lastExact) {
              lastExactOriginalFieldname = key;
            }
            const lastExactFieldName = lastExactOriginalFieldname + '_exact';
            const lastExactOperator =
              lastExact[lastExactOriginalFieldname]['operator'];
            const lastExactExtractedValues =
              lastExact[lastExactOriginalFieldname]['extractedValues'];
            // Add an addtional field filter
            const type = determineFieldType(lastExactFieldName);
            newAdditionalFields.push({
              fieldname: lastExactFieldName,
              extractedValues: lastExactExtractedValues,
              operator: lastExactOperator,
              type: type,
            });
          }

          // Determine if the current field is an exact Solr field
          const moreThanExactExprRegex = /(?![^\"]*\")[^\)\s].*/g;
          if (
            fieldname.endsWith('_exact') &&
            (fieldExpression.startsWith('"') ||
              fieldExpression.startsWith('("')) &&
            fieldExpression.match(moreThanExactExprRegex) == null
          ) {
            isExactField = true;
            originalFieldname = fieldname.replace('_exact', '');
          }

          // Determine field type
          let fieldType = determineFieldType(fieldname);

          // Extract filters values
          let extractedValues = null;
          if (fieldType === 'text') {
            extractedValues = extractFilterFromText(
              fieldExpression,
              negativeExpression,
              false
            );

            // If the exactFilter variable is not empty then it needs to be
            // added to the extracted values
            if (exactFilter !== '') {
              extractedValues['exact_expression_value'] = (
                extractedValues['exact_expression_value'] +
                ' ' +
                exactFilter
              ).trim();
            }
          } else {
            // If the field type is not text but a number or a date then the
            // filter value can only have two shapes : a single value or a range
            // of values
            let fromValue = null;
            let toValue = null;
            // Detect if the filter value is a range and extract the from and to
            // values if it is the case
            if (fieldExpression.startsWith('[')) {
              const values = fieldExpression.split(' ');
              fromValue = values[0].substring(1);
              toValue = values[2].substring(0, values[2].length - 1);
            } else {
              // The filter value is a direct value.
              // Thus to simplify the treatments of the advanced search, the
              // direct value is converted to a range filter with the same value
              // as from/to values
              fromValue = fieldExpression;
              toValue = fieldExpression;
            }
            // Set the extractedValues variable with the extracted from/to
            // values
            extractedValues = {
              fromValue: fromValue,
              toValue: toValue,
            };
          }

          // If this field is not an exact Solr field then its filter UI can be
          // created now
          // otherwise its exact filter value needs to be saved for the next
          // iteration in order to either add it to it's corresponding "normal"
          // field or to add it as standalone field
          if (!isExactField) {
            const type = determineFieldType(fieldname);
            newAdditionalFields.push({
              fieldname: fieldname,
              extractedValues: extractedValues,
              operator: operator,
              type: type,
            });
          } else {
            const type = determineFieldType(fieldname);
            lastExact[originalFieldname] = {
              fieldname: fieldname,
              operator: operator,
              extractedValues: extractedValues,
              type: type,
            };
          }
        }

        // Add remaining lastExact if any
        if (!isEmptyObject(lastExact)) {
          // The lastExact object is not empty
          // It was not added to the UI because it was the last field of the for
          // loop and thus needs to be added now !
          let lastExactOriginalFieldname = '';
          for (var key in lastExact) {
            lastExactOriginalFieldname = key;
          }
          const lastExactFieldName = lastExactOriginalFieldname + '_exact';
          const lastExactOperator =
            lastExact[lastExactOriginalFieldname]['operator'];
          const lastExactExtractedValues =
            lastExact[lastExactOriginalFieldname]['extractedValues'];
          const type = determineFieldType(lastExactFieldName);
          newAdditionalFields.push({
            fieldname: lastExactFieldName,
            extractedValues: lastExactExtractedValues,
            operator: lastExactOperator,
            type: type,
          });
        }
      }
    }
    setAdditionalFields(newAdditionalFields);
  }, [
    extractFilterFromText,
    isEmptyObject,
    query.elements,
    determineFieldType,
  ]);

  const getNumberAndDateFilter = useCallback((field) => {
    const fromValue = field.extractedValues.fromValue;
    const toValue = field.extractedValues.toValue;
    let filter = '';

    if (
      (fromValue != null && fromValue !== undefined && fromValue !== '') ||
      (toValue != null && toValue !== undefined && toValue !== '')
    ) {
      filter = field.fieldname + ':[';

      if (fromValue != null && fromValue !== undefined && fromValue !== '') {
        filter += fromValue + ' TO ';
      } else {
        filter += '* TO ';
      }

      if (toValue != null && toValue !== undefined && toValue !== '') {
        filter += toValue + ']';
      } else {
        filter += '*]';
      }
    }

    return filter;
  }, []);

  const getTextFieldFilter = useCallback((field) => {
    const all_words_value = field.extractedValues.all_words_value;
    const at_least_one_word_line_value =
      field.extractedValues.at_least_one_word_value;
    const exact_expression_line_value =
      field.extractedValues.exact_expression_value;
    let none_of_these_words_line_value =
      field.extractedValues.none_of_these_words_value;

    const exactExpressionsRegex = /"[^\"]+"/g;

    // Global filter
    let filter = '';

    // Add the all_words filter if available to the global filter
    if (
      all_words_value != null &&
      all_words_value !== undefined &&
      all_words_value !== ''
    ) {
      filter += all_words_value.trim();
    }

    // Add the exact expression filter if available and if no specific Solr field for exact expression have been provided
    if (
      exact_expression_line_value !== null &&
      exact_expression_line_value !== undefined &&
      exact_expression_line_value !== '' &&
      (field.fieldNameExactExpr === null ||
        field.fieldNameExactExpr === undefined ||
        field.fieldNameExactExpr === field.fieldname)
    ) {
      const splittedValue = exact_expression_line_value.trim().split(' ');
      if (splittedValue.length > 1) {
        filter += ' "' + exact_expression_line_value.trim() + '"';
      } else {
        filter += ' ' + exact_expression_line_value.trim();
      }
    }

    // Add the at least one word filter if available to the global filter
    if (
      at_least_one_word_line_value !== null &&
      at_least_one_word_line_value !== undefined &&
      at_least_one_word_line_value !== ''
    ) {
      const splittedValue = at_least_one_word_line_value.trim().split(' ');
      for (let i = 0; i < splittedValue.length; i++) {
        if (i === 0) {
          filter += ' ' + splittedValue[i];
        } else {
          filter += ' OR ' + splittedValue[i];
        }
      }
    }

    // Add the none of these words filter if available to the global filter
    if (
      none_of_these_words_line_value !== null &&
      none_of_these_words_line_value !== undefined &&
      none_of_these_words_line_value !== ''
    ) {
      // Starts with the exact negative expressions like -"france labs"
      const exactNegativeExpressions = none_of_these_words_line_value.match(
        exactExpressionsRegex
      );
      if (
        exactNegativeExpressions !== null &&
        exactNegativeExpressions !== undefined
      ) {
        for (
          let cptNgtExact = 0;
          cptNgtExact < exactNegativeExpressions.length;
          cptNgtExact++
        ) {
          const exactNegativeExpression = exactNegativeExpressions[cptNgtExact];
          filter += ' -' + exactNegativeExpression;
          const exactNgtExprIndex = none_of_these_words_line_value.search(
            exactNegativeExpression
          );
          // If there is a space in front of the exact expression then remove it + the exact expression, otherwise only remove the exact expression
          if (
            exactNgtExprIndex > 0 &&
            none_of_these_words_line_value.substring(
              exactNgtExprIndex - 1,
              exactNgtExprIndex
            ) === ' '
          ) {
            none_of_these_words_line_value = none_of_these_words_line_value.replace(
              ' ' + exactNegativeExpression,
              ''
            );
          } else {
            none_of_these_words_line_value = none_of_these_words_line_value.replace(
              exactNegativeExpression,
              ''
            );
          }
        }
      }

      // Now handle the "normal" negative words like -test
      const splittedValue = none_of_these_words_line_value.trim().split(' ');
      for (let i = 0; i < splittedValue.length; i++) {
        if (splittedValue[i].trim() !== '') {
          filter += ' -' + splittedValue[i];
        }
      }
    }

    // If the filter is not empty then format/clean it before returning it, return the empty string otherwise
    if (
      filter !== '' ||
      (field.fieldNameExactExpr !== null &&
        field.fieldNameExactExpr !== undefined &&
        exact_expression_line_value != null &&
        exact_expression_line_value !== undefined &&
        exact_expression_line_value !== '')
    ) {
      let finalFilter = '';

      // If the fieldName is available it then add it to the final filter
      if (field.fieldname != null && field.fieldname !== '' && filter !== '') {
        finalFilter += field.fieldname + ':';
      }

      // If the filter contains multiple expressions (identified by the number of spaces)
      // then it needs to be surrounded by parenthesis
      // unless it is the filter for the basic search (in which case the finalFilter variable is empty because no fieldName has been found)
      if (filter.split(' ').length > 1) {
        if (finalFilter !== '') {
          finalFilter += '(' + filter.trim() + ')';
        } else {
          finalFilter = filter.trim();
        }
      } else {
        finalFilter += filter.trim();
      }

      // if a specific Solr field is available for the exact expression then add it to the finalFilter
      if (
        field.fieldNameExactExpr !== null &&
        field.fieldNameExactExpr !== undefined &&
        field.fieldNameExactExpr !== field.fieldname &&
        exact_expression_line_value !== null &&
        exact_expression_line_value !== undefined &&
        exact_expression_line_value !== ''
      ) {
        if (Array.isArray(field.fieldNameExactExpr)) {
          let exactFilter = '(';
          for (let i = 0; i < field.fieldNameExactExpr.length; i++) {
            if (exactFilter !== '(') {
              exactFilter += 'OR ';
            }
            exactFilter +=
              field.fieldNameExactExpr[i] +
              ':"' +
              exact_expression_line_value.trim() +
              '" ';
          }
          exactFilter += ')';
          finalFilter += ' ' + exactFilter;
        } else {
          finalFilter +=
            ' ' +
            field.fieldNameExactExpr +
            ':"' +
            exact_expression_line_value.trim() +
            '" ';
        }
        finalFilter = finalFilter.trim();
      }

      return finalFilter;
    } else {
      return filter;
    }
  }, []);

  const prepareBaseQuery = useCallback(() => {
    const fieldNameExactExpr = ['exactContent', 'exactTitle'];
    const field = {
      extractedValues: { ...baseSearch },
      fieldNameExactExpr: fieldNameExactExpr,
      type: 'text',
    };
    return getTextFieldFilter(field);
  }, [baseSearch, getTextFieldFilter]);

  const buildQuery = useCallback(() => {
    let finalQuery = prepareBaseQuery();
    if (additionalFields) {
      finalQuery +=
        ' ' +
        additionalFields.reduce((accumulator, field) => {
          let currentField = { ...field };
          if (exactFieldsList && exactFieldsList[currentField.fieldname]) {
            currentField.fieldNameExactExpr =
              exactFieldsList[currentField.fieldname];
          }

          let filter = undefined;
          if (currentField.type) {
            switch (currentField.type) {
              case 'text':
                filter = getTextFieldFilter(currentField);
                break;
              case 'num':
              case 'date':
                filter = getNumberAndDateFilter(currentField);
                break;
              default:
                break;
            }
          }
          if (filter) {
            if (currentField.operator) {
              filter = currentField.operator + ' ' + filter;
            }
          }
          let result = accumulator + ' ' + filter;
          result = result.trim();
          return result;
        }, '');
    }
    return finalQuery;
  }, [
    additionalFields,
    exactFieldsList,
    getNumberAndDateFilter,
    getTextFieldFilter,
    prepareBaseQuery,
  ]);

  // Should be run only when component mount as sendRequest should be constant
  useEffect(() => {
    sendRequest(
      apiEndpointsContext.getFieldsInfoURL,
      'GET',
      null,
      'GetFieldsInfo'
    );
    sendRequest(
      apiEndpointsContext.getExactFieldsURL,
      'GET',
      null,
      'GetExactFields'
    );
    sendRequest(
      apiEndpointsContext.getAutocompleteAdvancedFieldsURL,
      'GET',
      null,
      'GetAutocompleteAdvancedFields'
    );
    sendRequest(
      apiEndpointsContext.getFixedValuesAdvancedFieldsURL,
      'GET',
      null,
      'GetFixedValuesAdvancedFields'
    );
    sendRequest(
      apiEndpointsContext.getLabeledAdvancedFieldsURL,
      'GET',
      null,
      'GetLabeledAdvancedFields'
    );
  }, [
    apiEndpointsContext.getAutocompleteAdvancedFieldsURL,
    apiEndpointsContext.getExactFieldsURL,
    apiEndpointsContext.getFieldsInfoURL,
    apiEndpointsContext.getFixedValuesAdvancedFieldsURL,
    apiEndpointsContext.getLabeledAdvancedFieldsURL,
    sendRequest,
  ]);

  useEffect(() => {
    if (reqIdentifier === 'GetFieldsInfo') {
      if (!isLoading && data && !error) {
        setAvailableFields(data);
      }
    }
  }, [isLoading, error, data, reqIdentifier]);

  useEffect(() => {
    if (reqIdentifier === 'GetExactFields') {
      if (!isLoading && data && !error) {
        if (data.code === 0) {
          const newExactFieldsList = {};
          // Construct the exactFieldsList using a fieldname as key and
          // [fieldname]_exact as the corresponding value that represents the Solr
          // fieldname for exact match queries
          for (
            var cptExactFields = 0;
            cptExactFields < data.exactFieldsList.length;
            cptExactFields++
          ) {
            newExactFieldsList[data.exactFieldsList[cptExactFields]] =
              data.exactFieldsList[cptExactFields] + '_exact';
          }
          setExactFieldsList(newExactFieldsList);
        }
      }
    }
  }, [isLoading, error, data, reqIdentifier]);

  useEffect(() => {
    if (reqIdentifier === 'GetAutocompleteAdvancedFields') {
      if (!isLoading && data && !error) {
        if (
          data.code === 0 &&
          data.autocompleteFields !== undefined &&
          data.autocompleteFields !== null &&
          data.autocompleteFields !== ''
        ) {
          try {
            const newAutocompleteFields = JSON.parse(data.autocompleteFields);
            setAutocompleteFields(newAutocompleteFields);
          } catch {}
        }
      }
    }
  }, [isLoading, error, data, reqIdentifier]);

  useEffect(() => {
    if (reqIdentifier === 'GetFixedValuesAdvancedFields') {
      if (!isLoading && data && !error) {
        if (data.code === 0) {
          try {
            const newFixedValuesFields = JSON.parse(data.fixedValuesFields);
            setFixedValuesFields(newFixedValuesFields);
          } catch {}
        }
      }
    }
  }, [isLoading, error, data, reqIdentifier]);

  useEffect(() => {
    if (reqIdentifier === 'GetLabeledAdvancedFields') {
      if (!isLoading && data && !error) {
        if (data.code === 0) {
          try {
            const newMappingFieldNameValues = JSON.parse(
              data.mappingFieldNameValues
            );
            setMappingFieldNameValues(newMappingFieldNameValues);
          } catch {}
        }
      }
    }
  }, [isLoading, error, data, reqIdentifier]);

  useEffect(() => {
    if (
      availableFields !== undefined &&
      exactFieldsList !== undefined &&
      autocompleteFields !== undefined &&
      fixedValuesFields !== undefined &&
      mappingFieldNameValues !== undefined
    ) {
      buildStartingAdditionalFields();
    }
  }, [
    availableFields,
    exactFieldsList,
    autocompleteFields,
    fixedValuesFields,
    mappingFieldNameValues,
    buildStartingAdditionalFields,
    query.elements,
  ]);

  const dispatch = (action) => {
    const newAdditionalFields = [...additionalFields];
    switch (action.type) {
      case OPERATOR:
        newAdditionalFields[action.id].operator = action.operator;
        break;
      case FIELD:
        const field = { ...newAdditionalFields[action.id] };
        field.fieldname = action.fieldname;
        field.type = action.fieldType;
        field.extractedValues = action.values;
        newAdditionalFields[action.id] = field;
        break;
      case VALUES:
        newAdditionalFields[action.id].extractedValues = action.values;
        break;
      case REMOVE:
        newAdditionalFields.splice(action.id, 1);
        break;
      default:
        break;
    }
    setAdditionalFields(newAdditionalFields);
  };

  const addField = () => {
    setAdditionalFields([
      ...additionalFields,
      {
        fieldname: undefined,
        extractedValues: {},
        operator: 'AND',
        type: undefined,
      },
    ]);
  };

  const searchClickHandler = () => {
    let newQuery = buildQuery();
    queryDispatch({
      type: SET_ELEMENTS_NO_RESET,
      elements: newQuery,
    });
    props.onClose();
  };

  const handleBaseSearchChange = useCallback((baseSearchField) => {
    return (event) => {
      if (
        event.target &&
        event.target.value !== null &&
        event.target.value !== undefined
      ) {
        const value = event.target.value;
        setBaseSearch((currentBaseSearch) => {
          const newBaseSearch = { ...currentBaseSearch };
          newBaseSearch[baseSearchField] = value;
          return newBaseSearch;
        });
      }
    };
  }, []);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
      <DialogTitle onClose={props.onClose}>{t('Advanced Search')}</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="subtitle2">{t('Basic Search')}</Typography>
          </Grid>
          <Grid item container justify="space-between">
            <Grid item xs={1} />
            <Grid item xs={10}>
              <div>
                <TextField
                  id="advanced-search-all-words"
                  label={t('All words')}
                  helperText={t('Will search for ALL the terms listed')}
                  variant="filled"
                  value={baseSearch.all_words_value}
                  onChange={handleBaseSearchChange('all_words_value')}
                  color="secondary"
                />
              </div>
              <div>
                <TextField
                  id="advanced-search-exact-expression"
                  label={t('Exact expression')}
                  helperText={t(
                    'Will search for EXACTLY the sentence you entered'
                  )}
                  variant="filled"
                  value={baseSearch.exact_expression_value}
                  onChange={handleBaseSearchChange('exact_expression_value')}
                  color="secondary"
                />
              </div>
              <div>
                <TextField
                  id="advanced-search-at-least-one-word"
                  label={t('At least one word')}
                  helperText={t(
                    'Will search for documents with AT LEAST ONE of these terms'
                  )}
                  variant="filled"
                  value={baseSearch.at_least_one_word_value}
                  onChange={handleBaseSearchChange('at_least_one_word_value')}
                  color="secondary"
                />
              </div>
              <div>
                <TextField
                  id="advanced-search-not-these-words"
                  label={t('Not these words')}
                  helperText={t(
                    'Will NOT DISPLAY documents with AT LEAST ONE of these terms'
                  )}
                  variant="filled"
                  value={baseSearch.none_of_these_words_value}
                  onChange={handleBaseSearchChange('none_of_these_words_value')}
                  color="secondary"
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        {additionalFields &&
          additionalFields.map((field, index) => {
            return (
              <AdvancedSearchField
                field={field}
                id={index}
                fieldList={availableFields.field}
                dispatch={dispatch}
                determineFieldType={determineFieldType}
                mappingFieldNameValues={mappingFieldNameValues}
              />
            );
          })}
        <Container className={classes.addFieldContainer}>
          <Button onClick={addField} variant="contained" size="small">
            {t('Add a search field')}
          </Button>
          <Typography variant="caption" className={classes.addFieldCaption}>
            {t(
              'Click if you need to search in a specific field or want to combine with several fields or with basic search'
            )}
          </Typography>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={searchClickHandler}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t('Search')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdvancedSearchField = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleOperatorChange = (event) => {
    props.dispatch({
      type: OPERATOR,
      id: props.id,
      operator: event.target.value,
    });
  };

  const handleFieldChange = (event) => {
    const newField = props.fieldList.find(
      (field) => field.name === event.target.value
    );
    props.dispatch({
      type: FIELD,
      id: props.id,
      fieldname: newField.name,
      fieldType: props.determineFieldType(newField.name),
      values: {},
    });
  };

  const handleFieldValuesChange = (values) => {
    props.dispatch({
      type: VALUES,
      id: props.id,
      values: values,
    });
  };

  const buildField = () => {
    switch (props.field.type) {
      case 'num':
        return (
          <AdvancedSearchNumField
            values={props.field.extractedValues}
            onChange={handleFieldValuesChange}
          />
        );
      case 'date':
        return (
          <AdvancedSearchDateField
            values={props.field.extractedValues}
            onChange={handleFieldValuesChange}
          />
        );
      case 'text':
        return (
          <AdvancedSearchTextField
            values={props.field.extractedValues}
            onChange={handleFieldValuesChange}
          />
        );
      default:
        return null;
    }
  };

  const advancedSearchField = buildField();

  const handleRemove = () => {
    props.dispatch({
      type: REMOVE,
      id: props.id,
    });
  };

  const getFieldLabel = (fieldname) => {
    if (
      props.mappingFieldNameValues &&
      props.mappingFieldNameValues[fieldname]
    ) {
      return props.mappingFieldNameValues[fieldname];
    }
    return fieldname;
  };

  return (
    <>
      <Grid container justify="space-between">
        <Grid item xs={10}>
          <Typography variant="subtitle2">
            {t('Search in a specific field')}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleRemove}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid item container justify="space-between">
          <Grid item xs={1} />
          <Grid item container direction="column" xs={10}>
            <Grid item>
              <FormControl
                className={classes.formControl}
                color="secondary"
                variant="filled"
              >
                <InputLabel id={`advanced-search-field-${props.id}-op-label`}>
                  {t('Operator')}
                </InputLabel>
                <Select
                  labelId={`advanced-search-field-${props.id}-op-label`}
                  id={`advanced-search-field-${props.id}-op`}
                  value={props.field.operator}
                  onChange={handleOperatorChange}
                >
                  <MenuItem value="OR">{t('OR')}</MenuItem>
                  <MenuItem value="AND">{t('AND')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                className={classes.formControl}
                color="secondary"
                variant="filled"
              >
                <InputLabel
                  id={`advanced-search-field-${props.id}-field-label`}
                >
                  {t('Field')}
                </InputLabel>
                <Select
                  labelId={`advanced-search-field-${props.id}-field-label`}
                  id={`advanced-search-field-${props.id}-field`}
                  value={props.field.fieldname}
                  onChange={handleFieldChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {props.fieldList.map((field) => (
                    <MenuItem value={field.name}>
                      {getFieldLabel(field.name)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item className={classes.advancedSearchField}>
              {advancedSearchField}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
};

export default AdvancedSearchModal;
