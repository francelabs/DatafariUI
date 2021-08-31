import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

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
        let display = props.textSplit.map((textPart) => {
          let result = textPart
            .replace(/\uFFFD/g, ' ')
            .replace(/(\s*\n){2,}/gm, '\n\n');
          highlighting.forEach((highlightTerm) => {
            if (textPart.match(highlightTerm.regex)) {
              if (highlightTerm.index === highlightTerm.highlightedIndex) {
                result = (
                  <span
                    className={[classes.highlighted, classes.current].join(' ')}
                  >
                    {textPart}
                  </span>
                );
              } else {
                result = (
                  <span className={classes.highlighted}>{textPart}</span>
                );
              }
              highlightTerm.index = highlightTerm.index + 1;
            }
          });
          return result;
        });
        return display;
      }
      return props.textSplit
        .join('')
        .replace(/\uFFFD/g, ' ')
        .replace(/(\s*\n){2,}/gm, '\n\n');
    }
    return null;
  };

  return (
    <Paper className={classes.root}>
      <Typography className={classes.content}>
        {prepareHighlighting()}
      </Typography>
    </Paper>
  );
};

export default PreviewContent;
