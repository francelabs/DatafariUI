import { Button, Grid, Link, makeStyles, Paper } from '@material-ui/core';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { UIConfigContext } from '../../../Contexts/ui-config-context';

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
  const { uiDefinition } = useContext(UIConfigContext);
  const classes = useStyles();
  const { t } = useTranslation();
  const location = useLocation();

  const prepareNextLink = () => {
    if (props.nextDocument) {
      const queryParams = new URLSearchParams(location.search);
      const docPos = parseInt(queryParams.get('docPos')) + 1;
      queryParams.set('docPos', docPos);
      queryParams.set('docId', encodeURIComponent(props.nextDocument.id));
      queryParams.set('action', 'PREVIEW_CHANGE_DOC');
      return queryParams;
    }
    return null;
  };

  const preparePreviousLink = () => {
    if (props.previousDocument) {
      const queryParams = new URLSearchParams(location.search);
      const docPos = parseInt(queryParams.get('docPos')) - 1;
      queryParams.set('docPos', docPos);
      queryParams.set('docId', encodeURIComponent(props.previousDocument.id));
      queryParams.set('action', 'PREVIEW_CHANGE_DOC');
      return queryParams;
    }
    return null;
  };

  const prepareOpenFromSource = () => {
    let docURL=null;

    if (!props.document) {
      return null;
    }

    const directLink = uiDefinition.center.orginalDocURL;
    
    // If direct link is active, search for the good URL prefix to apply the real document URL or apply to all URL
    if (directLink.active){
      let forPrefixURLs = directLink.forPrefixURLs;

      if (directLink.forAll) {
        docURL = props.document.url;
      } else {
        if (forPrefixURLs != null && forPrefixURLs.length > 0){
          let i = 0;
          while (docURL == null && i < forPrefixURLs.length){
            if (props.document.url.startsWith(forPrefixURLs[i])) {
              docURL = props.document.url;
              // The "file" protocol must be replaced by "datafari", i.e.: file:// => datafari://
              // It's because "file" protocol is always blocked by Windows
              // "datafari" protocol must be used with register configuration:
              // see our documentation here: https://datafari.atlassian.net/wiki/x/AYA_1Q?atlOrigin=eyJpIjoiODU3NzlmODA3MzdlNGU4ODgwOTFmZWI4NmJiMDgyYzMiLCJwIjoiYyJ9
              docURL = docURL.replace("file", "datafari");
            }
            i++;
          }
        }
      }
    }

    // if direct link is not active or the URL prefix is not found, apply the this URL formatting
    if (docURL == null) {
      const locationParams = new URLSearchParams(location.search);
      const queryParams = new URLSearchParams();
      queryParams.set('action', 'OPEN_FROM_PREVIEW');
      queryParams.set('id', locationParams.get('id'));

      docURL = `${props.document.click_url}&${queryParams.toString()}`;
    }
    return docURL;
  };

  return (
    <div className={classes.root}>
      <Grid container justify="flex-start">
        {props.document && (
          <Grid item>
            <Paper className={classes.buttonContainer}>
              <Button
                color="secondary"
                startIcon={<OpenInNewIcon aria-hidden="true" color="action" />}>
                <Link href={prepareOpenFromSource().toString()} target="_blank" color="secondary">
                  {t('Open Document from Source')}
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
                startIcon={<SkipPreviousIcon aria-hidden="true" color="action" />}>
                <Link
                  component={RouterLink}
                  to={`/preview?${preparePreviousLink().toString()}`}
                  color="secondary">
                  {t('Previous Result')}
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
                startIcon={<SkipNextIcon aria-hidden="true" color="action" />}>
                <Link
                  component={RouterLink}
                  to={`/preview?${prepareNextLink().toString()}`}
                  color="secondary">
                  {t('Next Result')}
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
