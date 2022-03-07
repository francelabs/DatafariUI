import { Grid, Hidden, makeStyles } from "@material-ui/core";
import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import DateFacetCustom from "../DateFacetCustom/DateFacetCustom";
import FieldFacet from "../Facet/FieldFacet";
import QueryFacet from "../Facet/QueryFacet";
import HierarchicalFacet from "../HierarchicalFacet/HierarchicalFacet";
import Pager from "../Pager/Pager";
import ResultsList from "../ResultsList/ResultsList";
import SearchInformation from "../SearchInformation/SearchInformation";
import Spinner from "../Spinner/Spinner";
import { UIConfigContext } from "../../Contexts/ui-config-context";

const allowedElementTypes = [
  "FieldFacet",
  "QueryFacet",
  "DateFacetCustom",
  "HierarchicalFacet",
  "SearchInformation",
  "ResultsList",
];

const useStyles = makeStyles((theme) => ({
  facetsSection: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "5px",
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: "280px",
  },

  pagerContainer: {
    margin: theme.spacing(2),
    float: "right",

    [theme.breakpoints.down("sm")]: {
      margin: 0,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },

  facetDivider: {
    "&:last-of-type": {
      display: "none",
    },
  },
}));

function MainTabPanel() {
  const { uiDefinition, maskFieldFacet, isLoading } =
    useContext(UIConfigContext);

  const classes = useStyles();
  const { t } = useTranslation();

  const buildFieldFacet = useCallback(
    (element) => {
      let result = null;
      if (
        element.op &&
        element.title &&
        element.field &&
        element.field !== maskFieldFacet
      ) {
        const minShow = element.minShow ? element.minShow : 3;
        const maxShow = element.maxShow ? element.maxShow : 5;
        return (
          <FieldFacet
            title={t(element.title)}
            field={element.field}
            op={element.op}
            variant={element.variant}
            show={element.show}
            dividerClassName={classes.facetDivider}
            minShow={minShow}
            maxShow={maxShow}
          />
        );
      }
      return result;
    },
    [classes.facetDivider, maskFieldFacet, t]
  );

  const buildQueryFacet = useCallback(
    (element, childrenBuilder) => {
      let result = null;
      if (element.id && element.title && element.queries && element.labels) {
        const minShow = element.minShow ? element.minShow : 3;
        const maxShow = element.maxShow ? element.maxShow : 5;
        const multipleSelect = element.multipleSelect
          ? element.multipleSelect
          : false;
        return (
          <QueryFacet
            title={t(element.title)}
            queries={element.queries}
            labels={element.labels.map((label) => t(label))}
            id={element.id}
            dividerClassName={classes.facetDivider}
            minShow={minShow}
            maxShow={maxShow}
            multipleSelect={multipleSelect}
          >
            {element.children &&
              Array.isArray(element.children) &&
              element.children
                .map((element) => childrenBuilder(element))
                .filter((element) => React.isValidElement(element))}
          </QueryFacet>
        );
      }
      return result;
    },
    [classes.facetDivider, t]
  );

  const buildHierarchicalFacet = useCallback(
    (element) => {
      if (element.separator && element.title && element.field) {
        return (
          <HierarchicalFacet
            field={element.field}
            title={t(element.title)}
            separator={element.separator}
          />
        );
      }
      return null;
    },
    [t]
  );

  const buildSearchInformation = useCallback((element) => {
    return <SearchInformation data={element.data} />;
  }, []);

  const buildResultList = useCallback((element) => {
    return <ResultsList data={element.data} />;
  }, []);

  const createElementFromParameters = useCallback(
    (element) => {
      if (element.type && allowedElementTypes.includes(element.type)) {
        switch (element.type) {
          case "FieldFacet":
            return buildFieldFacet(element);
          case "QueryFacet":
            return buildQueryFacet(element, createElementFromParameters);
          case "DateFacetCustom":
            return <DateFacetCustom />;
          case "HierarchicalFacet":
            return buildHierarchicalFacet(element);
          case "SearchInformation":
            return buildSearchInformation(element);
          case "ResultsList":
            return buildResultList(element);
          default:
            return null;
        }
      }
      return null;
    },
    [
      buildFieldFacet,
      buildHierarchicalFacet,
      buildQueryFacet,
      buildResultList,
      buildSearchInformation,
    ]
  );

  const buildContentFor = useCallback(
    (part) => {
      let result = null;
      if (part && Array.isArray(part) && part.length !== 0) {
        result = part
          .map((element) => {
            return createElementFromParameters(element);
          })
          .filter((element) => React.isValidElement(element));
      }
      return result;
    },
    [createElementFromParameters]
  );

  return isLoading && !uiDefinition ? (
    <Spinner />
  ) : (
    <>
      <Grid item md={4} lg>
        <Hidden smDown>
          <div className={classes.facetsSection}>
            {buildContentFor(uiDefinition.left)}
          </div>
        </Hidden>
      </Grid>
      <Grid item sm={12} md={8}>
        {buildContentFor(uiDefinition.center.main)}
        <div className={classes.pagerContainer}>
          <Pager />
        </div>
      </Grid>
      <Grid item lg={1} />
    </>
  );
}

export default MainTabPanel;
