import { Divider, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import PreviewSearchedTerms from '../SearchedTerms/PreviewSearchedTerms';
import PreviewShare from '../Share/PreviewShare';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const PreviewRightMenu = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <PreviewShare document={props.document} />
      <Divider />
      <PreviewSearchedTerms
        highlighting={props.highlighting}
        dispatchHighlighting={props.dispatchHighlighting}
      />
    </Paper>
  );
};

export default PreviewRightMenu;
