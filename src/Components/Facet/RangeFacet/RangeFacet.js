import { Divider, IconButton, Menu, MenuItem, Radio, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import { add, differenceInCalendarDays, format } from 'date-fns';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QueryContext,
  REGISTER_RANGE_FACET,
  SET_RANGE_FACET_SELECTED,
} from '../../../Contexts/query-context';
import { ResultsContext } from '../../../Contexts/results-context';
import { UserContext } from '../../../Contexts/user-context';
import RangeBarchart from '../../Chart/RangeBarChart';

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    flexGrow: 1,
  },
  facetHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  showMore: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },

  chartContainer: {
    marginLeft: -20,
  },

  bounds: {
    padding: theme.spacing(2),
  },

  radioGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },

  radio: {
    padding: theme.spacing(0),
  },

  radioLabel: {
    marginRight: 5,
  },

  label: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const REF_KEY = 'RangeFacet';

function RangeFacet({ title, dividerClassName, ...elementProps }) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { field } = elementProps;

  const [startIndex, setStartIndex] = useState();
  const [endIndex, setEndIndex] = useState();

  const classes = useStyles();
  const { t } = useTranslation();

  const menuAnchorRef = useRef(null);

  const {
    query: { selectedRangeFacets = {} },
    dispatch: queryDispatch,
  } = useContext(QueryContext);

  const {
    results: { rangeFacets = {} },
  } = useContext(ResultsContext);

  const { state: userState } = useContext(UserContext);

  const [data, setData] = useState([]);

  // Effect to add the facet to the query if it is not registered
  useEffect(() => {
    const newFacet = {
      field,
      start: 'NOW-300MONTH',
      end: 'NOW/MONTH',
      gap: '+1MONTH',
      tag: 'dateHisto',
      title: 'Date range',
    };
    queryDispatch({ type: REGISTER_RANGE_FACET, rangeFacet: newFacet });
  }, [field, queryDispatch]);

  // Effect to format and set new range data
  useEffect(() => {
    if (rangeFacets && typeof rangeFacets === 'object' && rangeFacets[field]) {
      const newData = Object.entries(rangeFacets[field]).map(([date, value]) => ({
        x: date,
        doc: value,
      }));

      setData(newData);

      // Set start end end index for brush tool
      if (selectedRangeFacets && selectedRangeFacets[field]) {
        const selection = selectedRangeFacets[field].find(
          (selectionRange) => selectionRange.refKey === REF_KEY
        );
        const start = parseInt(selection?.startIndex);
        const end = parseInt(selection?.endIndex);
        if (!isNaN(start) && !isNaN(end)) {
          setStartIndex(start);
          setEndIndex(end);
        }
      }
    }
  }, [field, rangeFacets, selectedRangeFacets]);

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleResetFilterClick = () => {
    setStartIndex(0);
    setEndIndex(data.length - 1);
    setData([...data]); // Reset graph display
    setMenuOpen(false);
  };

  const onSelectionChanged = (start, end) => {
    if (start >= 0 && end >= 0) {
      const startX = data[start].x;
      const endX = data[end].x;

      const newSelected = [
        {
          refKey: REF_KEY,
          startIndex: start,
          endIndex: end,
          filter: `[${startX} TO ${endX}]`,
        },
      ];
      queryDispatch({
        type: SET_RANGE_FACET_SELECTED,
        facetId: 'creation_date',
        selected: newSelected,
      });
    }
  };

  const dateFormatter = (value) => {
    const date = new Date(value);
    return isNaN(date) ? '' : format(date, userState.userLocale.dateFormat);
  };

  let brushStart = '',
    brushEnd = '';
  if (data.length && startIndex >= 0 && endIndex >= 0) {
    brushStart = data[startIndex].x;
    brushEnd = data[endIndex].x;
  }

  return (
    <>
      <div className={classes.facetHeader}>
        <IconButton
          onClick={handleOpenMenu}
          aria-controls={'range-facet-menu'}
          aria-haspopup="true"
          aria-label={t(`Open {{ facetTitle }} facet menu`, {
            facetTitle: t(title),
          })}>
          <MoreVertIcon ref={menuAnchorRef} />
        </IconButton>
        <Menu
          id={'range-facet-menu'}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}>
          <MenuItem onClick={handleResetFilterClick}>{t('Reset')}</MenuItem>
        </Menu>
        <Typography color="secondary" className={classes.facetTitleText}>
          {t(title)}
        </Typography>
        <IconButton
          onClick={handleExpandClick}
          aria-label={t(`${expanded ? 'Collapse' : 'Expand'} {{ facetTitle }} facet`, {
            facetTitle: t(title),
          })}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>

      {expanded ? (
        <div>
          <div className={classes.chartContainer}>
            <RangeBarchart
              data={data}
              xDataKey="x"
              yDataKey="doc"
              maxHeight="15em"
              startIndex={startIndex}
              endIndex={endIndex}
              onSelectionChanged={onSelectionChanged}
              tickFormatter={dateFormatter}
              {...elementProps}
            />
          </div>
          <div className={classes.bounds}>
            <div className={classes.radioGroup}>
              {[1, 3, 6, 12, 36].map((month) => (
                <div>
                  <Radio
                    className={classes.radio}
                    // checked={selectedValue === 'd'}
                    // onChange={handleChange}
                    value={month}
                    // color="d"
                    name="radio-button"
                    inputProps={{ 'aria-label': month }}
                  />{' '}
                  <Typography display="inline" variant="body2" className={classes.radioLabel}>
                    {month} {t('Month')}
                  </Typography>
                </div>
              ))}
            </div>
            <Typography variant="body2" className={classes.label}>
              {t('Start')} : {dateFormatter(brushStart)}
            </Typography>
            <Typography variant="body2" className={classes.label}>
              {t('End')} : {dateFormatter(brushEnd)}
            </Typography>
          </div>
        </div>
      ) : null}
      <Divider className={dividerClassName} />
    </>
  );
}

export default RangeFacet;
