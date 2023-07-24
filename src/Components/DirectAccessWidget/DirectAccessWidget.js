//** Core */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

//** Material UI */
import {
  makeStyles,
  List,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Link,
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ShareIcon from '@material-ui/icons/Share';

//** Hooks */
import useDirectAccess from '../../Hooks/useDirectAccess';

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    flexGrow: 1,
  },
  facetHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  list: {
    marginBottom: theme.spacing(1),
  },
  innerList: {
    paddingLeft: theme.spacing(2),
  },
  iconItem: {
    minWidth: '38px',
  },
  url: {
    // whiteSpace: 'pre',
    // overflowX: 'scroll',
  },
}));

const DirectAccessWidget = ({ show = true }) => {
  const { isLoading, data, error, reqIdentifier, getQuickLinks } = useDirectAccess();

  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();

  const currentLocation = useLocation();

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  return (
    show && (
      <>
        <div className={classes.facetHeader}>
          <IconButton disabled={true}>
            <MoreVertIcon aria-controls={`preview-share-menu`} aria-haspopup="true" />
          </IconButton>

          <Typography color="secondary" className={classes.facetTitleText}>
            {t('Direct Links')}
          </Typography>

          <IconButton onClick={handleExpandClick}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </div>

        {expanded && (
          <>
            <List dense className={classes.list}>
              <>
                <List component="div" disablePadding>
                  <ListItem>
                    <ListItemIcon className={classes.iconItem}>
                      <ShareIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Link component="button" color="secondary" className={classes.showMore}>
                        <Typography variant="subtitle1">{t('Show page')}</Typography>
                      </Link>
                    </ListItemText>
                  </ListItem>
                </List>

                <List component="div" disablePadding>
                  <ListItem>
                    <ListItemIcon className={classes.iconItem}>
                      <ShareIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Link component="button" color="secondary" className={classes.showMore}>
                        <Typography variant="subtitle1">{t('Show page')}</Typography>
                      </Link>
                    </ListItemText>
                  </ListItem>
                </List>
              </>
            </List>
            <Divider />
          </>
        )}
      </>
    )
  );
};

export default DirectAccessWidget;
