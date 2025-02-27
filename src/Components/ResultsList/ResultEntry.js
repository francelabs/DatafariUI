import { Avatar, IconButton, Link, ListItem, ListItemIcon, ListItemText, makeStyles, Tooltip } from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import { QueryContext } from '../../Contexts/query-context';
import { UserContext } from '../../Contexts/user-context';
import { UIConfigContext } from '../../Contexts/ui-config-context';

const useStyles = makeStyles((theme) => ({
  resultContainer: {
    wordWrap: 'break-word',
    alignItems: 'normal',
    paddingLeft: 0,

    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },

  previewIcon: {
    padding: 0,
  },
  fileIcon: {
    height: '24px',
    width: '24px',
    margin: '10px 0px',

    [theme.breakpoints.down('sm')]: {
      margin: '5px 0px',
    },
  },
  previewIconSvg: {
    marginBottom: 15,
    fontSize: '2rem',

    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25rem',
    },
  },
  url: {
    fontStyle: 'italic',
  },
  urlContainer: {
    paddingTop: '0.5rem',
    wordBreak: 'break-all',
  },
  bookmarkAction: {
    transform: 'none',

    [theme.breakpoints.down('sm')]: {
      '& button': {
        padding: '12px 12px 0 0',
      },
    },
  },
  moreLikeThis: {
    float: 'right',
  },

  highlight: {
    fontWeight: 'bold',
  },

  iconsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',

    [theme.breakpoints.down('sm')]: {
      minWidth: 35,

      '& img': {
        width: 16,
        height: 16,
      },
    },
  },
}));

// List of extensions for which a dedicated file icon exists
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

const dataNames = {
  title: 'title',
  url: 'url',
  logo: 'logo',
  previewButton: 'previewButton',
  snippet: 'extract',
};

