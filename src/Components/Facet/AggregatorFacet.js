import {
  IconButton,
  List,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { APIEndpointsContext } from "../../Contexts/api-endpoints-context";
import { QueryContext } from "../../Contexts/query-context";
import useHttp from "../../Hooks/useHttp";
import FacetEntry from "./FacetEntry";

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    flexGrow: 1,
  },
  facetHeader: {
    display: "flex",
    alignItems: "center",
  },
  showMore: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },
}));

function AggregatorFacet({ title, show = true }) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [queryID, setQueryID] = useState(null);
  const [aggregators, setAggregators] = useState([
    {
      name: "Aggregator 1",
    },
    {
      name: "Aggregator 2",
    },
    {
      name: "Aggregator 3",
    },
  ]);

  const menuAnchorRef = useRef(null);

  const classes = useStyles();
  const { t } = useTranslation();
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();

  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { query, dispatch: queryDispatch } = useContext(QueryContext);

  // Request list aggregator
  useEffect(() => {
    let newQueryID = Math.random().toString(36).substring(2, 15);
    setQueryID(newQueryID);
    // TODO: Call right endpoint to fetch aggregators
    // sendRequest(`${apiEndpointsContext.getThemeURL}`, "GET", null, newQueryID);
  }, [apiEndpointsContext.getThemeURL, sendRequest]);

  // Set list aggregator
  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === queryID) {
      // TODO: set aggregator data
    }
  }, [data, error, isLoading, reqIdentifier, queryID, query]);

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
      type: "SET_AGGREGATORS_FACET",
      aggregators: [],
    });
    setMenuOpen(false);
  };

  // Select all facet entries
  const handleSelectAllClick = () => {
    // Dispatch to query
    queryDispatch({
      type: "SET_AGGREGATORS_FACET",
      aggregators: aggregators.map((agg) => agg.name),
    });
    setMenuOpen(false);
  };

  const handleAggregatorClick = (checked, agg) => {
    let newAggregators = [];
    if (checked) {
      newAggregators = [...query.aggregator, agg.name];
    } else {
      newAggregators = query.aggregator.filter((a) => a !== agg.name);
    }

    // Dispatch to query
    queryDispatch({
      type: "SET_AGGREGATORS_FACET",
      aggregators: newAggregators,
    });
  };

  return show ? (
    <>
      <div className={classes.facetHeader}>
        <IconButton
          onClick={handleOpenMenu}
          aria-controls={"agregator-facet-menu"}
          aria-haspopup="true"
          aria-label={t(`Open {{ facetTitle }} facet menu`, {
            facetTitle: t(title),
          })}
        >
          <MoreVertIcon ref={menuAnchorRef} />
        </IconButton>
        <Menu
          id={"aggregator-facet-menu"}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleSelectAllClick}>{t("Select All")}</MenuItem>
          <MenuItem onClick={handleClearFilterClick}>
            {t("Clear Filter")}
          </MenuItem>
        </Menu>
        <Typography color="secondary" className={classes.facetTitleText}>
          {t(title)}
        </Typography>
        <IconButton
          onClick={handleExpandClick}
          aria-label={t(
            `${expanded ? "Collapse" : "Expand"} {{ facetTitle }} facet`,
            {
              facetTitle: t(title),
            }
          )}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded ? (
        <List>
          {aggregators.map((agg) => (
            <FacetEntry
              id={agg.name}
              value={agg.name}
              selected={!!query.aggregator.find((a) => a === agg.name)}
              onClick={(e) => handleAggregatorClick(e.target.checked, agg)}
            />
          ))}
        </List>
      ) : null}
    </>
  ) : null;
}

export default AggregatorFacet;
