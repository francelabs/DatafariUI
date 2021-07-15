import {
  Button,
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core';
import frLocale from 'date-fns/locale/fr';
import enLocale from 'date-fns/locale/en-US';
import deLocale from 'date-fns/locale/de';
import ptLocale from 'date-fns/locale/pt';
import itLocale from 'date-fns/locale/it';
import ruLocale from 'date-fns/locale/ru';
import esLocale from 'date-fns/locale/es';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QueryContext,
  REGISTER_FILTER,
  UNREGISTER_FILTER,
} from '../../Contexts/query-context';
import { DATE_RANGE } from '../../Hooks/useFilterFormater';

const FILTER_ID = 'customDateRange';

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

const DateFacetCustom = (props) => {
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const [selectedFromDate, setSelectedFromDate] = React.useState(null);
  const [selectedToDate, setSelectedToDate] = React.useState(null);
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const handleFromDateChange = (date) => {
    date.setHours(0, 0, 0);
    setSelectedFromDate(date);
  };

  const handleToDateChange = (date) => {
    date.setHours(23, 59, 59);
    setSelectedToDate(date);
  };

  const getLocale = useCallback(() => {
    if (i18n.language) {
      switch (i18n.language) {
        case 'fr':
          return frLocale;
        case 'de':
          return deLocale;
        case 'it':
          return itLocale;
        case 'ru':
          return ruLocale;
        case 'es':
          return esLocale;
        case 'pt':
        case 'pt_br':
          return ptLocale;
        case 'en':
        default:
          return enLocale;
      }
    } else {
      return enLocale;
    }
  }, [i18n.language]);

  const handleGoClick = () => {
    if (selectedToDate || selectedFromDate) {
      const fromDateString = selectedFromDate
        ? selectedFromDate.toISOString()
        : '*';
      const toDateString = selectedToDate ? selectedToDate.toISOString() : '*';
      const field = props.field ? props.field : 'creation_date';
      const newFilter = {
        value: `${field}:[${fromDateString} TO ${toDateString}]`,
        extra: {
          type: DATE_RANGE,
          from: selectedFromDate,
          to: selectedToDate,
          field: field,
        },
        id: FILTER_ID,
      };
      queryDispatch({
        type: REGISTER_FILTER,
        filter: newFilter,
        overrideIfExist: true,
      });
    } else {
      handleResetClick();
    }
  };

  const handleResetClick = () => {
    if (query.filters[FILTER_ID]) {
      queryDispatch({
        type: UNREGISTER_FILTER,
        id: FILTER_ID,
      });
    }
  };

  useEffect(() => {
    if (query.filters[FILTER_ID]) {
      const extra = query.filters[FILTER_ID].extra;
      setSelectedFromDate(extra.from ? extra.from : null);
      setSelectedToDate(extra.to ? extra.to : null);
    } else {
      setSelectedFromDate(null);
      setSelectedToDate(null);
    }
  }, [query.filters]);

  return (
    <>
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
        <div className={classes.containerSpacing}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getLocale()}>
            <KeyboardDatePicker
              format="P"
              autoOk={true}
              variant="inline"
              margin="dense"
              id="from-date-picker-dialog"
              label={t('From')}
              value={selectedFromDate}
              onChange={handleFromDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change start date',
              }}
              size="small"
              className={classes.dateSelectors}
            />
            <KeyboardDatePicker
              format="P"
              autoOk={true}
              variant="inline"
              margin="dense"
              id="to-date-picker-dialog"
              label={t('To')}
              value={selectedToDate}
              onChange={handleToDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change end date',
              }}
              size="small"
              className={classes.dateSelectors}
            />
            <Button size="small" color="primary" onClick={handleGoClick}>
              {t('Go')}
            </Button>
          </MuiPickersUtilsProvider>
        </div>
      </ThemeProvider>
    </>
  );
};

export default DateFacetCustom;
