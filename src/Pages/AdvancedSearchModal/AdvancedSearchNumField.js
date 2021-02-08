import { TextField } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AdvancedSearchNumField = (props) => {
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
      <TextField
        label={t('From')}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        value={props.values.fromValue}
        onChange={handleChange('fromValue')}
        color="secondary"
      />
      <TextField
        label={t('To')}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        value={props.values.toValue}
        onChange={handleChange('toValue')}
        color="secondary"
      />
    </>
  );
};

export default AdvancedSearchNumField;
