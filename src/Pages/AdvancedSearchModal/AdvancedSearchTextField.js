import { makeStyles, TextField } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AutocompleteContainer from '../../Components/SearchBar/Autocompletes/AutocompleteContainer/AutocompleteContainer';
import CustomSuggesterAutocomplete from '../../Components/SearchBar/Autocompletes/CustomSuggesterAutocomplete/CustomSuggesterAutocomplete';

const useStyles = makeStyles((theme) => ({
  textFiledDiv: {
    position: 'relative',
  },
}));

const AdvancedSearchTextField = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleSuggestSelect = useCallback(
    (fieldName) => {
      return (suggestion) => {
        const values = { ...props.values };
        values[fieldName] = suggestion;
        props.onChange(values);
      };
    },
    [props]
  );

  const handleChange = useCallback(
    (fieldName) => {
      return (event) => {
        const values = { ...props.values };
        values[fieldName] = event.target.value;
        props.onChange(values);
      };
    },
    [props]
  );

  return (
    <>
      <div className={classes.textFiledDiv}>
        <TextField
          label={t('All words')}
          helperText={t('Will search for ALL the terms listed')}
          variant="filled"
          value={
            props.values.all_words_value ? props.values.all_words_value : ''
          }
          onChange={handleChange('all_words_value')}
          color="secondary"
        />
        {props.suggester && (
          <AutocompleteContainer queryText={props.values.all_words_value}>
            <CustomSuggesterAutocomplete
              onSelect={handleSuggestSelect('all_words_value')}
              queryText={props.values.all_words_value}
              op="AND"
              suggester={props.suggester}
              maxSuggestion={5}
            />
          </AutocompleteContainer>
        )}
      </div>
      <div className={classes.textFiledDiv}>
        <TextField
          label={t('Exact expression')}
          helperText={t('Will search for EXACTLY the sentence you entered')}
          variant="filled"
          value={
            props.values.exact_expression_value
              ? props.values.exact_expression_value
              : ''
          }
          onChange={handleChange('exact_expression_value')}
          color="secondary"
        />
        {props.suggester && (
          <AutocompleteContainer
            queryText={props.values.exact_expression_value}
          >
            <CustomSuggesterAutocomplete
              onSelect={handleSuggestSelect('exact_expression_value')}
              queryText={props.values.exact_expression_value}
              op="AND"
              suggester={props.suggester}
              maxSuggestion={5}
            />
          </AutocompleteContainer>
        )}
      </div>
      <div className={classes.textFiledDiv}>
        <TextField
          label={t('At least one word')}
          helperText={t(
            'Will search for documents with AT LEAST ONE of these terms'
          )}
          variant="filled"
          value={
            props.values.at_least_one_word_value
              ? props.values.at_least_one_word_value
              : ''
          }
          onChange={handleChange('at_least_one_word_value')}
          color="secondary"
        />
        {props.suggester && (
          <AutocompleteContainer
            queryText={props.values.at_least_one_word_value}
          >
            <CustomSuggesterAutocomplete
              onSelect={handleSuggestSelect('at_least_one_word_value')}
              queryText={props.values.at_least_one_word_value}
              op="AND"
              suggester={props.suggester}
              maxSuggestion={5}
            />
          </AutocompleteContainer>
        )}
      </div>
      <div className={classes.textFiledDiv}>
        <TextField
          label={t('Not these words')}
          helperText={t(
            'Will NOT DISPLAY documents with AT LEAST ONE of these terms'
          )}
          variant="filled"
          value={
            props.values.none_of_these_words_value
              ? props.values.none_of_these_words_value
              : ''
          }
          onChange={handleChange('none_of_these_words_value')}
          color="secondary"
        />
        {props.suggester && (
          <AutocompleteContainer
            queryText={props.values.none_of_these_words_value}
          >
            <CustomSuggesterAutocomplete
              onSelect={handleSuggestSelect('none_of_these_words_value')}
              queryText={props.values.none_of_these_words_value}
              op="AND"
              suggester={props.suggester}
              maxSuggestion={5}
            />
          </AutocompleteContainer>
        )}
      </div>
    </>
  );
};

export default AdvancedSearchTextField;
