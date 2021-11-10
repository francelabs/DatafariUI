import React, { useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PrivacyPolicyModal from '../../Pages/PrivacyPolicyModal/PrivacyPolicyModal';
import HelpModal from '../../Pages/HelpModal/HelpModal';
import AboutModal from '../../Pages/AboutModal/AboutModal';

const HelpMenu = (props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(undefined);

  const howToSearchClick = () => {
    setOpen('helpModal');
    props.onClose();
  };

  const privacyClick = () => {
    setOpen('privacy');
    props.onClose();
  };

  const aboutClick = () => {
    setOpen('about');
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
      <MenuItem onClick={howToSearchClick}>{t('How to search')}</MenuItem>
      <MenuItem onClick={privacyClick}>{t('Privacy Policy')}</MenuItem>
      {/* 
      <MenuItem onClick={() => props.onClose()}>{t('Contact us')}</MenuItem>
      */}
      <MenuItem onClick={aboutClick}>{t('About DatafariUI')}</MenuItem>
      <PrivacyPolicyModal
        open={open === 'privacy'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <HelpModal
        open={open === 'helpModal'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <AboutModal
        open={open === 'about'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
    </Menu>
  );
};

export default HelpMenu;
