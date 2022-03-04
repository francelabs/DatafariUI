import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useRef } from "react";

const useStyles = makeStyles((theme) => {
  return {
    hotkey: {
      color: theme.palette.grey[400],
      backgroundColor: "transparent",
      borderColor: theme.palette.grey[400],
      borderStyle: "solid",
      borderRadius: theme.shape.borderRadius,
      paddingInline: theme.spacing(0.5),

      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  };
});

// Predefined hotkeys IDs use in the App
export const ACTIVE_SEARCH_BAR_ID = "activeSearchBar";
export const DEACTIVE_SEARCH_BAR_ID = "deactiveSearchBar";

// MAIN CMD keys
export const CTRL = "ctrl";
export const ALT = "alt";
export const SHIFT = "shift";
export const ESCAPE = "escape";

// PREDEFINED cmd keys available
const CMDKEYS = {
  [CTRL]: { isValid: (e) => e.ctrlKey, icon: "CTRL" },
  [ALT]: { isValid: (e) => e.altKey, icon: "ALT" },
  [SHIFT]: { isValid: (e) => e.shiftKey, icon: <>&#8679;</> }, // Fat arrow up hex code
  [ESCAPE]: { isValid: (e) => e.key.toLowerCase() === "escape", icon: "ESC" },
};

function useHotkey({ cmd = "", key = "", enable = false, callback }) {
  const classes = useStyles();
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enable) return;

    const handleKeyup = (e) => {
      if (
        cmd &&
        CMDKEYS[cmd] &&
        CMDKEYS[cmd].isValid(e) &&
        (key === e.key || key === "")
      ) {
        e.preventDefault();
        e.stopPropagation();
        callbackRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyup);

    return () => document.removeEventListener("keydown", handleKeyup);
  }, [enable, cmd, key, callback]);

  return {
    hotkey:
      enable && cmd in CMDKEYS ? (
        <Typography variant="button" className={classes.hotkey}>
          {CMDKEYS[cmd].icon}
          {key}
        </Typography>
      ) : (
        ""
      ),
  };
}

export default useHotkey;
