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
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

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
  textContainer: {
    display: 'flex',
  },
  textLabel: {
    flexGrow: 1,
    paddingRight: theme.spacing(1),
  },
  navButtons: {
    position: 'relative',
    bottom: '4px',
  },
  highlighted: {
    backgroundColor: 'yellow',
    borderRadius: '5px',
  },
}));

const PreviewSearchedTerms = (props) => {
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
            aria-controls={`preview-search-terms-menu`}
            aria-haspopup="true"
            ref={menuAnchorRef}
          />
        </IconButton>
        <Menu
          id={`preview-search-terms-menu`}
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
          {t('Search Query Terms')}
        </Typography>
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded && (
        <>
          <List dense>
            {Object.getOwnPropertyNames(props.highlighting).map(
              (highlightTerm) => {
                const highlightObject = props.highlighting[highlightTerm];
                if (highlightObject.numOccurence > 0) {
                  return (
                    <ListItem>
                      <ListItemIcon>
                        <Checkbox
                          checked={highlightObject.highlighted}
                          onChange={() => {
                            props.dispatchHighlighting({
                              type: 'TOGGLE_HIGHLIGHT',
                              term: highlightTerm,
                            });
                          }}
                          edge="start"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <>
                            <span
                              className={`${
                                highlightObject.highlighted
                                  ? classes.highlighted
                                  : ''
                              }`}
                            >
                              {highlightTerm}
                            </span>
                            <span className={classes.textLabel}></span>
                            <span>{highlightObject.numOccurence}</span>
                            <IconButton
                              size="small"
                              className={classes.navButtons}
                              onClick={() => {
                                props.dispatchHighlighting({
                                  type: 'HIGHLIGHT_PREVIOUS',
                                  term: highlightTerm,
                                });
                              }}
                            >
                              <SkipPreviousIcon
                                fontSize="small"
                                color="action"
                              />
                            </IconButton>
                            <IconButton
                              size="small"
                              className={classes.navButtons}
                              onClick={() => {
                                props.dispatchHighlighting({
                                  type: 'HIGHLIGHT_NEXT',
                                  term: highlightTerm,
                                });
                              }}
                            >
                              <SkipNextIcon fontSize="small" color="action" />
                            </IconButton>
                          </>
                        }
                        primaryTypographyProps={{
                          className: classes.textContainer,
                        }}
                      />
                    </ListItem>
                  );
                }
                return null;
              }
            )}
          </List>
        </>
      )}
    </>
  );
};

export default PreviewSearchedTerms;
