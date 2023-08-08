//** Core */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//** Context */
import { QueryContext } from '../../Contexts/query-context';

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
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';

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
  listItem: {
    alignItems: 'start',
  },
  linkItem: {
    lineHeight: '1',
  },
  linkText: {
    lineHeight: '1',
  },
  link: {
    lineHeight: '1',
  },
  description: {
    lineHeight: '1',
  },
  innerList: {
    paddingLeft: theme.spacing(2),
  },
  imageItem: {
    maxWidth: '32px',
    minWidth: '32px',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
}));

const DirectLinksWidget = ({ show = true }) => {
  const [linksData, setLinksData] = useState([]);
  const { query } = useContext(QueryContext);
  const { isLoading, data, error, getDirectAccess } = useDirectAccess();

  useEffect(() => {
    if (show && query.elements) {
      getDirectAccess(query.elements);
    }
  }, [query.elements, show, getDirectAccess]);

  useEffect(() => {
    if (data) {
      setLinksData(data?.response?.docs);
    }
  }, [data]);

  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  return (
    show &&
    linksData.length !== 0 && (
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
              {linksData.length !== 0 &&
                linksData.map((linkItem, index) => {
                  return (
                    <List component="div" disablePadding key={`${index}-direct-links`}>
                      <ListItem className={classes.listItem}>
                        <ListItemIcon className={classes.imageItem}>
                          <LinkImage alt={linkItem?.directlinks_title} src={linkItem?.directlinks_icon} width={32} />
                        </ListItemIcon>
                        <ListItemText className={classes.linkItem}>
                          <Typography className={classes.linkText}>
                            <Link
                              color="textPrimary"
                              target="_blank"
                              rel="noreferrer"
                              variant="subtitle1"
                              className={classes.link}
                              href={linkItem?.directlinks_link}>
                              {linkItem?.directlinks_title}
                            </Link>
                          </Typography>
                          {linkItem?.directlinks_description.length !== 0 && (
                            <Typography className={classes.description} variant="caption">
                              {linkItem?.directlinks_description.join(' ')}
                            </Typography>
                          )}
                        </ListItemText>
                      </ListItem>
                    </List>
                  );
                })}
            </List>
            <Divider />
          </>
        )}
      </>
    )
  );
};

const LinkImage = ({ src, width, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const handleImageError = () => {
    setImageLoaded(false);
  };
  return (
    <>{imageLoaded ? <img src={src} alt={alt} width={width} onError={handleImageError} /> : <PageviewOutlinedIcon />}</>
  );
};

export default DirectLinksWidget;
