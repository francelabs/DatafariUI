import DateFnsUtils from '@date-io/date-fns';
import { Button, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format } from 'date-fns';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryContext, REGISTER_FILTER, UNREGISTER_FILTER } from '../../Contexts/query-context';
import { UserContext } from '../../Contexts/user-context';
import { DATE_RANGE } from '../../Hooks/useFilterFormater';

const FILTER_ID = 'customDateRange';

const useStyles = makeStyles((theme) => ({
  dateSelectors: {
    verticalAlign: 'inherit',
    width: '16ch',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  containerSpacing: {
    marginLeft: theme.spacing(1),
  },
}));

const DateFacetCustom = (props) => {
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const [selectedFromDate, setSelectedFromDate] = React.useState(new Date());
  const [selectedToDate, setSelectedToDate] = React.useState(new Date());
  const { t } = useTranslation();
  const classes = useStyles();

  const { state: userState } = useContext(UserContext);

  const handleFromDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      date.setHours(0, 0, 0);
      setSelectedFromDate(date);
    } else {
      setSelectedFromDate(null);
    }
  };

  const handleToDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      date.setHours(23, 59, 59);
      setSelectedToDate(date);
    } else {
      setSelectedToDate(null);
    }
  };

  const handleGoClick = (e) => {
    e.preventDefault();

    if (selectedToDate || selectedFromDate) {
      const fromDateString = selectedFromDate ? selectedFromDate.toISOString() : '*';
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
          createTheme({
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
        }>
        <div className={classes.containerSpacing}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={userState.userLocale.locale}>
            <form onSubmit={handleGoClick} style={{ display: 'flex' }}>
              <KeyboardDatePicker
                format={userState.userLocale.dateFormat}
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
                format={userState.userLocale.dateFormat}
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
              <Button type="submit" size="small" color="primary" onClick={handleGoClick}>
                {t('Go')}
              </Button>
            </form>
          </MuiPickersUtilsProvider>
        </div>
      </ThemeProvider>
    </>
  );
};

export default DateFacetCustom;
