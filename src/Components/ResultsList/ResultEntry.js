import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Avatar,
} from '@material-ui/core';

import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { ReactComponent as PreviewIcon } from '../../Icons/preview-black-18dp.svg';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../Contexts/user-context';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import { QueryContext } from '../../Contexts/query-context';

const useStyles = makeStyles((theme) => ({
  resultContainer: {
    wordWrap: 'break-word',
    minHeight: '7rem',
  },

  previewIcon: {
    display: 'block',
    position: 'absolute',
    top: '3.75rem',
    left: theme.spacing(0),
  },
  fileIcon: {
    height: '24px',
    width: '24px',
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

const extension_list = [
  'ai',
  'asf',
  'avi',
  'bib',
  'bin',
  'csv',
  'deb',
  'default',
  'djvu',
  'dmg',
  'doc',
  'docx',
  'dwf',
  'dwg',
  'flac',
  'flv',
  'gif',
  'gz',
  'html',
  'indd',
  'iso',
  'jpg',
  'log',
  'm4v',
  'midi',
  'mkv',
  'mov',
  'mp4',
  'mpeg',
  'mpg',
  'odp',
  'ods',
  'odt',
  'oga',
  'ogg',
  'ogv',
  'pdf',
  'pds',
  'png',
  'ppt',
  'pptx',
  'ram',
  'ra',
  'rm',
  'rpm',
  'rv',
  'skp',
  'spx',
  'sql',
  'tar',
  'tex',
  'tgz',
  'txt',
  'vob',
  'wmv',
  'xls',
  'xml',
  'xpi',
  'xsl',
  'xslx',
  'zip',
];

const ResultEntry = (props) => {
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const classes = useStyles();
  const { t } = useTranslation();
  const { state: userState } = useContext(UserContext);
  const { buildSearchQueryString } = useContext(QueryContext);

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

  const prepareDocURL = () => {
    return `${apiEndpointsContext.docRedirectURL}?url=${props.url}&id=${props.qid}&q=${props.q}&position=${props.position}`;
  };

  const preparePreviewURL = () => {
    let request = buildSearchQueryString();
    return `/preview?docPos=${props.position}&docId=${props.id}&${request}&action=OPEN_PREVIEW`;
  };

  const selectFileIcon = (extension) => {
    if (extension_list.indexOf(extension) !== -1) {
      return `${process.env.PUBLIC_URL}/images/file_icons/icon_square_${extension}_v01-24px.png`;
    } else {
      return `${process.env.PUBLIC_URL}/images/file_icons/icon_square_default_v01-24px.png`;
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
        <Avatar
          className={classes.fileIcon}
          variant="square"
          src={fileIcon}
          alt={`${props.extension} icon`}
        />
        <Link component={RouterLink} to={preparePreviewURL()} target="new">
          <IconButton aria-label="preview" className={classes.previewIcon}>
            <SvgIcon
              className={classes.previewIconSvg}
              component={PreviewIcon}
              alt="preview icon"
            />
          </IconButton>
        </Link>
      </ListItemIcon>
      <ListItemText
        primary={
          <Link color="secondary" href={prepareDocURL()} target="new">
            {prepareTitle()}
          </Link>
        }
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
              {/*               
              <span className={classes.moreLikeThis}>
                <Link
                  color="secondary"
                  component={RouterLink}
                  to={preparePreviewURL()}
                >
                  {t('More Like This')}&gt;&gt;
                </Link>
              </span> */}
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
