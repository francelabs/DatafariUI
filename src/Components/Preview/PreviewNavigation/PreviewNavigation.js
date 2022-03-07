import { Button, Grid, Link, makeStyles, Paper } from "@material-ui/core";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { APIEndpointsContext } from "../../../Contexts/api-endpoints-context";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    marginLeft: 0,
    marginRight: 0,
  },

  buttonContainer: {
    marginRight: theme.spacing(2),
  },
}));

const PreviewNavigation = (props) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const baseURL = apiEndpointsContext.datafariBaseURL;
  const classes = useStyles();
  const { t } = useTranslation();
  const location = useLocation();

  const prepareNextLink = () => {
    if (props.nextDocument) {
      const queryParams = new URLSearchParams(location.search);
      const docPos = parseInt(queryParams.get("docPos")) + 1;
      queryParams.set("docPos", docPos);
      queryParams.set("docId", encodeURIComponent(props.nextDocument.id));
      queryParams.set("action", "PREVIEW_CHANGE_DOC");
      return queryParams;
    }
    return null;
  };

  const preparePreviousLink = () => {
    if (props.previousDocument) {
      const queryParams = new URLSearchParams(location.search);
      const docPos = parseInt(queryParams.get("docPos")) - 1;
      queryParams.set("docPos", docPos);
      queryParams.set("docId", encodeURIComponent(props.previousDocument.id));
      queryParams.set("action", "PREVIEW_CHANGE_DOC");
      return queryParams;
    }
    return null;
  };

  const prepareOpenFromSource = () => {
    if (props.document) {
      const url = new URL(`${baseURL}/URL`, window.location.href);
      const locationParams = new URLSearchParams(location.search);
      const queryParams = new URLSearchParams();
      queryParams.set("action", "OPEN_FROM_PREVIEW");
      queryParams.set("id", locationParams.get("id"));
      url.search = `?${queryParams.toString()}&url=${decodeURIComponent(
        props.document.url
      )}`;
      return url;
    }
    return null;
  };

  return (
    <div className={classes.root}>
      <Grid container justify="flex-start">
        {props.document && (
          <Grid item>
            <Paper className={classes.buttonContainer}>
              <Button
                color="secondary"
                startIcon={<OpenInNewIcon aria-hidden="true" color="action" />}
              >
                <Link
                  href={prepareOpenFromSource().toString()}
                  target="_blank"
                  color="secondary"
                >
                  {t("Open Document from Source")}
                </Link>
              </Button>
            </Paper>
          </Grid>
        )}
        {props.previousDocument && (
          <Grid item>
            <Paper className={classes.buttonContainer}>
              <Button
                color="secondary"
                startIcon={
                  <SkipPreviousIcon aria-hidden="true" color="action" />
                }
              >
                <Link
                  component={RouterLink}
                  to={`/preview?${preparePreviousLink().toString()}`}
                  color="secondary"
                >
                  {t("Previous Result")}
                </Link>
              </Button>
            </Paper>
          </Grid>
        )}
        {props.nextDocument && (
          <Grid item>
            <Paper className={classes.buttonContainer}>
              <Button
                color="secondary"
                startIcon={<SkipNextIcon aria-hidden="true" color="action" />}
              >
                <Link
                  component={RouterLink}
                  to={`/preview?${prepareNextLink().toString()}`}
                  color="secondary"
                >
                  {t("Next Result")}
                </Link>
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default PreviewNavigation;
