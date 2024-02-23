import { IconButton, List, Menu, MenuItem, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import { QueryContext } from '../../Contexts/query-context';
import useHttp from '../../Hooks/useHttp';
import FacetEntry from './FacetEntry';

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

function AggregatorFacet({ title, show = true }) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aggregators, setAggregators] = useState([]);

  const menuAnchorRef = useRef(null);

  const classes = useStyles();
  const { t } = useTranslation();
  const { isLoading, data, error, sendRequest } = useHttp();

  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);

  // Request list aggregator
  useEffect(() => {
    sendRequest(`${apiEndpointsContext.getAggregatorURL}`, 'GET', null);
  }, []);

  // Set list aggregator
  useEffect(() => {
    if (!isLoading && !error && data) {
      if (data?.content?.aggregatorList && Array.isArray(data.content.aggregatorList)) {
        const aggregatorList = data.content.aggregatorList;

        let aggregatorListComputed;
        // 1st - check aggretors form query context is available in the aggregator list from the server
        const filteredAggregators = aggregatorList.filter((agg) => query.aggregator.includes(agg.label));

        // If some -> take them
        if (filteredAggregators.length) {
          aggregatorListComputed = filteredAggregators;
        } else {
          // Take only those at selected = true
          aggregatorListComputed = aggregatorList.filter((agg) => agg.selected);
        }

        setAggregators(aggregatorList);

        // Dispatch to query
        queryDispatch({
          type: 'SET_AGGREGATORS_FACET',          
          // Take only names
          aggregators: aggregatorListComputed.map((agg) => agg.label),
        });

      }
    }
  }, [data, error, isLoading]);

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  // Removes all facet entry selection
  const handleClearFilterClick = () => {
    // Dispatch to query
    queryDispatch({
      type: 'SET_AGGREGATORS_FACET',
      aggregators: [],
    });
    setMenuOpen(false);
  };

  // Select all facet entries
  const handleSelectAllClick = () => {
    // Dispatch to query
    queryDispatch({
      type: 'SET_AGGREGATORS_FACET',
      aggregators: aggregators.map((agg) => agg.label),
    });
    setMenuOpen(false);
  };

  const handleAggregatorClick = (agg) => {   

    let newAggregators = [];
    if (!!query.aggregator.find((a) => a === agg.label)) {
      // Unselect
      newAggregators = query.aggregator.filter((a) => a !== agg.label);
    } else {
      // Select
      newAggregators = [...query.aggregator, agg.label];
    }

    const firstLabel = aggregators[0]?.label;
    const isFirstLabelSelected = newAggregators.includes(firstLabel);

    if (isFirstLabelSelected) {
      newAggregators = newAggregators.filter(a => a !== firstLabel); 
      newAggregators = [firstLabel, ...newAggregators]; 
    }

    console.log(newAggregators)
    // Dispatch to query
    queryDispatch({
      type: 'SET_AGGREGATORS_FACET',
      aggregators: newAggregators,
    });
  };

  return show ? (
    <>
      <div className={classes.facetHeader}>
        <IconButton
          onClick={handleOpenMenu}
          aria-controls={'agregator-facet-menu'}
          aria-haspopup="true"
          aria-label={t(`Open {{ facetTitle }} facet menu`, {
            facetTitle: t(title),
          })}>
          <MoreVertIcon ref={menuAnchorRef} />
        </IconButton>
        <Menu id={'aggregator-facet-menu'} anchorEl={menuAnchorRef.current} open={menuOpen} onClose={handleCloseMenu}>
          <MenuItem onClick={handleSelectAllClick}>{t('Select All')}</MenuItem>
          <MenuItem onClick={handleClearFilterClick}>{t('Clear Filter')}</MenuItem>
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
        <List dense>
          {aggregators.map((agg) => (
            <FacetEntry
              id={agg.label}
              value={agg.label}
              selected={!!query.aggregator.find((a) => a === agg.label)}
              onClick={(e) => handleAggregatorClick(agg)}
            />
          ))}
        </List>
      ) : null}
    </>
  ) : null;
}

export default AggregatorFacet;
