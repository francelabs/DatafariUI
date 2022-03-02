import {
  Checkbox,
  Divider,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { Autocomplete } from "@material-ui/lab";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  QueryContext,
  REGISTER_FIELD_FACET,
  SET_FIELD_FACET_SELECTED,
} from "../../Contexts/query-context";
import { ResultsContext } from "../../Contexts/results-context";

const useStyles = makeStyles((theme) => ({
  facetTitleText: {
    flexGrow: 1,
  },
  facetHeader: {
    display: "flex",
    alignItems: "center",
  },
  showMore: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },

  autocompleteRoot: {
    marginBottom: 15,

    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "black",
        borderWidth: 1,
      },
    },
  },

  option: {
    '&[aria-selected="true"]': {
      backgroundColor: "transparent",
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

// Max tags displayed in the input
const MAX_TAGS = 2;

const AutocompleteFieldFacet = (props) => {
  const classes = useStyles();
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { results } = useContext(ResultsContext);
  const { field, op } = props;
  const { t } = useTranslation();
  const menuAnchorRef = useRef(null);

  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [facetResultValues, setFacetResultValues] = useState([]);

  // Effect to build facet result values
  useEffect(() => {
    let newValues = [];

    if (results.fieldFacets[field]) {
      for (let i = 0; i < results.fieldFacets[field].length; i += 2) {
        newValues.push({
          value: results.fieldFacets[field][i],
          count: results.fieldFacets[field][i + 1],
          selected: !!(
            query.selectedFieldFacets[field] &&
            query.selectedFieldFacets[field].indexOf(
              results.fieldFacets[field][i]
            ) !== -1
          ),
        });
      }
    }

    setFacetResultValues(newValues);
  }, [results, field, query.selectedFieldFacets]);

  // Effect to add the facet to the query if it is not registered
  useEffect(() => {
    const newFacet = {
      id: field,
      field: field,
      tag: field,
      op: op,
      title: props.title,
    };
    queryDispatch({ type: REGISTER_FIELD_FACET, fieldFacet: newFacet });
  }, [field, queryDispatch, op, props.title]);

  // Selected facet values
  const selectedFacetResultValues = facetResultValues.filter(
    (option) => option.selected
  );

  // Handler when clicking on a facet entry.
  // Adds or remove the entry from the selected list
  // depending on its current state.
  const onClick = useCallback(
    (value) => {
      return () => {
        // remeber query is immutable, copy anything we want to modfiy
        let selected = query.selectedFieldFacets[field]
          ? [...query.selectedFieldFacets[field]]
          : [];
        const selectedIndex = selected.indexOf(value);
        if (selectedIndex === -1) {
          selected.push(value);
        } else {
          selected.splice(selectedIndex, 1);
        }
        queryDispatch({
          type: SET_FIELD_FACET_SELECTED,
          facetId: field,
          selected: selected,
        });
      };
    },
    [field, query.selectedFieldFacets, queryDispatch]
  );

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  // Removes all facet entry selection
  const handleClearFilterClick = () => {
    queryDispatch({
      type: SET_FIELD_FACET_SELECTED,
      facetId: field,
      selected: [],
    });
    setMenuOpen(false);
  };

  // Select all facet entries
  const handleSelectAllClick = () => {
    const selected = [
      ...results.fieldFacets[field].filter((value, index) => {
        return index % 2 === 0;
      }),
    ];

    queryDispatch({
      type: SET_FIELD_FACET_SELECTED,
      facetId: field,
      selected: selected,
    });
    setMenuOpen(false);
  };

  const onChangeAutocomplete = (e, options, reason) => {
    switch (reason) {
      case "select-option": {
        options
          .filter((option) => !option.selected)
          .forEach((option) => onClick(option.value)());
        break;
      }
      case "remove-option": {
        selectedFacetResultValues
          .filter((option) => !options.includes(option))
          .forEach((option) => onClick(option.value)());
        break;
      }
      case "clear": {
        handleClearFilterClick();
        break;
      }

      default:
        break;
    }
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return facetResultValues.length ? (
    <>
      {/* NEW FACET */}

      <div className={classes.facetHeader}>
        {/* MENU */}
        <IconButton
          onClick={handleOpenMenu}
          aria-controls={`${field}-facet-menu`}
          aria-haspopup="true"
          aria-label={t(`Open {{ facetTitle }} facet menu`, {
            facetTitle: t(props.title),
          })}
          classes={{ root: classes.menuRoot }}
        >
          <MoreVertIcon ref={menuAnchorRef} />
        </IconButton>
        <Menu
          id={`${field}-facet-menu`}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleSelectAllClick}>{t("Select All")}</MenuItem>
          <MenuItem onClick={handleClearFilterClick}>
            {t("Clear Filter")}
          </MenuItem>
        </Menu>

        {/* TITLE */}
        <Typography color="secondary" className={classes.facetTitleText}>
          {t(props.title)}
        </Typography>

        {/* EXPAND */}
        <IconButton
          onClick={() => setExpanded(!expanded)}
          aria-label={t(
            `${expanded ? "Collapse" : "Expand"} {{ facetTitle }} facet`,
            {
              facetTitle: t(props.title),
            }
          )}
          classes={{ root: classes.expandRoot }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>

      {expanded ? (
        <Autocomplete
          multiple
          id="facets-selection"
          limitTags={MAX_TAGS}
          options={facetResultValues}
          value={selectedFacetResultValues} // Display only selected values in the input
          disableCloseOnSelect
          placeholder={field}
          classes={{
            root: classes.autocompleteRoot,
            option: classes.option,
          }}
          onChange={onChangeAutocomplete}
          getOptionLabel={(option) => `${option.value} (${option.count})`}
          renderOption={(option) => (
            <div
              key={option.value}
              onClick={onClick(option.value)}
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <Checkbox
                id={option.value}
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={option.selected}
                onClick={onClick(option.value)}
              ></Checkbox>
              <div style={{ flexGrow: 1 }}>{option.value}</div>
              <div>{option.count}</div>
            </div>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={
                selectedFacetResultValues.length
                  ? props.title
                  : `${facetResultValues.length} ${
                      facetResultValues.length > 1 ? "options" : "option"
                    }`
              }
            />
          )}
        />
      ) : null}

      <Divider className={props.dividerClassName} />
    </>
  ) : null;
};

export default AutocompleteFieldFacet;
