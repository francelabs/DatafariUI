//** Core */
import React, { useContext, useEffect, useState, useRef } from 'react';

//** Context */
import { QueryContext } from '../../Contexts/query-context';

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
  listContent: {
    marginBottom: theme.spacing(2),
  },
  listItem: {
    alignItems: 'start',
    paddingLeft: theme.spacing(8),
    paddingBottom: '0',
    paddingTop: '0',
  },
  textListItem: {
    fontStyle: 'italic',
    paddingRight: theme.spacing(1),
  },
  textListData: {
    wordBreak: 'break-all',
  },
  showMore: {
    width: '100%',
    marginBottom: theme.spacing(1),
    paddingInline: theme.spacing(2),
  },
}));

const YellowPagesWidget = ({ show = true, visible = 1 }) => {
  const [pagesData, setPagesData] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [expandedStates, setExpandedStates] = useState([]);
  const [visibleItemsCount, setVisibleItemsCount] = useState(visible);
  const [isShowAll, setIsShowAll] = useState(false);

  const menuAnchorRef = useRef(null);

  const { query } = useContext(QueryContext);
  const { isLoading, data, error, getYellowPages } = useYellowPages();
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    if (show && query.elements) {
      getYellowPages(query.elements);
    }
  }, [query.elements, show, getYellowPages]);

  useEffect(() => {
    if (data) {
      setPagesData(data?.response?.docs);
    }
  }, [data]);

  useEffect(() => {
    if (pagesData.length > 0) {
      setExpandedStates(new Array(pagesData.length).fill(true));
    }
  }, [pagesData]);

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleSharePreviewClick = (index) => {
    const updatedStates = [...expandedStates];
    updatedStates[index] = !updatedStates[index];
    setExpandedStates(updatedStates);
  };

  const handleShowMoreAndLess = () => {
    if (isShowAll) {
      setVisibleItemsCount(1);
    } else {
      setVisibleItemsCount(pagesData.length);
    }
    setIsShowAll(!isShowAll);
  };

  const capitalizeFirstLetter = (str) => {
    if (typeof str === 'string') {
      return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    } else if (Array.isArray(str)) {
      return str.map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`).join(' ');
    } else {
      throw new Error('The passed parameter must be a string or an array of strings.');
    }
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  return (
    show &&
    pagesData.length !== 0 && (
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

        <div className={pagesData.length > visible ? '' : classes.listContent}>
          {expanded && (
            <>
              {pagesData.length !== 0 &&
                pagesData.slice(0, visibleItemsCount).map((pageItem, index) => (
                  <List dense key={`${index}-direct-links`}>
                    <ListItem button onClick={() => handleSharePreviewClick(index)}>
                      <ListItemIcon className={classes.iconCollaps}>
                        {expandedStates[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography variant="subtitle1">
                          {capitalizeFirstLetter(pageItem?.directory_firstnames)}{' '}
                          {capitalizeFirstLetter(pageItem?.directory_name)}
                        </Typography>
                      </ListItemText>
                    </ListItem>

                    <Collapse in={expandedStates[index]} timeout="auto" unmountOnExit className={classes.innerList}>
                      <List component="div" disablePadding>
                        <ListItem className={classes.listItem}>
                          <Typography variant="caption" className={classes.textListItem}>
                            {t('Phone:')}
                          </Typography>
                          <Typography variant="caption" className={classes.textListData}>
                            {pageItem?.directory_phone}
                          </Typography>
                        </ListItem>

                        <ListItem className={classes.listItem}>
                          <Typography variant="caption" className={classes.textListItem}>
                            {t('Expertise:')}
                          </Typography>
                          <Typography variant="caption" className={classes.textListData}>
                            {pageItem?.directory_expertise}
                          </Typography>
                        </ListItem>

                        <ListItem className={classes.listItem}>
                          <Typography variant="caption" className={classes.textListItem}>
                            {t('Role:')}
                          </Typography>
                          <Typography variant="caption" className={classes.textListData}>
                            {pageItem?.directory_role}
                          </Typography>
                        </ListItem>

                        <ListItem className={classes.listItem}>
                          <Typography variant="caption" className={classes.textListItem}>
                            {t('Address:')}
                          </Typography>
                          <Typography variant="caption" className={classes.textListData}>
                            {pageItem?.directory_location}
                          </Typography>
                        </ListItem>

                        <ListItem className={classes.listItem}>
                          <Typography variant="caption" className={classes.textListItem}>
                            {t('Department:')}
                          </Typography>
                          <Typography variant="caption" className={classes.textListData}>
                            {pageItem?.directory_department}
                          </Typography>
                        </ListItem>

                        <ListItem className={classes.listItem}>
                          <Typography variant="caption" className={classes.textListItem}>
                            {t('Email:')}
                          </Typography>
                          <Typography variant="caption" className={classes.textListData}>
                            {pageItem?.directory_email}
                          </Typography>
                        </ListItem>

                        <ListItem className={classes.listItem}>
                          <Typography variant="caption" className={classes.textListItem}>
                            {t('Social:')}
                          </Typography>
                          <Typography variant="caption" className={classes.textListData}>
                            {pageItem?.directory_socialnetworks.join(', ')}
                          </Typography>
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                ))}

              {pagesData.length > visible && (
                <Link
                  component="button"
                  color="secondary"
                  align="right"
                  className={classes.showMore}
                  onClick={handleShowMoreAndLess}>
                  <Typography variant="caption">
                    {isShowAll ? `${t('Show Less')} <<` : `${t('Show More')} >>`}{' '}
                  </Typography>
                </Link>
              )}
            </>
          )}
        </div>
        <Divider />
      </>
    )
  );
};

export default YellowPagesWidget;
