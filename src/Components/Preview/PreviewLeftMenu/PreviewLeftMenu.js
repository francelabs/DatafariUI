import { makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import PreviewProperties from '../Properties/PreviewProperties';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const PreviewLeftMenu = (props) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <PreviewProperties document={props.document} />
    </Paper>
  );
};

export default PreviewLeftMenu;
