import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

import SafeComponent from '../../SafeComponent/SafeComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  highlighted: {
    backgroundColor: 'yellow',
    borderRadius: '5px',
  },
  current: {
    border: '1px solid',
    backgroundColor: 'orange',
  },
  content: {
    whiteSpace: 'pre-wrap',
  },
}));

const PreviewContent = (props) => {
  const classes = useStyles();

  const prepareHighlighting = () => {
    if (props.textSplit) {
      if (props.highlighting) {
        const highlighting = [];
        for (const [key, value] of Object.entries(props.highlighting)) {
          if (value.numOccurence > 0 && value.highlighted) {
            highlighting.push({
              index: 0,
              regex: new RegExp(`\\b${key}\\b`, 'gi'),
              ...value,
            });
          }
        }

        let result = props.textSplit.join('')
          .replace(/\uFFFD/g, ' ')
          .replace(/(\s*\n){2,}/gm, '\n\n');

        highlighting.forEach((highlightTerm) => {
          result = result.replace(highlightTerm.regex, (match) => {
            const className = highlightTerm.index === highlightTerm.highlightedIndex
              ? `${classes.highlighted} ${classes.current}`
              : classes.highlighted;
            highlightTerm.index += 1;
            return `<span class="${className}">${match}</span>`;
          });
        });

        return result;
      }

      return props.textSplit
        .join('')
        .replace(/\uFFFD/g, ' ')
        .replace(/(\s*\n){2,}/gm, '\n\n');
    }
    return '';
  };

  return (
    <Paper className={classes.root}>
      <Typography className={classes.content}>
        <SafeComponent htmlContent={prepareHighlighting()} />       
      </Typography>
    </Paper>
  );
};

export default PreviewContent;
