import React, { useState, useRef } from 'react';
import {
  makeStyles,
  List,
  Typography,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
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

const PreviewEntities = (props) => {
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
            aria-controls={`preview-entities-menu`}
            aria-haspopup="true"
            ref={menuAnchorRef}
          />
        </IconButton>
        <Menu
          id={`preview-entities-menu`}
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
          {t('Entities')}
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
                <Checkbox checked={false} onChange={() => {}} edge="start" />
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

export default PreviewEntities;
