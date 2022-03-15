import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RangeBarchart from '../Chart/RangeBarChart';

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
}));

const chartData = [
  { name: '01/02/2022', doc: 300 },
  { name: '02/02/20222', doc: 145 },
  { name: '03/02/2022', doc: 100 },
  { name: '04/02/2022', doc: 8 },
  { name: '05/02/2022', doc: 100 },
  { name: '06/02/2022', doc: 9 },
  { name: '07/02/2022', doc: 53 },
  { name: '08/02/2022', doc: 252 },
  { name: '09/02/2022', doc: 79 },
  { name: '10/02/2022', doc: 294 },
  { name: '11/02/2022', doc: 43 },
  { name: '12/02/2022', doc: 74 },
  { name: '13/02/2022', doc: 71 },
  { name: '14/02/2022', doc: 117 },
  { name: '15/02/2022', doc: 186 },
  { name: '16/02/2022', doc: 16 },
  { name: '17/02/2022', doc: 125 },
  { name: '18/02/2022', doc: 222 },
  { name: '19/02/2022', doc: 372 },
  { name: '20/02/2022', doc: 182 },
  { name: '21/02/2022', doc: 164 },
  { name: '22/02/2022', doc: 316 },
  { name: '23/02/2022', doc: 131 },
  { name: '24/02/2022', doc: 291 },
  { name: '25/02/2022', doc: 47 },
  { name: '26/02/2022', doc: 415 },
  { name: '27/02/2022', doc: 182 },
  { name: '28/02/2022', doc: 93 },
  { name: '29/02/2022', doc: 99 },
  { name: '30/02/2022', doc: 52 },
  { name: '31/02/2022', doc: 154 },
];

function RangeFacet({ title, dividerClassName, ...elementProps }) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // TODO: Here the chart data is mocked localy. May use here a hook / props to get real data from back
  const [data, setData] = useState(chartData);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(chartData.length - 1);

  const classes = useStyles();
  const { t } = useTranslation();

  const menuAnchorRef = useRef(null);

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

  const onSelectionChanged = ({ startIndex, endIndex }) => {
    setStartIndex(startIndex);
    setEndIndex(endIndex);
  };

  return (
    <>
      <div className={classes.facetHeader}>
        <IconButton
          onClick={handleOpenMenu}
          aria-controls={'date-range-facet-menu'}
          aria-haspopup="true"
          aria-label={t(`Open {{ facetTitle }} facet menu`, {
            facetTitle: t(title),
          })}
        >
          <MoreVertIcon ref={menuAnchorRef} />
        </IconButton>
        <Menu
          id={'date-range-facet-menu'}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleResetFilterClick}>{t('Reset')}</MenuItem>
        </Menu>
        <Typography color="secondary" className={classes.facetTitleText}>
          {t(title)}
        </Typography>
        <IconButton
          onClick={handleExpandClick}
          aria-label={t(
            `${expanded ? 'Collapse' : 'Expand'} {{ facetTitle }} facet`,
            {
              facetTitle: t(title),
            }
          )}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>

      {expanded ? (
        <RangeBarchart
          data={data}
          xDataKey="name"
          yDataKey="doc"
          maxHeight="15em"
          startIndex={startIndex}
          endIndex={endIndex}
          onSelectionChanged={onSelectionChanged}
          tickFormatter={(value) => value.slice(0, 2)}
          {...elementProps}
        />
      ) : null}
      <Divider className={dividerClassName} />
    </>
  );
}

export default RangeFacet;
