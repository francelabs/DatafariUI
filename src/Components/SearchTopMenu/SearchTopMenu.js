import React, { useContext, useState } from 'react';
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
import FavortiesModal from '../../Pages/FavoritesModal/FavoritesModal';
import { UserContext } from '../../Contexts/user-context';
import AdvancedSearchModal from '../../Pages/AdvancedSearchModal/AdvancedSearchModal';
import ManageAlertsModal from '../../Pages/ManageAlertsModal/ManageAlertsModal';
import ManageSavedQueriesModal from '../../Pages/ManageSavedQueriesModal/ManageSavedQueriesModal';
import ModifyAlertModal from '../../Pages/ModifyAlertModal/ModifyAlertModal';
import ExportResultsModal from '../../Pages/ExportResultsModal/ExportResultsModal';
import ModifySavedQueryModal from '../../Pages/ModifySavedQueryModal/ModifySavedQueryModal';

const SearchTopMenu = () => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(undefined);
  const { state: userState } = useContext(UserContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (modalName) => {
    return () => {
      handleClose();
      setOpen(modalName);
    };
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
          <MenuItem onClick={handleOpen('advanceSearch')}>
            {t('Advanced Search')}
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>{t('Advanced Search')}</MenuItem> */}
          <Divider />
          {userState.user && (
            <>
              <MenuItem onClick={handleOpen('manageSavedQeuries')}>
                {t('Manage Saved Queries')}
              </MenuItem>
              <MenuItem onClick={handleOpen('saveQuery')}>
                {t('Save Current Query')}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleOpen('manageAlerts')}>
                {t('Manage Alerts')}
              </MenuItem>
              <MenuItem onClick={handleOpen('createAlert')}>
                {t('Save Query As Alert')}
              </MenuItem>
              <Divider />

              <MenuItem onClick={handleOpen('favorites')}>
                {t('Manage Favorites')}
              </MenuItem>
              <Divider />
            </>
          )}
          <MenuItem onClick={handleOpen('exportResults')}>
            {t('Export Current Results')}
          </MenuItem>
        </Menu>
      </Toolbar>
      <AdvancedSearchModal
        open={open === 'advanceSearch'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <FavortiesModal
        open={open === 'favorites'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ManageAlertsModal
        open={open === 'manageAlerts'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ManageSavedQueriesModal
        open={open === 'manageSavedQeuries'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ModifyAlertModal
        open={open === 'createAlert'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ExportResultsModal
        open={open === 'exportResults'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ModifySavedQueryModal
        open={open === 'saveQuery'}
        onClose={() => {
          setOpen(undefined);
        }}
      />
    </AppBar>
  );
};

export default SearchTopMenu;
