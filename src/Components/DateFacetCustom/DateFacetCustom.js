import {
  Button,
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryContext, SET_FILTERS } from '../../Contexts/query-context';

const FILTER_ID = 'customDateRange';

const useStyles = makeStyles((theme) => ({
  dateSelectors: {
    verticalAlign: 'inherit',
    width: '16ch',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const DateFacetCustom = (props) => {
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const [selectedFromDate, setSelectedFromDate] = React.useState(null);
  const [selectedToDate, setSelectedToDate] = React.useState(null);
  const { t } = useTranslation();
  const classes = useStyles();

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };

  const handleGoClick = () => {
    if (selectedToDate || selectedFromDate) {
      const fromDateString = selectedFromDate
        ? selectedFromDate.toISOString()
        : '*';
      const toDateString = selectedToDate ? selectedToDate.toISOString() : '*';
      const newFilters = { ...query.filters };
      const field = props.field ? props.field : 'last_modified';
      newFilters[FILTER_ID] = {
        value: `${field}:[${fromDateString} TO ${toDateString}]`,
        extra: {
          from: selectedFromDate,
          to: selectedToDate,
          field: field,
        },
      };
      queryDispatch({
        type: SET_FILTERS,
        filters: { ...newFilters },
      });
    }
  };

  const handleResetClick = () => {
    if (query.filters[FILTER_ID]) {
      const newFilters = { ...query.filters };
      delete newFilters[FILTER_ID];
      queryDispatch({
        type: SET_FILTERS,
        filters: { ...newFilters },
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
        <div>
          {t('from')}
          <KeyboardDatePicker
            autoOk={true}
            variant="inline"
            margin="dense"
            id="from-date-picker-dialog"
            label={t('Start date')}
            format="MM/dd/yyyy"
            value={selectedFromDate}
            onChange={handleFromDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change start date',
            }}
            size="small"
            className={classes.dateSelectors}
          />
          {t('to')}
          <KeyboardDatePicker
            autoOk={true}
            variant="inline"
            margin="dense"
            id="to-date-picker-dialog"
            label={t('End date')}
            format="MM/dd/yyyy"
            value={selectedToDate}
            onChange={handleToDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change end date',
            }}
            size="small"
            className={classes.dateSelectors}
          />
        </div>
        <div>
          <Button size="small" color="primary" onClick={handleGoClick}>
            {t('Go')}
          </Button>
          <Button size="small" color="primary" onClick={handleResetClick}>
            {t('Reset')}
          </Button>
        </div>
      </ThemeProvider>
    </>
  );
};

export default DateFacetCustom;
