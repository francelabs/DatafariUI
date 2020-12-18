import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SimpleSearchBar from '../SearchBar/SimpleSearchBar';
import Avatar from '@material-ui/core/Avatar';

import datafariPaw from '../../Icons/datafari_paw.svg';
import SettingsIcon from '@material-ui/icons/Settings';
import LanguageIcon from '@material-ui/icons/Language';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import FeedbackOutlinedIcon from '@material-ui/icons/FeedbackOutlined';
import LangSelectionMenu from '../LangSelectionMenu/LangSelectionMenu';
import { UserContext } from '../../Contexts/user-context';
import Spinner from '../Spinner/Spinner';
import { ReactComponent as LoginIcon } from '../../Icons/login-24px.svg';
import SvgIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      marginRight: theme.spacing(2),
    },
  },
  search: {
    position: 'relative',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      flexGrow: 1,
    },
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
}));

const TopMenu = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [langMenuAnchorEl, setLangMenuAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { state: userState } = useContext(UserContext);
  const { t } = useTranslation();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    // setLangMenuOpen(false);
    setLangMenuAnchorEl(null);
  };

  const handleOpenLangMenu = (event) => {
    // setLangMenuOpen(true);
    setLangMenuAnchorEl(event.currentTarget);
  };

  const loginURL =
    window.datafariBaseURL +
    '/rest/v1.0/auth?callback=' +
    new URL(process.env.PUBLIC_URL, window.location.href);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <NavLink to="/search" className={classes.logo}>
            <img
              src={datafariPaw}
              alt="datafari logo"
              style={{ height: '50px' }}
            />
          </NavLink>
          <div className={classes.title}>
            <Typography variant="h6" noWrap>
              Datafari
            </Typography>
          </div>
          <div className={classes.search}>
            <SimpleSearchBar />
          </div>
          <div />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label={t('Language selection')}
              color="inherit"
              // ref={langMenuAnchorRef}
              onClick={handleOpenLangMenu}
            >
              <LanguageIcon fontSize="large" />
            </IconButton>
            <LangSelectionMenu
              open={Boolean(langMenuAnchorEl)}
              anchorEl={langMenuAnchorEl}
              onClose={handleCloseLangMenu}
              id="lang-menu"
            />
            <IconButton aria-label={t('Feedbacks')} color="inherit">
              <FeedbackOutlinedIcon fontSize="large" />
            </IconButton>
            <IconButton aria-label={t('Help')} color="inherit">
              <HelpOutlineIcon fontSize="large" />
            </IconButton>
            <IconButton aria-label={t('Search tools')} color="inherit">
              <SettingsIcon fontSize="large" />
            </IconButton>
            {userState.isLoading ? (
              <Spinner />
            ) : userState.user === null ? (
              <IconButton
                edge="end"
                aria-label="Login"
                aria-haspopup="true"
                href={loginURL}
                color="inherit"
              >
                <SvgIcon component={LoginIcon} alt="Login" />
              </IconButton>
            ) : (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar fontSize="small">
                  {userState.user.name.substring(0, 2)}
                </Avatar>
              </IconButton>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
};

export default TopMenu;
