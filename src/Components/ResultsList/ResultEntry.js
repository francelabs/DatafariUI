import React, { useContext } from 'react';
import {
  makeStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  SvgIcon,
  ListItemSecondaryAction,
  Link,
  Tooltip,
} from '@material-ui/core';

import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { ReactComponent as ExcelIcon } from '../../Icons/icon_excel_file_green-24px.svg';
import { ReactComponent as PdfIcon } from '../../Icons/icon_pdf_file_red-24px.svg';
import { ReactComponent as WordIcon } from '../../Icons/icon_word_file_blue-24px.svg';
import { ReactComponent as PowerPointIcon } from '../../Icons/icon_powerpointl_file_orange-24px.svg';
import { ReactComponent as ZipIcon } from '../../Icons/icon_zip_file_orange-24px.svg';
import { ReactComponent as DefaultFileIcon } from '../../Icons/icon_pdf_file_black-24px.svg';
import { ReactComponent as PreviewIcon } from '../../Icons/preview-black-18dp.svg';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../Contexts/user-context';

const useStyles = makeStyles((theme) => ({
  resultContainer: {
    wordWrap: 'break-word',
    minHeight: '7rem',
  },

  previewIcon: {
    display: 'block',
    position: 'absolute',
    top: '3.75rem',
    left: theme.spacing(1),
  },
  fileIconSvg: {
    fontSize: '2.5rem',
  },
  previewIconSvg: {
    fontSize: '2rem',
  },
  url: {
    fontStyle: 'italic',
  },
  urlContainer: {
    paddingTop: '0.5rem',
  },
  bookmarkAction: {
    top: theme.spacing(1),
    transform: 'none',
  },
  moreLikeThis: {
    float: 'right',
  },

  highlight: {
    fontWeight: 'bold',
  },
}));

const ResultEntry = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { state: userState } = useContext(UserContext);

  /*
   * Decodes HTML entities expressed as decimal or hexadecimal Unicode references.
   * Used to decode html entities from the highlighted content returned by Solr.
   */
  const decode = (text) => {
    return text.replace(/&#x?([\dA-F]+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  };

  const prepareSnippet = () => {
    let snippet = t('Document content not indexed');
    if (!props.emptied) {
      snippet = Object.keys(props.highlighting).reduce((accumulator, hlKey) => {
        return (
          accumulator +
          props.highlighting[hlKey].reduce((innerAccu, value) => {
            return innerAccu + value;
          }, '')
        );
      }, '');

      if (snippet === '') {
        snippet = props.preview_content[0].substring(0, 200);
      } else {
        const highlightExtract = /<span class="em">(.*?)<\/span>/gm;
        let match;
        let lastIndex = 0;
        const results = [];
        while ((match = highlightExtract.exec(snippet)) !== null) {
          if (match.index !== lastIndex) {
            results.push(decode(snippet.substring(lastIndex, match.index)));
          }
          results.push(
            <em className={classes.highlight}>{decode(match[1])}</em>
          );
          lastIndex = highlightExtract.lastIndex;
        }
        results.push(decode(snippet.substring(lastIndex, snippet.length)));
        snippet = <span>{results}</span>;
      }
    }
    return snippet;
  };

  const prepareTitle = () => {
    let title = '';
    if (Array.isArray(props.title)) {
      try {
        title = decodeURIComponent(props.title[0]);
      } catch (e) {
        title = props.title[0];
      }
    } else if (props.title !== undefined && props.title !== null) {
      try {
        title = decodeURIComponent(props.title);
      } catch (e) {
        title = props.title;
      }
    }
    if (title.length > 50) {
      title = (
        <Tooltip title={title} placement="right" aria-label={title}>
          <span>
            {title.substring(0, 15) +
              '...' +
              title.substring(title.length - 15)}
          </span>
        </Tooltip>
      );
    }
    return title;
  };

  const prepareUrl = () => {
    var maxSize = 70;
    let result = props.url;
    if (props.url.length > maxSize) {
      const fileName = props.url.substring(props.url.lastIndexOf('/') + 1);
      if (fileName.length > maxSize - 15) {
        result =
          props.url.substring(0, 15) +
          '...' +
          fileName.substring(fileName.length - 1 - (maxSize - 15));
      } else {
        result =
          props.url.substring(
            0,
            props.url.lastIndexOf('/') - props.url.length + maxSize
          ) +
          '...' +
          props.url.substring(props.url.lastIndexOf('/'));
      }
    }
    return result;
  };

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

  const fileIcon = selectFileIcon(props.extension);

  return (
    <ListItem
      alignItems="flex-start"
      key={props.url}
      className={classes.resultContainer}
    >
      <ListItemIcon>
        <SvgIcon
          className={classes.fileIconSvg}
          component={fileIcon}
          alt={`${props.extension} icon`}
        />
        <IconButton aria-label="preview" className={classes.previewIcon}>
          <SvgIcon
            className={classes.previewIconSvg}
            component={PreviewIcon}
            alt="preview icon"
          />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        primary={prepareTitle()}
        secondary={
          <>
            <div>
              <span>{prepareSnippet()}</span>
            </div>
            <div className={classes.urlContainer}>
              <span className={classes.url}>{prepareUrl()}</span>
            </div>
            <div>
              <span>Source: {props['repo_source']}</span>
              <span className={classes.moreLikeThis}>
                <Link
                  color="secondary"
                  href="#"
                  onClick={(event) => event.preventDefault()}
                >
                  {t('More Like This')}&gt;&gt;
                </Link>
              </span>
            </div>
          </>
        }
        secondaryTypographyProps={{ component: 'div' }}
      />
      {userState.user && (
        <ListItemSecondaryAction className={classes.bookmarkAction}>
          <IconButton
            edge="end"
            aria-label="bookmark"
            onClick={props.bookmarkClickCallback}
          >
            {props.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default ResultEntry;
