//** Core */
import React, { useEffect, useState, useRef } from 'react';

//** Material UI */
import {
  makeStyles,
  List,
  Typography,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Divider,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

//** Hooks */
import useYellowPages from '../../Hooks/useYellowPages';

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    flexGrow: 1,
  },
  facetHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  iconCollaps: {
    minWidth: '38px',
  },
  titleItem: {
    fontSize: '3.5rem',
  },
  innerList: {
    paddingLeft: theme.spacing(1),
  },
  listItem: {
    paddingLeft: theme.spacing(8),
    paddingBottom: '0',
    paddingTop: '0',
  },
  textListItem: {
    fontStyle: 'italic',
  },
  showMore: {
    width: '100%',
    marginBottom: theme.spacing(1),
    paddingInline: theme.spacing(2),
  },
}));

const YellowPagesWidget = ({ show = true }) => {
  const { isLoading, data, error, reqIdentifier, getQuickLinks } = useYellowPages();

  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();
  const menuAnchorRef = useRef(null);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(true);
  const currentLocation = useLocation();

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleSharePreviewClick = () => {
    setSharePreviewOpen((currentState) => {
      return !currentState;
    });
  };

  return (
    show && (
      <>
        <div className={classes.facetHeader}>
          <IconButton disabled={true}>
            <MoreVertIcon aria-controls={`preview-share-menu`} aria-haspopup="true" ref={menuAnchorRef} />
          </IconButton>

          <Typography color="secondary" className={classes.facetTitleText}>
            {t('Yellow Pages')}
          </Typography>

          <IconButton onClick={handleExpandClick}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </div>

        {expanded && (
          <>
            <List dense>
              <>
                <ListItem button onClick={handleSharePreviewClick}>
                  <ListItemIcon className={classes.iconCollaps}>
                    {sharePreviewOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="subtitle1">Bobby Bilbao</Typography>
                  </ListItemText>
                </ListItem>

                <Collapse in={sharePreviewOpen} timeout="auto" unmountOnExit className={classes.innerList}>
                  <List component="div" disablePadding>
                    <ListItem className={classes.listItem}>
                      <Typography variant="caption" className={classes.textListItem}>
                        {t('Tel:')}
                      </Typography>
                    </ListItem>

                    <ListItem className={classes.listItem}>
                      <Typography variant="caption" className={classes.textListItem}>
                        {t('Expertise:')}
                      </Typography>
                    </ListItem>

                    <ListItem className={classes.listItem}>
                      <Typography variant="caption" className={classes.textListItem}>
                        {t('Address:')}
                      </Typography>
                    </ListItem>

                    <ListItem className={classes.listItem}>
                      <Typography variant="caption" className={classes.textListItem}>
                        {t('SpaceTravel:')}
                      </Typography>
                    </ListItem>

                    <ListItem className={classes.listItem}>
                      <Typography variant="caption" className={classes.textListItem}>
                        {t('Mail:')}
                      </Typography>
                    </ListItem>
                  </List>
                </Collapse>
              </>
            </List>

            <Link component="button" color="secondary" align="right" className={classes.showMore}>
              <Typography variant="caption">{t('Show More')} &gt;&gt;</Typography>
            </Link>
            <Divider />
          </>
        )}
      </>
    )
  );
};

export default YellowPagesWidget;
