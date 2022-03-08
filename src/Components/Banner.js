import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  bannerContainer: {
    position: "fixed",
    top: (props) => (props.location === "TOP" ? 0 : ""),
    bottom: (props) => (props.location === "BOTTOM" ? 0 : ""),
    left: 0,
    zIndex: 2,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: (props) =>
      props.location === "TOP" ? "flex-start" : "flex-end",
  },

  bannerContent: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    backgroundColor: (props) => props.backgroundColor,
  },
}));

/**
 * Banner component. Used to display a banner either on TOP or on BOTTOM of the page, always on screen
 * with a closed button to hide it.
 *
 * location - TOP or BOTTOM values (Default to BOTTOM)
 *
 */
function Banner({ location = "BOTTOM", content = "", props = {} }) {
  const classes = useStyles({ location, ...props });
  const { t } = useTranslation();

  const [showBanner, setShowBanner] = useState(true);

  return showBanner ? (
    <>
      <div className={classes.bannerContainer}>
        <div className={classes.bannerContent}>
          {t(content)}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setShowBanner(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </>
  ) : null;
}

export default Banner;
