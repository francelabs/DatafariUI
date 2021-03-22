import React, { useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import HelpModal from '../../Pages/HelpModal/HelpModal';

const HelpMenu = (props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(undefined);

  const howToSearchClick = () => {
    setOpen('helpModal');
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
      {/* <MenuItem onClick={() => props.onClose()}>
        {t('Privacy Policies')}
      </MenuItem>
      <MenuItem onClick={() => props.onClose()}>{t('Contact us')}</MenuItem>
      <MenuItem onClick={() => props.onClose()}>{t('About Datafari')}</MenuItem> */}
      <HelpModal
        open={open === 'helpModal'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
    </Menu>
  );
};

export default HelpMenu;
