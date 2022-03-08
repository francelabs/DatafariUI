import { Grid, makeStyles, Tab } from "@material-ui/core";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Modal from "../../Components/Modal/Modal";
import SearchTopMenu from "../../Components/SearchTopMenu/SearchTopMenu";
import MainTabPanel from "../../Components/TabPanel/MainTabPanel";
import {
  CLEAR_FIELDS_FACET_SELECTED,
  QueryContext,
  SET_FIELD_FACET_SELECTED,
} from "../../Contexts/query-context";
import { ResultsContext } from "../../Contexts/results-context";
import {
  SET_MASK_FIELD,
  UIConfigContext,
} from "../../Contexts/ui-config-context";
import useDatafari from "../../Hooks/useDatafari";
import "./Search.css";

// STYLES
const useStyles = makeStyles((theme) => ({
  searchGrid: {
    backgroundColor: theme.palette.background.default,
  },

  rawTab: {
    color: theme.palette.secondary.main,
  },
}));

// Tab types
const MAIN_TAB = "main";
const FACET_TAB_TYPE = "FieldFacet";
const RAW_TAB_TYPE = "Raw";

// Map tab types associated to panel component
const DEFAULT_PANEL_TABS = {
  [MAIN_TAB]: MainTabPanel,
  [FACET_TAB_TYPE]: MainTabPanel,
  [RAW_TAB_TYPE]: React.Fragment,
};

const TAB_VALUE_SEPARATOR = ";";

const Search = () => {
  useDatafari();
  const { t, i18n } = useTranslation();

  const classes = useStyles();
  const { path } = useRouteMatch();

  const { tab = MAIN_TAB } = useParams();

  const { dispatch: queryDispatch } = useContext(QueryContext);
  const { results } = useContext(ResultsContext);
  const { uiDefinition, dispatch: uiDispatch } = useContext(UIConfigContext);

  const [selectTab, setSelectTab] = useState(MAIN_TAB);
  const [panelTabs] = useState(DEFAULT_PANEL_TABS);
  const [tabs, setTabs] = useState([]);

  // Build tabs from results and config
  useEffect(() => {
    const makeTabs = [
      <Tab key={MAIN_TAB} value={MAIN_TAB} label={t("All Content")} />,
    ];

    // Build other tabs
    if (uiDefinition.center && Array.isArray(uiDefinition.center.tabs)) {
      uiDefinition.center.tabs.forEach((tab) => {
        switch (tab.type) {
          case FACET_TAB_TYPE:
            const { type, field, max = -1 } = tab;

            if (results.fieldFacets[field]) {
              const arrayLength =
                max > -1
                  ? Math.min(max * 2, results.fieldFacets[field].length)
                  : results.fieldFacets[field].length;

              for (let i = 0; i < arrayLength; i += 2) {
                const value = results.fieldFacets[field][i];
                const count = results.fieldFacets[field][i + 1];

                makeTabs.push(
                  <Tab
                    key={type + field + value}
                    value={formatTabValue(type, field, value)}
                    label={
                      value +
                      (count
                        ? ` (${formatNumberToLocale(count, i18n.language)})`
                        : "")
                    }
                  />
                );
              }
            }
            break;

          case RAW_TAB_TYPE: {
            const { type, label, url } = tab;
            makeTabs.push(
              <Tab
                key={type + label + url}
                value={formatTabValue(type, label, url)}
                label={label}
                className={classes.rawTab}
              />
            );
            break;
          }
          default:
            break;
        }
      });
    }

    setTabs(makeTabs.filter((tab) => React.isValidElement(tab)));
  }, [results, uiDefinition, i18n, classes.rawTab, t, queryDispatch]);

  const onSelectTab = (tab) => {
    // Set filter for other tab then main
    if (tab === MAIN_TAB) {
      // Reset all filters for each field from tabs
      const fields = uiDefinition.center.tabs
        .filter((tab) => tab.type === FACET_TAB_TYPE)
        .map((tab) => tab.field);

      queryDispatch({
        type: CLEAR_FIELDS_FACET_SELECTED,
        facetIds: fields,
      });

      // Unmask field
      uiDispatch({
        type: SET_MASK_FIELD,
        field: "",
      });

      setSelectTab(MAIN_TAB);
    } else {
      const [type, ...arraySplit] = tab.split(TAB_VALUE_SEPARATOR);

      if (type) {
        switch (type) {
          case FACET_TAB_TYPE: {
            const [field, value] = arraySplit;
            queryDispatch({
              type: SET_FIELD_FACET_SELECTED,
              facetId: field,
              selected: [value],
            });

            // Mask the given field from facet filters layout
            uiDispatch({
              type: SET_MASK_FIELD,
              field,
            });

            setSelectTab(formatTabValue(type, field, value));

            break;
          }
          case RAW_TAB_TYPE: {
            const [, url] = arraySplit;
            window.open(url, "_blank");
            break;
          }
          default:
            break;
        }
      }
    }
  };

  const TabComponent = panelTabs[tab];

  return (
    <Fragment>
      <SearchTopMenu
        tabs={tabs}
        selectedTab={selectTab}
        onSelectTab={onSelectTab}
      />
      <Grid container className={classes.searchGrid}>
        {TabComponent && <TabComponent />}
      </Grid>
      <Switch>
        <Route path={`${path}/alerts`}>
          <Modal />
        </Route>
      </Switch>
    </Fragment>
  );
};

export default Search;

function formatNumberToLocale(n, language) {
  // Slice language for code that have 2 codes like pt_br. Only takes 'pt'
  return n ? parseInt(n).toLocaleString(language.slice(0, 2)) : "";
}

function formatTabValue(...props) {
  return props.reduce(
    (acc, current, index) =>
      index === 0 ? current : acc + TAB_VALUE_SEPARATOR + current,
    ""
  );
}
