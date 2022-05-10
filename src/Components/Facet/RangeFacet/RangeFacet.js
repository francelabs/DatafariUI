import { Divider, IconButton, Menu, MenuItem, Radio, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QueryContext,
  REGISTER_RANGE_FACET,
  SET_RANGE_FACET_SELECTED,
} from '../../../Contexts/query-context';
import { ResultsContext } from '../../../Contexts/results-context';
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
    marginRight: 20,
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

function RangeFacet({
  title,
  dividerClassName,
  refKey = REF_KEY,
  tag = 'rangeFacet',
  xAxisLabelFormatter = (value) => value,
  brushTickFormatter,
  ...elementProps
}) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    field,
    start,
    end,
    gap,
    yDataKey,
    ranges = [],
    rangeLabel,
    showBrushBounds = false,
  } = elementProps;

  const [startIndex, setStartIndex] = useState();
  const [endIndex, setEndIndex] = useState();
  const [radioInterval, setRadioInterval] = useState();
  const [brushStart, setBrushStart] = useState();
  const [brushEnd, setBrushEnd] = useState();
  const facetKey = refKey + field;

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

  const [data, setData] = useState([]);

  // Effect to add the facet to the query if it is not registered
  useEffect(() => {
    const newFacet = {
      field,
      start,
      end,
      gap,
      tag,
      title,
    };
    queryDispatch({ type: REGISTER_RANGE_FACET, rangeFacet: newFacet });
  }, [field, start, end, gap, tag, title, queryDispatch]);

  // Effect to format and set new range data
  useEffect(() => {
    if (rangeFacets && typeof rangeFacets === 'object' && rangeFacets[field]) {
      const newData = Object.entries(rangeFacets[field]).map(([xValue, value]) => ({
        x: xValue,
        [t(yDataKey)]: value,
      }));

      setData(newData);

      // Set start end end index for brush tool
      if (selectedRangeFacets && selectedRangeFacets[field]) {
        const selection = selectedRangeFacets[field].find(
          (selectionRange) => selectionRange.refKey === facetKey
        );

        if (selection) {
          const selectionStart = +selection.startIndex;
          const selectionEnd = +selection.endIndex;

          if (!isNaN(selectionStart) && !isNaN(selectionEnd)) {
            setStartIndex(selectionStart < 0 ? 0 : Math.min(selectionStart, data.length - 1));
            setEndIndex(
              selectionEnd < 0 ? data.length - 1 : Math.min(selectionEnd, data.length - 1)
            );
          }
        }
      }
    }
  }, [field, yDataKey, rangeFacets, selectedRangeFacets, data.length, facetKey, t]);

  useEffect(() => {
    let start = '',
      end = '';
    if (startIndex >= 0 && endIndex >= 0) {
      start = data[startIndex]?.x;
      end = data[endIndex]?.x;
    } else if (data.length) {
      start = data[0].x;
      end = data[data.length - 1].x;
    }

    setBrushStart(start);
    setBrushEnd(end);
  }, [data, startIndex, endIndex, brushStart, brushEnd]);

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
    const newSelected = [
      {
        refKey: facetKey,
        startIndex: 0,
        endIndex: -1,
        filter: `[${start} TO ${end}]`,
      },
    ];
    queryDispatch({
      type: SET_RANGE_FACET_SELECTED,
      facetId: field,
      selected: newSelected,
    });

    setMenuOpen(false);
  };

  const onSelectionChanged = (start, end) => {
    if (start >= 0 && end >= 0) {
      const startX = data[start].x;
      const endX = data[end].x;

      const newSelected = [
        {
          refKey: facetKey,
          startIndex: start,
          endIndex: end,
          filter: `[${startX} TO ${endX}]`,
        },
      ];
      queryDispatch({
        type: SET_RANGE_FACET_SELECTED,
        facetId: field,
        selected: newSelected,
      });
    }
  };

  const hanleRadioChecked = (e) => {
    const radioInterval = +e.target.value;
    setRadioInterval(radioInterval);
    setStartIndex(0);
    setEndIndex(Math.min(radioInterval, data.length - 1));

    // Reset data to take in account the new range
    setData([...data]);
  };

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
              yDataKey={yDataKey}
              maxHeight="15em"
              startIndex={startIndex}
              endIndex={endIndex}
              onSelectionChanged={onSelectionChanged}
              xTickFormatter={xAxisLabelFormatter}
              brushTickFormatter={brushTickFormatter}
              {...elementProps}
            />
          </div>
          <div className={classes.bounds}>
            {ranges.length ? (
              <div className={classes.radioGroup}>
                {ranges.map((range) => (
                  <div key={'range-facet-' + range}>
                    <Radio
                      className={classes.radio}
                      checked={radioInterval === range}
                      onChange={hanleRadioChecked}
                      value={range}
                      name="radio-button"
                      inputProps={{ 'aria-label': range }}
                    />{' '}
                    <Typography display="inline" variant="body2" className={classes.radioLabel}>
                      {range} {t(rangeLabel)}
                    </Typography>
                  </div>
                ))}
              </div>
            ) : null}
            {showBrushBounds ? (
              <>
                <Typography variant="body2" className={classes.label}>
                  {t('Start')} : {xAxisLabelFormatter(brushStart)}
                </Typography>
                <Typography variant="body2" className={classes.label}>
                  {t('End')} : {xAxisLabelFormatter(brushEnd)}
                </Typography>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
      <Divider className={dividerClassName} />
    </>
  );
}

export default RangeFacet;
