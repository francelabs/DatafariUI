import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const AdvancedSearchFixedValuesField = (props) => {
  const { t } = useTranslation();

  const handleChange = () => {
    return (event) => {
      const values = { ...props.values };
      values.value = event.target.value;
      props.onChange(values);
    };
  };

  const getValueFrom = useCallback((fixedValue) => {
    if (fixedValue instanceof Object) {
      return fixedValue.value;
    } else {
      return fixedValue;
    }
  }, []);

  const getLabelFrom = useCallback((fixedValue) => {
    if (fixedValue instanceof Object) {
      return fixedValue.label;
    } else {
      return fixedValue;
    }
  }, []);

  return (
    <>
      <FormControl color="secondary" variant="filled">
        <InputLabel id={`advanced-search-field-${props.id}-fixedvalues-label`}>
          {t('Value')}
        </InputLabel>
        <Select
          labelId={`advanced-search-fixedvalues-${props.id}-fixedvalues-label`}
          id={`advanced-search-fixedvalues-${props.id}-fixedvalues`}
          value={props.values.value}
          onChange={handleChange()}
        >
          {props.fixedValues.map((fixedValue) => (
            <MenuItem value={getValueFrom(fixedValue)}>
              {getLabelFrom(fixedValue)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default AdvancedSearchFixedValuesField;
