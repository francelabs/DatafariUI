import {
  Grid,
  makeStyles,
  Paper,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { ReactComponent as ExcelIcon } from '../../../Icons/icon_excel_file_green-24px.svg';
import { ReactComponent as PdfIcon } from '../../../Icons/icon_pdf_file_red-24px.svg';
import { ReactComponent as WordIcon } from '../../../Icons/icon_word_file_blue-24px.svg';
import { ReactComponent as PowerPointIcon } from '../../../Icons/icon_powerpointl_file_orange-24px.svg';
import { ReactComponent as ZipIcon } from '../../../Icons/icon_zip_file_orange-24px.svg';
import { ReactComponent as DefaultFileIcon } from '../../../Icons/icon_pdf_file_black-24px.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
  },
}));

const PreviewTopBar = (props) => {
  const classes = useStyles();

  const selectFileIcon = (extension) => {
    switch (extension) {
      case 'pdf':
        return PdfIcon;
      case 'doc':
      case 'docx':
      case 'docm':
        return WordIcon;
      case 'xls':
      case 'xlsx':
        return ExcelIcon;
      case 'zip':
        return ZipIcon;
      case 'ppt':
      case 'pptx':
        return PowerPointIcon;
      default:
        return DefaultFileIcon;
    }
  };

  const fileIcon = selectFileIcon(
    props.extension ? props.extension : 'default'
  );

  const prepareTitle = () => {
    let title = '';
    if (Array.isArray(props.document.title)) {
      try {
        title = decodeURIComponent(props.document.title[0]);
      } catch (e) {
        title = props.document.title[0];
      }
    } else if (
      props.document.title !== undefined &&
      props.document.title !== null
    ) {
      try {
        title = decodeURIComponent(props.document.title);
      } catch (e) {
        title = props.document.title;
      }
    }
    return title;
  };

  return (
    <Paper square elevation={0} className={classes.root}>
      <Grid container>
        <Grid item container>
          <Grid item>
            <SvgIcon
              className={classes.fileIconSvg}
              component={fileIcon}
              alt={`${props.extension} icon`}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">
              {props.document && prepareTitle()}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="caption">
            {props.document && props.document.url}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PreviewTopBar;
