import React, { useCallback, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { NavLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleSearchBar from '../SearchBar/SimpleSearchBar';
import Avatar from '@material-ui/core/Avatar';

import LanguageIcon from '@material-ui/icons/Language';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';
import LangSelectionMenu from '../LangSelectionMenu/LangSelectionMenu';
import { UserContext } from '../../Contexts/user-context';
import { ReactComponent as LoginIcon } from '../../Icons/login-24px.svg';
import SvgIcon from '@material-ui/icons/AccountCircle';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import FeedbacksMenu from '../FeedbacksMenu/FeedbacksMenu';
import HelpMenu from '../HelpMenu/HelpMenu';
import { Link } from '@material-ui/core';
import useHttp from '../../Hooks/useHttp';
import UserMenu from '../UserMenu/UserMenu';
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  topbar: {
    backgroundImage:
      'url(' + process.env.PUBLIC_URL + '/images/background_datafari_banner_big.png)',
  },

  toolbar: {
    display: 'flex',
    minHeight: 82,

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: theme.spacing(0),
      minHeight: 50,
      maxHeight: 50,
    },
  },

  logo: {
    marginRight: theme.spacing(2),
    padding: 5,
    '& > img': {
      height: 50,
    },

    [theme.breakpoints.down('sm')]: {
      margin: 0,
      marginBottom: -15,
      '& > img': {
        height: 25,
      },
    },
  },

  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      marginRight: theme.spacing(2),
    },
  },
  topContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    alignSelf: 'normal',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),

    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      flexDirection: 'row',
    },
  },
  search: {
    display: 'flex',
    flex: 1,
  },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput:
    theme.direction === 'ltr'
      ? {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '20ch',
          },
        }
      : {
          padding: theme.spacing(1, 0, 1, 1),
          // vertical padding + font size from searchIcon
          paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '20ch',
          },
        },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuLink: {
    color: 'inherit',
  },
}));

const TopMenu = () => {
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const classes = useStyles();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [langMenuAnchorEl, setLangMenuAnchorEl] = useState(null);
  const [feedbacksMenuAnchorEl, setFeedbacksMenuAnchorEl] = useState(null);
  const [helpMenuAnchorEl, setHelpMenuAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { state: userState } = useContext(UserContext);
  const { isLoading, data, error, sendRequest, clear } = useHttp();
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null);
  }, []);

  const handleMenuClose = useCallback(() => {
    handleCloseUserMenu();
    handleMobileMenuClose();
  }, [handleMobileMenuClose]);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setLangMenuAnchorEl(null);
  };

  const handleOpenLangMenu = (event) => {
    setLangMenuAnchorEl(event.currentTarget);
  };

  const handleCloseFeedbacksMenu = () => {
    setFeedbacksMenuAnchorEl(null);
  };

  const handleOpenFeedbacksMenu = (event) => {
    setFeedbacksMenuAnchorEl(event.currentTarget);
  };

  const handleCloseHelpMenu = () => {
    setHelpMenuAnchorEl(null);
  };

  const handleOpenHelpMenu = (event) => {
    setHelpMenuAnchorEl(event.currentTarget);
  };

  const handleLogout = useCallback(
    (event) => {
      sendRequest(apiEndpointsContext.logoutURL, 'GET');
      handleMenuClose();
    },
    [apiEndpointsContext.logoutURL, handleMenuClose, sendRequest]
  );

  // handle response to logout request
  useEffect(() => {
    if (!isLoading && (data || error)) {
      clear();
      history.go(0);
    }
  }, [clear, data, error, history, isLoading]);

  const loginURL = new URL(apiEndpointsContext.authURL);
  loginURL.search = '?callback=' + new URL(process.env.PUBLIC_URL, window.location.href);
  const adminURL = new URL(apiEndpointsContext.adminURL);
  adminURL.search = `?lang=${i18n.language}`;

  const menuId = 'primary-search-account-menu';

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
      {userState.user &&
        userState.user.roles &&
        (userState.user.roles.indexOf('SearchAdministrator') !== -1 ||
          userState.user.roles.indexOf('SearchExpert') !== -1) && (
          <MenuItem
            onClick={handleMobileMenuClose}
            component={Link}
            href={adminURL}
            target="_blank">
            {t('Admin')}
          </MenuItem>
        )}
    </Menu>
  );

  return (
    <>
      <AppBar position="static" elevation={0} className={classes.topbar}>
        <Toolbar className={classes.toolbar}>
          <NavLink to="/search" className={classes.logo}>
            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
          </NavLink>
          <div className={classes.title}>
            <Typography variant="h6" noWrap>
              Datafari
            </Typography>
          </div>
          <div className={classes.topContainer}>
            <div className={classes.search}>
              <SimpleSearchBar />
            </div>

            <div className={classes.sectionDesktop}>
              <Tooltip title="Language">
              <IconButton
                aria-label={t('Language selection')}
                color="inherit"
                onClick={handleOpenLangMenu}>
                <LanguageIcon fontSize="large" />
              </IconButton>
              </Tooltip>
              <Tooltip title="Feedbacks">
              <IconButton
                aria-label={t('Feedbacks')}
                color="inherit"
                onClick={handleOpenFeedbacksMenu}>
                <FeedbackOutlinedIcon fontSize="large" />
              </IconButton>
              </Tooltip>
              <Tooltip title="Help">
              <IconButton aria-label={t('Help')} color="inherit" onClick={handleOpenHelpMenu}>
                <HelpOutlineIcon fontSize="large" />
              </IconButton>
              </Tooltip>
              {userState.user === null ? (
               <Tooltip title="Login"> 
               <IconButton
                  edge="end"
                  aria-label="Login"
                  aria-haspopup="true"
                  href={`${loginURL}`}
                  color="inherit">
                  <SvgIcon component={LoginIcon} alt="Login" />
                </IconButton>
                </Tooltip>
              ) : (
     <Tooltip title="User menu"> 
     <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  color="inherit">
                  <Avatar fontSize="small">{userState.user.name.substring(0, 2)}</Avatar>
                </IconButton>
                </Tooltip>
              )}
            </div>
            <div className={classes.sectionMobile}>
              {userState.user === null ? (
      <Tooltip title="Login">
      <IconButton
                  edge="end"
                  aria-label="Login"
                  aria-haspopup="true"
                  href={`${loginURL}`}
                  color="inherit">
                  <SvgIcon component={LoginIcon} alt="Login" />
                </IconButton>
                </Tooltip>
              ) : (
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit">
                  <MoreIcon />
                </IconButton>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <LangSelectionMenu
        open={Boolean(langMenuAnchorEl)}
        anchorEl={langMenuAnchorEl}
        onClose={handleCloseLangMenu}
        id="lang-menu"
      />
      <FeedbacksMenu
        open={Boolean(feedbacksMenuAnchorEl)}
        anchorEl={feedbacksMenuAnchorEl}
        onClose={handleCloseFeedbacksMenu}
        id="feedbacks-menu"
      />
      <HelpMenu
        open={Boolean(helpMenuAnchorEl)}
        anchorEl={helpMenuAnchorEl}
        onClose={handleCloseHelpMenu}
        id="help-menu"
      />
      <UserMenu
        open={Boolean(userMenuAnchorEl)}
        anchorEl={userMenuAnchorEl}
        onClose={handleCloseUserMenu}
        id="user-menu"
      />
    </>
  );
};

export default TopMenu;
