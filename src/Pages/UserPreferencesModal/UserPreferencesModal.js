import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import ArrowDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DialogTitle from "../../Components/DialogTitle/DialogTitle";
import { APIEndpointsContext } from "../../Contexts/api-endpoints-context";
import { UIConfigContext } from "../../Contexts/ui-config-context";
import useHttp from "../../Hooks/useHttp";
import { UserContext } from "../../Contexts/user-context";

const useStyles = makeStyles((theme) => ({
  content: {
    display: "grid",
    gap: "1em",
  },

  title: {
    paddingBottom: "0.5em",
  },

  facetsContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  },

  listOrder: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },

  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const UserPreferencesModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { isLoading, data, error, sendRequest } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const { defaultUiDefinition } = useContext(UIConfigContext);
  const { state: userState, actions } = useContext(UserContext);
  const { user = { userUi: {} } } = userState.user;

  // States
  const [facetsPosition, setFacetPosition] = useState(
    user?.userUi.direction || defaultUiDefinition.direction || "ltr" // default is ltr
  );
  const [leftFacetsOrder, setLeftFacetOrder] = useState(
    user?.userUi.left || defaultUiDefinition.left || []
  );
  const [rightFacetsOrder, setRightFacetsOrder] = useState(
    user?.userUi.right || defaultUiDefinition.right || []
  );

  const [sources, setSources] = useState([]);

  useEffect(() => {
    let newQueryID = Math.random().toString(36).substring(2, 15);
    sendRequest(
      `${apiEndpointsContext.searchURL}/select?q=*:*&facet.field=repo_source&facet=true`,
      "GET",
      null,
      newQueryID
    );
  }, [apiEndpointsContext.searchURL, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      setSources(formatSource(data));
    }
  }, [isLoading, data, error]);

  function formatSource(data) {
    const { facet_counts } = data;

    return (
      facet_counts?.facet_fields?.repo_source.filter(
        (source, index) => index % 2 === 0
      ) || []
    );
  }

  const handleFacetLocationChange = ({ target: { value = "" } }) => {
    setFacetPosition(value);
  };

  const handleEntityOrder = (entity, entities, stateCallback, isUp) => {
    const facetIndex = entities.findIndex((f) => entity === f);
    entities.splice(facetIndex, 1);
    entities.splice(
      isUp
        ? Math.max(facetIndex - 1, 0)
        : Math.min(facetIndex + 1, entities.length),
      0,
      entity
    );
    stateCallback([...entities]);
  };

  const handleChangeFacetPosition = (
    facet,
    source,
    setSource,
    target,
    setTarget
  ) => {
    setSource(source.filter((f) => f !== facet));
    setTarget([...target, facet]);
  };

  const handleReset = () => {
    // Reset from uiDefinition values
    setFacetPosition(defaultUiDefinition.direction || "ltr");
    setLeftFacetOrder(defaultUiDefinition.left || []);
    setRightFacetsOrder(defaultUiDefinition.right || []);
    setSources(defaultUiDefinition.sources || formatSource(data));
  };

  const handleClose = useCallback(() => {
    actions.updateUserUiDefinition({
      direction: facetsPosition,
      left: leftFacetsOrder,
      right: rightFacetsOrder,
      sources,
    });
    props.onClose();
  }, [
    props,
    actions,
    facetsPosition,
    leftFacetsOrder,
    rightFacetsOrder,
    sources,
  ]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth="md"
      className={classes.dialog}
    >
      <DialogTitle onClose={props.onClose}>{t("User Preferences")}</DialogTitle>
      <Divider />
      <DialogContent>
        <div className={classes.content}>
          {/* FACETS POSITION */}
          <div>
            <Typography color="secondary">{t("Facets position")}</Typography>
            <RadioGroup
              aria-label="facet-location"
              name="facet-location"
              value={facetsPosition}
              onChange={handleFacetLocationChange}
            >
              <FormControlLabel
                value="ltr"
                control={<Radio />}
                label={t("Left")}
              />
              <FormControlLabel
                value="rtl"
                control={<Radio />}
                label={t("Right")}
              />
            </RadioGroup>
          </div>

          {/* FACETS ORDER */}
          <div className={classes.facetsContent}>
            {/* LEFT FACETS ORDER */}
            <div>
              <Typography color="secondary" className={classes.title}>
                {t("Left facets order")}
              </Typography>

              {leftFacetsOrder.map((facet, index) => (
                <div className={classes.listOrder}>
                  <div key={facet.field}>
                    {index + 1} - {t(facet.title)}{" "}
                  </div>
                  <div>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEntityOrder(
                          facet,
                          leftFacetsOrder,
                          setLeftFacetOrder,
                          true
                        )
                      }
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEntityOrder(
                          facet,
                          leftFacetsOrder,
                          setLeftFacetOrder
                        )
                      }
                    >
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleChangeFacetPosition(
                          facet,
                          leftFacetsOrder,
                          setLeftFacetOrder,
                          rightFacetsOrder,
                          setRightFacetsOrder
                        )
                      }
                    >
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>

            {/* RIFHT FACETS ORDER */}
            <div>
              <Typography color="secondary" className={classes.title}>
                {t("Right facets order")}
              </Typography>

              {rightFacetsOrder.map((facet, index) => (
                <div className={classes.listOrder}>
                  <div key={facet.field}>
                    {index + 1} - {t(facet.title)}{" "}
                  </div>
                  <div>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEntityOrder(
                          facet,
                          rightFacetsOrder,
                          setRightFacetsOrder,
                          true
                        )
                      }
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEntityOrder(
                          facet,
                          rightFacetsOrder,
                          setRightFacetsOrder
                        )
                      }
                    >
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleChangeFacetPosition(
                          facet,
                          rightFacetsOrder,
                          setRightFacetsOrder,
                          leftFacetsOrder,
                          setLeftFacetOrder
                        )
                      }
                    >
                      <ArrowLeftIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOURCES */}
          <div>
            <Typography color="secondary" className={classes.title}>
              {t("Sources order")}
            </Typography>
            <div className={classes.listOrder}>
              <div className={classes.listOrder}>
                {sources.map((source, index) => (
                  <>
                    <div key={source}>
                      {index + 1} - {t(source)}{" "}
                    </div>
                    <div>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEntityOrder(source, sources, setSources, true)
                        }
                      >
                        <ArrowUpIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEntityOrder(source, sources, setSources)
                        }
                      >
                        <ArrowDownIcon />
                      </IconButton>
                    </div>
                  </>
                ))}
              </div>
              <div />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleReset}
          color="primary"
          variant="contained"
          size="small"
        >
          {t("Reset")}
        </Button>
        <Button
          onClick={handleClose}
          color="secondary"
          variant="contained"
          size="small"
        >
          {t("Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPreferencesModal;
