import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useRef } from "react";

export const CTRL = "ctrl";
export const ALT = "alt";
export const SHIFT = "shift";
export const ESCAPE = "Escape";

const useStyles = makeStyles((theme) => {
  return {
    hotkey: {
      color: theme.palette.grey[400],
      backgroundColor: "transparent",
      borderColor: theme.palette.grey[400],
      borderStyle: "solid",
      borderRadius: theme.shape.borderRadius,
      paddingInline: theme.spacing(0.5),
    },
  };
});

// PREDEFINED cmd keys available
const CMDKEYS = {
  [CTRL]: { isValid: (e) => e.ctrlKey, icon: "CTRL" },
  [ALT]: { isValid: (e) => e.altKey, icon: "ALT" },
  [SHIFT]: { isValid: (e) => e.shiftKey, icon: <>&#8679;</> }, // Fat arrow up hex code
  [ESCAPE]: { isValid: (e) => e.key === "Escape", icon: "ESC" },
};

function useHotkey({ cmdKey, secondKey = "", callback }) {
  const classes = useStyles();
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyup = (e) => {
      console.log(e, e.key);

      if (
        cmdKey &&
        CMDKEYS[cmdKey] &&
        CMDKEYS[cmdKey].isValid(e) &&
        (secondKey === e.key || secondKey === "")
      ) {
        e.preventDefault();
        e.stopPropagation();
        callbackRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyup);

    return () => document.removeEventListener("keydown", handleKeyup);
  }, [cmdKey, secondKey, callback]);

  const cmdIcon = cmdKey && CMDKEYS[cmdKey] && CMDKEYS[cmdKey].icon;
  return {
    hotkey: cmdIcon ? (
      <Typography variant="button" className={classes.hotkey}>
        {CMDKEYS[cmdKey].icon}
        {secondKey}
      </Typography>
    ) : (
      ""
    ),
  };
}

export default useHotkey;
