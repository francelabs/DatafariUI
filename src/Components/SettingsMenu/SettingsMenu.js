import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const SettingsMenu = (props) => {
  const { t } = useTranslation();

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
      <MenuItem onClick={() => props.onClose()}>
        {t('Edit Page Layout')}
      </MenuItem>
      <MenuItem onClick={() => props.onClose()}>
        {t('Privacy Settings')}
      </MenuItem>
    </Menu>
  );
};

export default SettingsMenu;
