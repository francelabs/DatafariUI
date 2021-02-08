import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  dateSelectors: {
    verticalAlign: 'inherit',
    width: '16ch',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  containerSpacing: {
    marginLeft: theme.spacing(1),
  },
}));

const AdvancedSearchDateField = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);

  const handleChange = (dateField) => {
    return (date) => {
      const values = { ...props.values };
      values[dateField] = date ? date.toISOString() : '*';
      props.onChange(values);
    };
  };

  useEffect(() => {
    const fromDate =
      props.values.fromValue && props.values.fromValue !== '*'
        ? new Date(props.values.fromValue)
        : null;
    const toDate =
      props.values.toValue && props.values.toValue !== '*'
        ? new Date(props.values.toValue)
        : null;
    setSelectedFromDate(fromDate);
    setSelectedToDate(toDate);
  }, [props.values]);

  return (
    <ThemeProvider
      theme={(theme) =>
        createMuiTheme({
          ...theme,
          palette: {
            ...theme.palette,
            primary: {
              light: theme.palette.secondary.light,
              main: theme.palette.secondary.main,
              dark: theme.palette.secondary.dark,
            },
          },
        })
      }
    >
      <KeyboardDatePicker
        autoOk={true}
        variant="inline"
        margin="dense"
        id="from-date-picker-dialog"
        label={t('From')}
        format="MM/dd/yyyy"
        value={selectedFromDate}
        onChange={handleChange('fromValue')}
        KeyboardButtonProps={{
          'aria-label': 'change start date',
        }}
        size="small"
        className={classes.dateSelectors}
      />
      <KeyboardDatePicker
        autoOk={true}
        variant="inline"
        margin="dense"
        id="to-date-picker-dialog"
        label={t('To')}
        format="MM/dd/yyyy"
        value={selectedToDate}
        onChange={handleChange('toValue')}
        KeyboardButtonProps={{
          'aria-label': 'change end date',
        }}
        size="small"
        className={classes.dateSelectors}
      />
    </ThemeProvider>
  );
};

export default AdvancedSearchDateField;
