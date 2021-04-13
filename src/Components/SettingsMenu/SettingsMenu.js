import React, { useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PrivacySettingsModal from '../../Pages/PrivacySettingsModal/PrivacySettingsModal';

const SettingsMenu = (props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(undefined);

  const privacyClick = () => {
    setOpen('privacy');
    props.onClose();
  };

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

export default SettingsMenu;
