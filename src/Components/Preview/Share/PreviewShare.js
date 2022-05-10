import React, { useState, useRef } from 'react';
import {
  makeStyles,
  List,
  Typography,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ShareIcon from '@material-ui/icons/Share';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    flexGrow: 1,
  },
  facetHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  showMore: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  innerList: {
    paddingLeft: theme.spacing(2),
  },
  url: {
    whiteSpace: 'pre',
    overflowX: 'scroll',
  },
}));

const PreviewShare = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();
  const menuAnchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(true);
  const [shareOriginalOpen, setShareOriginalOpen] = useState(true);
  const currentLocation = useLocation();

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleOpenMenu = (event) => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleCollapseAllClick = () => {
    setShareOriginalOpen(false);
    setSharePreviewOpen(false);
    setMenuOpen(false);
  };

  const handleExpandAllClick = () => {
    setShareOriginalOpen(true);
    setSharePreviewOpen(true);
    setMenuOpen(false);
  };

  const handleShareOriginalClick = () => {
    setShareOriginalOpen((currentState) => {
      return !currentState;
    });
  };

  const handleSharePreviewClick = () => {
    setSharePreviewOpen((currentState) => {
      return !currentState;
    });
  };

  const buildSharePreviewLink = () => {
    if (props.document) {
      let path = currentLocation.pathname;
      if (process.env.PUBLIC_URL && process.env.PUBLIC_URL !== '') {
        path = `${process.env.PUBLIC_URL}${path}`;
      }
      const url = new URL(`${path}`, window.location.href);
      url.search = `?docId=${encodeURIComponent(props.document.id)}`;
      return url.toString();
    }
    return '';
  };

  const buildShareOriginalLink = () => {
    return props.document.url;
  };

  return (
    <>
      <div className={classes.facetHeader}>
        <IconButton onClick={handleOpenMenu}>
          <MoreVertIcon
            aria-controls={`preview-share-menu`}
            aria-haspopup="true"
            ref={menuAnchorRef}
          />
        </IconButton>
        <Menu
          id={`preview-share-menu`}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleExpandAllClick}>{t('Expand All')}</MenuItem>
          <MenuItem onClick={handleCollapseAllClick}>
            {t('Collapse All')}
          </MenuItem>
        </Menu>
        <Typography color="secondary" className={classes.facetTitleText}>
          {t('Share')}
        </Typography>
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded && (
        <>
          <List dense>
            {props.document && (
              <>
                <ListItem button onClick={handleSharePreviewClick}>
                  <ListItemIcon>
                    {sharePreviewOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={t('Copy this link to share this preview')}
                  />
                </ListItem>
                <Collapse
                  in={sharePreviewOpen}
                  timeout="auto"
                  unmountOnExit
                  className={classes.innerList}
                >
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemIcon>
                        <ShareIcon />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.url}
                        primary={buildSharePreviewLink()}
                      />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem button onClick={handleShareOriginalClick}>
                  <ListItemIcon>
                    {shareOriginalOpen ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={t('Copy this link to share the original document')}
                  />
                </ListItem>
                <Collapse
                  in={shareOriginalOpen}
                  timeout="auto"
                  unmountOnExit
                  className={classes.innerList}
                >
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemIcon>
                        <ShareIcon />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.url}
                        primary={buildShareOriginalLink()}
                      />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
          </List>
        </>
      )}
    </>
  );
};

export default PreviewShare;
