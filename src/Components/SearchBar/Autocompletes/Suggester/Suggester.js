import {
  ListSubheader,
  makeStyles,
  MenuItem,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import { SearchContext } from "../../../../Contexts/search-context";

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: "flex",
    borderBottom: "solid 1px " + theme.palette.grey[500],
  },

  title: {
    flexGrow: 1,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.75rem",
    },
  },

  subtitle: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  autocomplete: {
    backgroundColor: theme.palette.grey[200],
    position: "absolute",
    width: "100%",
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    zIndex: theme.zIndex.drawer,
    boxShadow: "0px 15px 10px -15px " + theme.palette.grey[500],
  },

  suggestion: {
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    paddingTop: 3,
    paddingBottom: 3,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.grey[300],
    },

    [theme.breakpoints.down("xs")]: {
      paddingLeft: 5,
    },
  },

  selection: {
    backgroundColor: theme.palette.grey[300],
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
}));

const Suggester = ({
  type,
  suggestions = [],
  title,
  subtitle,
  onClick,
  selection = {},
}) => {
  const classes = useStyles();
  const { searchState } = useContext(SearchContext);

  const { id: idSelection, index: indexSelection } = selection;

  return suggestions.length && !searchState.isSearching ? (
    <div>
      <ListSubheader className={classes.titleContainer} disableSticky={true}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.subtitle}>{subtitle}</Typography>
      </ListSubheader>

      {suggestions.map((suggestion, index) => (
        <MenuItem
          className={`${classes.suggestion} ${
            type === idSelection && index === indexSelection
              ? classes.selection
              : ""
          }`}
          key={"suggestion_" + index}
          onClick={() => onClick(type, suggestion)}
        >
          {suggestion}{" "}
        </MenuItem>
      ))}
    </div>
  ) : null;
};

export default Suggester;