const ResultEntry = (props) => {
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const { uiDefinition } = useContext(UIConfigContext);
  const maxTitleSize = uiDefinition.center.main[2].maxTitleSize;
  const truncTitleSize = maxTitleSize/2;

  const classes = useStyles();
  const { t } = useTranslation();

  const { state: userState } = useContext(UserContext);
  const { buildSearchQueryString } = useContext(QueryContext);

  const data = Array.isArray(props.data) ? props.data : [];
  const docLinkTarget = props.openDocInNewTab ? '_blank' : undefined;

  /*
   * Decodes HTML entities expressed as decimal or hexadecimal Unicode references.
   * Used to decode html entities from the highlighted content returned by Solr.
   * Also remove the replacement character (question mark in a losange) from the
   * the exerpt of text.
   */
  const decode = (text) => {
    const htmlEntities = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&apos;': "'",
  };

  return text
      .replace(/&#x?([\dA-Fa-f]+);/g, (match, dec) => {
          // if we have the sequence of characters "&#x27;" in "text", "dec" will be "27". It should be 0x27 to be
          // decoded with  String.fromCharCode()
          dec="0x"+dec;
          return String.fromCharCode(dec);
      })
      .replace(/&[a-z]+;/g, match => htmlEntities[match] || match)
      .replace(/\uFFFD/g, '');
  };

  /*
   * Prepare and formats the text to be shown as snippet
   */
  const prepareSnippet = () => {
    let snippet = t('Document content not indexed');
    if (!props.emptied) {
      snippet = Object.keys(props.highlighting).reduce((accumulator, hlKey) => {
        return (
          accumulator +
          props.highlighting[hlKey].reduce((innerAccu, value) => {
            let formattedValue = value.replace(/\uFFFD/g, ' ').replace(/(\s*\n){2,}/gm, '\n\n');
            return innerAccu + formattedValue;
          }, '')
        );
      }, '');

      if (snippet === '') {
        snippet = props.preview_content[0]
          .substring(0, 200)
          .replace(/\uFFFD/g, ' ')
          .replace(/(\s*\n){2,}/gm, '\n\n');
      } else {
        const highlightExtract = /<span class="em">(.*?)<\/span>/gm;
        let match;
        let lastIndex = 0;
        const results = [];
        while ((match = highlightExtract.exec(snippet)) !== null) {
          if (match.index !== lastIndex) {
            results.push(decode(snippet.substring(lastIndex, match.index)));
          }
          results.push(<em className={classes.highlight}>{decode(match[1])}</em>);
          lastIndex = highlightExtract.lastIndex;
        }
        results.push(decode(snippet.substring(lastIndex, snippet.length)));
        snippet = <span>{results}</span>;
      }
    }
    return snippet;
  };

  /*
   * Cut the title if too long and prepares the tooltip to show the full title
   * when hovered.
   */
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
    if (title.length > maxTitleSize) {
      title = (
        <Tooltip title={title} placement="right" aria-label={title}>
          <span>{title.substring(0, truncTitleSize) + '...' + title.substring(title.length - truncTitleSize)}</span>
        </Tooltip>
      );
    }
    return title;
  };

  /*
   * Cut the URL if too long and prepares the tooltip to show the full URL
   * when hovered.
   */
  const prepareUrl = () => {
    var maxSize = 70;
    let result = props.url;
    if (props.url.length > maxSize) {
      const fileName = props.url.substring(props.url.lastIndexOf('/') + 1);
      if (fileName.length > maxSize - 15) {
        result = (
          <Tooltip title={props.url} placement="right" aria-label={props.url}>
            <span>{props.url.substring(0, 15) + '...' + fileName.substring(fileName.length - 1 - (maxSize - 15))}</span>
          </Tooltip>
        );
      } else {
        result = (
          <Tooltip title={props.url} placement="right" aria-label={props.url}>
            <span>
              {props.url.substring(0, props.url.lastIndexOf('/') - props.url.length + maxSize) +
                '...' +
                props.url.substring(props.url.lastIndexOf('/'))}
            </span>
          </Tooltip>
        );
      }
    }

    return result;
  };

  /* 
   * Returns the original document URL if the option "orginalDocURL" is activated in ui-config.json.
   * If direct link is active, search for the good URL prefix to apply the real document URL or apply to all documents
   */
  const tryGetOriginalDocLink = () => {
    let docURL = null;
    const orginalLink = uiDefinition.center.orginalDocURL;
    
    if (orginalLink.active){
      let forPrefixURLs = orginalLink.forPrefixURLs;

      if (orginalLink.forAll) {
        docURL = props.url;
      } else {
        if (forPrefixURLs != null && forPrefixURLs.length > 0){
          let i = 0;
          while (docURL == null && i < forPrefixURLs.length){
            if (props.url.startsWith(forPrefixURLs[i])) {
              docURL = props.url;
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

    return docURL;
  }

  /*
   * Builds the URL to use as the link href to send to the result
   */
  const prepareDocURL = () => {
    let docURL = null;

    docURL = tryGetOriginalDocLink();

    // if direct link is not active or the URL prefix is not found, apply the this URL formatting
    if (docURL == null) {
      let request = buildSearchQueryString();
      docURL = `${props.click_url}&${request}&position=${props.position}`;        
    }
    return docURL;
  };

  /*
   * Builds the URL to use as the link href to send to the folder containing the result (for selected sources
   * defined by the props folderLinkSources which is an array of String)
   */
  const prepareFolderURL = () => {
    let folderURL = null;

    let docURL = tryGetOriginalDocLink();
    if (docURL != null){
      // Extract folder to document URL
      folderURL = docURL.substring(0, docURL.lastIndexOf('/'));
    }

    if (folderURL == null) {
      let request = buildSearchQueryString();
      folderURL = `${props.folder_url}&${request}&position=${props.position}`;      
    }    
    return folderURL;
  };

  /*
   * Builds the URL to use as the link href to send to the preview page for this result
   */
  const preparePreviewURL = () => {
    let request = buildSearchQueryString();
    return `/preview?docPos=${props.position}&docId=${props.id}&${request}&action=OPEN_PREVIEW`;
  };

  /*
   * Builds the URL to the file icon to be used for this result
   */
  const selectFileIcon = (extension) => {
    if (extension_list.indexOf(extension) !== -1) {
      return `${process.env.PUBLIC_URL}/images/file_icons/icon_square_${extension}_v01-24px.png`;
    } else {
      return `${process.env.PUBLIC_URL}/images/file_icons/icon_square_default_v01-24px.png`;
    }
  };

  const fileIcon = selectFileIcon(props.extension);

  return (
    <ListItem key={props.click_url} className={classes.resultContainer}>
      {(data.includes(dataNames.logo) || data.includes(dataNames.previewButton)) && (
        <ListItemIcon className={classes.iconsContainer}>
          {data.includes(dataNames.logo) && (
            <Avatar className={classes.fileIcon} variant="square" src={fileIcon} alt={`${props.extension} icon`} />
          )}
        </ListItemIcon>
      )}
      <ListItemText
        primary={
          data.includes(dataNames.title) ? (
            <Link color="secondary" href={prepareDocURL()} target={docLinkTarget}>
              {prepareTitle()}
            </Link>
          ) : null
        }
        secondary={
          <>
            {data.includes(dataNames.snippet) && (
              <div>
                <span>{prepareSnippet()}</span>
              </div>
            )}
            {data.includes(dataNames.url) && (
              <div className={classes.urlContainer}>
                <span className={classes.url}>{prepareUrl()}</span>
              </div>
            )}

            {/* FOLDER LINK */}
            {props['folderLinkSources'] && props['folderLinkSources'].indexOf(props['repo_source']) !== -1 && (
              <div>
                <Link color="secondary" href={prepareFolderURL()} target={props.folderTarget}>
                  {t('Open Folder')}
                </Link>
              </div>
            )}

            {/* PREVIEW LINK */}
            {data.includes(dataNames.previewButton) && (
              <Link color="secondary" component={RouterLink} to={preparePreviewURL()} target={props.previewTarget}>
                {t('Open preview')}
              </Link>
            )}
            <div>
              <span>
                {t('Source')}: {props['repo_source']}
              </span>
              {/* More like this link, commented because not yet implemented.
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
      {/* Favorite badge, shown only if the user is authenticated and favorites are active */}
      {props.bookmarkEnabled && userState.user && (
        <div className={classes.bookmarkAction}>
          <IconButton edge="end" aria-label="bookmark" onClick={props.bookmarkClickCallback}>
            {props.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </div>
      )}
    </ListItem>
  );
};

export default ResultEntry;
