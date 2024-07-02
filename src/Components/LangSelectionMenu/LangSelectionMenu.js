import React, { useContext } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../Contexts/user-context';

const LangSelectionMenu = (props) => {
  const { t, i18n } = useTranslation();
  const {
    state,
    actions: { updateUserLanguage },
  } = useContext(UserContext);

  const handleChangeLanguage = (lang) => {
    return () => {
      // Save user language if logged in
      (state.user && updateUserLanguage && updateUserLanguage(lang)) || i18n.changeLanguage(lang);
      props.onClose();
    };
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
      }}>
      <MenuItem onClick={handleChangeLanguage('en')}>{t('English')}</MenuItem>
      <MenuItem onClick={handleChangeLanguage('fr')}>{t('French')}</MenuItem>
      <MenuItem onClick={handleChangeLanguage('it')}>{t('Italian')}</MenuItem>
      <MenuItem onClick={handleChangeLanguage('pt_pt')}>{t('Portuguese')}</MenuItem>
      <MenuItem onClick={handleChangeLanguage('de')}>{t('German')}</MenuItem>
      <MenuItem onClick={handleChangeLanguage('es')}>{t('Spanish')}</MenuItem>
      <MenuItem onClick={handleChangeLanguage('ru')}>{t('Russian')}</MenuItem>
    </Menu>
  );
};

export default LangSelectionMenu;
