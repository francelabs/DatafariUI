import React, { useState, useRef, useCallback } from "react";
import {
  makeStyles,
  List,
  Typography,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import TitleIcon from "@material-ui/icons/Title";
import DescriptionIcon from "@material-ui/icons/Description";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { useTranslation } from "react-i18next";
import { isArray } from "@material-ui/data-grid";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";
import deLocale from "date-fns/locale/de";
import ptLocale from "date-fns/locale/pt";
import itLocale from "date-fns/locale/it";
import ruLocale from "date-fns/locale/ru";
import esLocale from "date-fns/locale/es";
import { format } from "date-fns-tz";

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
  innerList: {
    paddingLeft: theme.spacing(2),
  },
  dateFields: {
    overflowWrap: "break-word",
  },
}));

const PreviewProperties = (props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { i18n, t } = useTranslation();
  const menuAnchorRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [titleOpen, setTitleOpen] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [mimeOpen, setMimeOpen] = useState(true);
  const [authorsOpen, setAuthorsOpen] = useState(true);
  const [datesOpen, setDatesOpen] = useState(true);

  const getDateLocale = useCallback(() => {
    if (i18n.language) {
      switch (i18n.language) {
        case "fr":
          return frLocale;
        case "de":
          return deLocale;
        case "it":
          return itLocale;
        case "ru":
          return ruLocale;
        case "es":
          return esLocale;
        case "pt":
        case "pt_br":
          return ptLocale;
        case "en":
        default:
          return enLocale;
      }
    } else {
      return enLocale;
    }
  }, [i18n.language]);

  const handleExpandClick = () => {
    setExpanded((previous) => !previous);
  };

  const handleOpenMenu = (event) => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleCollapseAllClick = () => {
    setTitleOpen(false);
    setDescriptionOpen(false);
    setMimeOpen(false);
    setAuthorsOpen(false);
    setDatesOpen(false);
    setMenuOpen(false);
  };

  const handleExpandAllClick = () => {
    setTitleOpen(true);
    setDescriptionOpen(true);
    setMimeOpen(true);
    setAuthorsOpen(true);
    setDatesOpen(true);
    setMenuOpen(false);
  };

  const handleTitleClick = () => {
    setTitleOpen((openState) => {
      return !openState;
    });
  };

  const handleDescriptionClick = () => {
    setDescriptionOpen((openState) => {
      return !openState;
    });
  };

  const handleMimeClick = () => {
    setMimeOpen((openState) => {
      return !openState;
    });
  };

  const handleAuthorsClick = () => {
    setAuthorsOpen((openState) => {
      return !openState;
    });
  };

  const handleDatesClick = () => {
    setDatesOpen((openState) => {
      return !openState;
    });
  };

  const prepareTitles = () => {
    if (props.document) {
      const titles = props.document.title;
      if (!isArray(titles)) {
        if (!titles) {
          return [t("No title for this file")];
        }
        return [titles];
      }
      return titles;
    }
    return [];
  };

  const prepareDescription = () => {
    if (props.document) {
      let description = `(${t("No description")})`;
      if (
        props.document.description !== undefined &&
        props.document.description !== null
      ) {
        description = props.document.description;
      }
      return description;
    }
    return "";
  };

  const prepareAuthors = () => {
    let authors = [];
    if (props.document) {
      if (
        props.document.author !== undefined &&
        props.document.author !== null
      ) {
        authors = authors.concat(props.document.author);
      }
      if (
        props.document.last_author !== undefined &&
        props.document.last_author !== null
      ) {
        authors = authors.concat(props.document.last_author);
      }
      if (authors.length === 0) {
        authors.push(`(${t("Unknown")})`);
      }
    }
    return authors;
  };

  const prepareMime = () => {
    if (props.document) {
      let mime = `(${t("Unknown")})`;
      if (props.document.mime !== undefined && props.document.mime !== null) {
        mime = props.document.mime;
      }
      return mime;
    }
    return "";
  };

  const prepareCreationDate = () => {
    if (props.document) {
      let creationDate = [`(${t("Unknown")})`];
      if (
        props.document.creation_date !== undefined &&
        props.document.creation_date !== null
      ) {
        creationDate = props.document.creation_date.map((date) =>
          format(new Date(date), "P p", {
            locale: getDateLocale(),
          })
        );
      }
      return creationDate;
    }
    return [""];
  };

  const prepareLastModifiedDate = () => {
    if (props.document) {
      let lastModified = [`(${t("Unknown")})`];
      if (
        props.document.last_modified !== undefined &&
        props.document.last_modified !== null
      ) {
        lastModified = props.document.last_modified.map((date) =>
          format(new Date(date), "P p", {
            locale: getDateLocale(),
          })
        );
      }
      return lastModified;
    }
    return [""];
  };

  return (
    <>
      <div className={classes.facetHeader}>
        <IconButton onClick={handleOpenMenu}>
          <MoreVertIcon
            aria-controls={`preview-properties-menu`}
            aria-haspopup="true"
            ref={menuAnchorRef}
          />
        </IconButton>
        <Menu
          id={`preview-properties-menu`}
          anchorEl={menuAnchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleExpandAllClick}>{t("Expand All")}</MenuItem>
          <MenuItem onClick={handleCollapseAllClick}>
            {t("Collapse All")}
          </MenuItem>
        </Menu>
        <Typography color="secondary" className={classes.facetTitleText}>
          {t("Properties")}
        </Typography>
        <IconButton onClick={handleExpandClick}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {expanded && (
        <>
          <List dense>
            <ListItem button onClick={handleTitleClick}>
              <ListItemIcon>
                {titleOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText primary={t("Titles")} />
            </ListItem>
            <Collapse
              in={titleOpen}
              timeout="auto"
              unmountOnExit
              className={classes.innerList}
            >
              <List component="div" disablePadding>
                {prepareTitles().map((title) => {
                  return (
                    <ListItem>
                      <ListItemIcon>
                        <TitleIcon />
                      </ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>

            <ListItem button onClick={handleDescriptionClick}>
              <ListItemIcon>
                {descriptionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText primary={t("Description")} />
            </ListItem>
            <Collapse
              in={descriptionOpen}
              timeout="auto"
              unmountOnExit
              className={classes.innerList}
            >
              <List component="div" disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary={prepareDescription()} />
                </ListItem>
              </List>
            </Collapse>

            <ListItem button onClick={handleMimeClick}>
              <ListItemIcon>
                {mimeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText primary={t("MIME Type")} />
            </ListItem>
            <Collapse
              in={mimeOpen}
              timeout="auto"
              unmountOnExit
              className={classes.innerList}
            >
              <List component="div" disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText primary={prepareMime()} />
                </ListItem>
              </List>
            </Collapse>

            <ListItem button onClick={handleAuthorsClick}>
              <ListItemIcon>
                {authorsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText primary={t("Authors")} />
            </ListItem>
            <Collapse
              in={authorsOpen}
              timeout="auto"
              unmountOnExit
              className={classes.innerList}
            >
              <List component="div" disablePadding>
                {prepareAuthors().map((author) => {
                  return (
                    <ListItem>
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText primary={author} />
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>

            <ListItem button onClick={handleDatesClick}>
              <ListItemIcon>
                {datesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemIcon>
              <ListItemText primary={t("Dates")} />
            </ListItem>
            <Collapse
              in={datesOpen}
              timeout="auto"
              unmountOnExit
              className={classes.innerList}
            >
              <List component="div" disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <DateRangeIcon />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.dateFields}
                    primary={
                      <>
                        <>{t("Creation date")}:</>
                        <List className={classes.dateFields}>
                          {prepareCreationDate().map((date) => {
                            return (
                              <ListItem>
                                <ListItemText primary={date} />
                              </ListItem>
                            );
                          })}
                        </List>
                      </>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DateRangeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <>
                        <>{t("Last modified")}:</>
                        <List className={classes.dateFields}>
                          {prepareLastModifiedDate().map((date) => {
                            return (
                              <ListItem>
                                <ListItemText primary={date} />
                              </ListItem>
                            );
                          })}
                        </List>
                      </>
                    }
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </>
      )}
    </>
  );
};

export default PreviewProperties;
