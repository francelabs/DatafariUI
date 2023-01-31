import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Menu, MenuItem, Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PrivacySettingsModal from '../../Pages/PrivacySettingsModal/PrivacySettingsModal';
import useHttp from '../../Hooks/useHttp';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../Contexts/user-context';
import { makeStyles } from '@material-ui/core/styles';
import UserPreferencesModal from '../../Pages/UserPreferencesModal/UserPreferencesModal';

const useStyles = makeStyles((theme) => ({
  menuLink: {
    color: 'inherit',
  },
}));

const PRIVACY_MODAL = 'privacy';
const USER_PREF_MODAL = 'userPreferences';

const UserMenu = (props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(undefined);
  const { isLoading, data, error, sendRequest, clear } = useHttp();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const history = useHistory();
  const { state: userState } = useContext(UserContext);

  const privacyClick = () => {
    setOpen(PRIVACY_MODAL);
    props.onClose();
  };

  const handleLogout = useCallback(
    (event) => {
      sendRequest(apiEndpointsContext.logoutURL, 'GET');
      props.onClose();
    },
    [apiEndpointsContext.logoutURL, sendRequest, props]
  );

  // handle response to logout request
  useEffect(() => {
    if (!isLoading && (data || error)) {
      clear();
      history.go(0);
    }
  }, [clear, data, error, history, isLoading]);

  const onUserPrefsClick = () => {
    setOpen(USER_PREF_MODAL);
    props.onClose();
  };

  const adminURL = new URL(apiEndpointsContext.adminURL);
  adminURL.search = `?lang=${i18n.language}`;

  return (
    <Menu
      id={props.id}
      anchorEl={props.anchorEl}
      open={props.open}
      onClose={props.onClose}
      keepMounted
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}>
      {/* LOGOUT */}
      <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>

      {/* ADMIN */}
      {userState.user &&
        userState.user.roles &&
        (userState.user.roles.indexOf('SearchAdministrator') !== -1 ||
          userState.user.roles.indexOf('SearchExpert') !== -1) && (
          <MenuItem
            onClick={props.onClose}
            component={Link}
            href={adminURL}
            target="_blank"
            className={classes.menuLink}>
            {t('Admin')}
          </MenuItem>
        )}

      {/* OLD UI */}
      <MenuItem
        onClick={props.onClose}
        component={Link}
        href={apiEndpointsContext.datafariBaseURL}
        target="_blank"
        className={classes.menuLink}>
        {t('Go to the legacy Datafari UI')}
      </MenuItem>

      {/* PRIVACY SETTINGS */}
      <MenuItem onClick={privacyClick}>{t('Privacy Settings')}</MenuItem>
      <PrivacySettingsModal
        open={open === PRIVACY_MODAL}
        onClose={() => {
          setOpen();
        }}
      />

      {/* USER PREF */}
      <MenuItem onClick={onUserPrefsClick}>{t('User Preferences')}</MenuItem>

      {open === USER_PREF_MODAL ? (
        <UserPreferencesModal open={open === USER_PREF_MODAL} onClose={setOpen} />
      ) : null}
    </Menu>
  );
};

export default UserMenu;
