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
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { ReactComponent as PreviewIcon } from '../../../Icons/preview-black-18dp.svg';
import { useTranslation } from 'react-i18next';

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
}));

const PreviewMoreLikeThis = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();
  const menuAnchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleOpenMenu = (event) => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleClearFilterClick = () => {
    setMenuOpen(false);
  };

  const handleSelectAllClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <div className={classes.facetHeader}>
        <IconButton onClick={handleOpenMenu}>
          <MoreVertIcon
            aria-controls={`preview-more-like-this-menu`}
            aria-haspopup="true"
            ref={menuAnchorRef}
          />
        </IconButton>
        <Menu
          id={`preview-more-like-this-menu`}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleSelectAllClick}>{t('Select All')}</MenuItem>
          <MenuItem onClick={handleClearFilterClick}>
            {t('Clear Filter')}
          </MenuItem>
        </Menu>
        <Typography color="secondary" className={classes.facetTitleText}>
          {t('More Like This')}
        </Typography>
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded && (
        <>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <PreviewIcon />
              </ListItemIcon>
              <ListItemText
                id={props.id}
                primary={<span>Dummy text for list item</span>}
              />
            </ListItem>
          </List>
        </>
      )}
    </>
  );
};

export default PreviewMoreLikeThis;
