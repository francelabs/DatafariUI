import React from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const HelpMenu = (props) => {
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
      <MenuItem onClick={() => props.onClose()}>{t('How to search')}</MenuItem>
      <MenuItem onClick={() => props.onClose()}>
        {t('Privacy Policies')}
      </MenuItem>
      <MenuItem onClick={() => props.onClose()}>{t('Contact us')}</MenuItem>
      <MenuItem onClick={() => props.onClose()}>{t('About Datafari')}</MenuItem>
    </Menu>
  );
};

export default HelpMenu;
