import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Menu, MenuItem, Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PrivacySettingsModal from '../../Pages/PrivacySettingsModal/PrivacySettingsModal';
import useHttp from '../../Hooks/useHttp';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../Contexts/user-context';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  menuLink: {
    color: 'inherit',
  },
}));

const UserMenu = (props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(undefined);
  const { isLoading, data, error, sendRequest, clear } = useHttp();
  const apiEndpointsContext = useContext(APIEndpointsContext);
  const history = useHistory();
  const { state: userState } = useContext(UserContext);

  const privacyClick = () => {
    setOpen('privacy');
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
      }}
    >
      <MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
      {userState.user &&
        userState.user.roles &&
        (userState.user.roles.indexOf('SearchAdministrator') !== -1 ||
          userState.user.roles.indexOf('SearchExpert') !== -1) && (
          <MenuItem
            onClick={props.onClose}
            component={Link}
            href={adminURL}
            target="_blank"
            className={classes.menuLink}
          >
            {t('Admin')}
          </MenuItem>
        )}
      <MenuItem
        onClick={props.onClose}
        component={Link}
        href={apiEndpointsContext.datafariBaseURL}
        target="_blank"
        className={classes.menuLink}
      >
        {t('Go to the legacy Datafari UI')}
      </MenuItem>
      <MenuItem onClick={privacyClick}>{t('Privacy Settings')}</MenuItem>
      <PrivacySettingsModal
        open={open === 'privacy'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
    </Menu>
  );
};

export default UserMenu;
