import { TextField } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdvancedSearchTextField = (props) => {
  const { t } = useTranslation();

  const handleChange = (fieldName) => {
    return (event) => {
      const values = { ...props.values };
      values[fieldName] = event.target.value;
      props.onChange(values);
    };
  };

  return (
    <>
      <div>
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
      </div>
      <div>
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
      </div>
      <div>
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
      </div>
      <div>
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
      </div>
    </>
  );
};

export default AdvancedSearchTextField;
