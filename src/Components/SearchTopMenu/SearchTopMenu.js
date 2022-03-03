import {
  AppBar,
  Button,
  Divider,
  Hidden,
  Menu,
  MenuItem,
  Tabs,
  Toolbar,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../Contexts/user-context";
import useFavorites from "../../Hooks/useFavorites";
import AdvancedSearchModal from "../../Pages/AdvancedSearchModal/AdvancedSearchModal";
import ExportResultsModal from "../../Pages/ExportResultsModal/ExportResultsModal";
import FavortiesModal from "../../Pages/FavoritesModal/FavoritesModal";
import ManageAlertsModal from "../../Pages/ManageAlertsModal/ManageAlertsModal";
import ManageSavedQueriesModal from "../../Pages/ManageSavedQueriesModal/ManageSavedQueriesModal";
import ModifyAlertModal from "../../Pages/ModifyAlertModal/ModifyAlertModal";
import ModifySavedQueryModal from "../../Pages/ModifySavedQueryModal/ModifySavedQueryModal";

const SearchTopMenu = ({ tabs = [], selectedTab, onSelectTab }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(undefined);
  const { state: userState } = useContext(UserContext);
  const { isLoading, data, error, reqIdentifier, getFavoritesStatus } =
    useFavorites();
  const [favoritesEnabled, setFavoritesEnabled] = useState(false);

  useEffect(() => {
    getFavoritesStatus("FETCH_FAVORITES_STATUS");
  }, [getFavoritesStatus]);

  useEffect(() => {
    if (reqIdentifier === "FETCH_FAVORITES_STATUS") {
      if (!isLoading && !error && data) {
        if (data.status === "OK") {
          let enabled = false;
          if (data.content.activated === "true") {
            enabled = true;
          }
          if (enabled !== favoritesEnabled) {
            setFavoritesEnabled(enabled);
          }
        }
      }
    }
  }, [data, error, favoritesEnabled, isLoading, reqIdentifier]);

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
        <Tabs
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          value={selectedTab}
          onChange={(event, newValue) => onSelectTab(newValue)}
        >
          {tabs}
        </Tabs>

        <Button
          aria-controls="search-tools-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {t("Search Tools")}
        </Button>
        <Menu
          id="search-tools-menu"
          getContentAnchorEl={null}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={handleOpen("advanceSearch")}>
            {t("Advanced Search")}
          </MenuItem>
          <Hidden smDown>
            <Divider />
            {userState.user && (
              <>
                <MenuItem onClick={handleOpen("manageSavedQeuries")}>
                  {t("Manage Saved Queries")}
                </MenuItem>
                <MenuItem onClick={handleOpen("saveQuery")}>
                  {t("Save Current Query")}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpen("manageAlerts")}>
                  {t("Manage Alerts")}
                </MenuItem>
                <MenuItem onClick={handleOpen("createAlert")}>
                  {t("Save Query As Alert")}
                </MenuItem>
                <Divider />
                {favoritesEnabled && (
                  <>
                    <MenuItem onClick={handleOpen("favorites")}>
                      {t("Manage Favorites")}
                    </MenuItem>
                    <Divider />
                  </>
                )}
              </>
            )}
            {/* <MenuItem onClick={handleOpen('exportResults')}>
            {t('Export Current Results')}
          </MenuItem> */}
          </Hidden>
        </Menu>
      </Toolbar>
      <AdvancedSearchModal
        open={open === "advanceSearch"}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <FavortiesModal
        open={open === "favorites"}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ManageAlertsModal
        open={open === "manageAlerts"}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ManageSavedQueriesModal
        open={open === "manageSavedQeuries"}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ModifyAlertModal
        open={open === "createAlert"}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ExportResultsModal
        open={open === "exportResults"}
        onClose={() => {
          setOpen(undefined);
        }}
      />
      <ModifySavedQueryModal
        open={open === "saveQuery"}
        onClose={() => {
          setOpen(undefined);
        }}
      />
    </AppBar>
  );
};

export default SearchTopMenu;
