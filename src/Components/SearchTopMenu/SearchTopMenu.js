import React, { useState } from 'react';
import {
  AppBar,
  Divider,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  Toolbar,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';

const SearchTopMenu = () => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={t('All Content')} />
        </Tabs>
        <Button
          aria-controls="search-tools-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {t('Search Tools')}
        </Button>
        <Menu
          id="search-tools-menu"
          getContentAnchorEl={null}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <AdvancedSearch />
          {/* <MenuItem onClick={handleClose}>{t('Advanced Search')}</MenuItem> */}
          <Divider />
          <MenuItem onClick={handleClose}>{t('Manage Saved Queries')}</MenuItem>
          <MenuItem onClick={handleClose}>{t('Save Current Query')}</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>{t('Manage Alerts')}</MenuItem>
          <MenuItem onClick={handleClose}>{t('Save Query As Alert')}</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>{t('Manage Favorites')}</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            {t('Export Current Results')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default SearchTopMenu;
