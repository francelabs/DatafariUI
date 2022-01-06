import {
  ClickAwayListener,
  Divider,
  ListSubheader,
  makeStyles,
  MenuItem,
  MenuList,
  Typography,
} from '@material-ui/core';
import React, {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.drawer,
    borderRadius: '5px',
  },
  menulist: {
    border: 'solid 1px',
    borderRadius: '5px',
    '&:empty': {
      display: 'none',
    },
  },
  autocompleteTitleContainer: {
    display: 'flex',
  },

  autocompleteTitle: {
    flexGrow: 1,
  },
}));

const AutocompleteContainer = ({
  children,
  queryText,
  className,
  suggesters,
  onSelect,
}) => {
  const classes = useStyles();
  const [querySuggestion, setQuerySuggestion] = useState(false);
  const firstUpdate = useRef(true);
  const { t } = useTranslation();

  useEffect(() => {
    let timer = undefined;
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      setQuerySuggestion(false);
      if (queryText) {
        timer = setTimeout(() => {
          setQuerySuggestion(true);
        }, 500);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [setQuerySuggestion, queryText]);

  const buildOnSelect = useCallback((onSelectFn) => {
    return (suggestion) => {
      setQuerySuggestion(false);
      firstUpdate.current = true;
      onSelectFn(suggestion);
    };
  }, []);

  const handleKeyDown = (event) => {
    // Wait until IME is settled.
    if (event.which !== 229) {
      switch (event.key) {
        case 'Home':
          // if (popupOpen && handleHomeEndKeys) {
          //   // Prevent scroll of the page
          //   event.preventDefault();
          //   changeHighlightedIndex({ diff: 'start', direction: 'next', reason: 'keyboard', event });
          // }
          break;
        case 'End':
          // if (popupOpen && handleHomeEndKeys) {
          //   // Prevent scroll of the page
          //   event.preventDefault();
          //   changeHighlightedIndex({
          //     diff: 'end',
          //     direction: 'previous',
          //     reason: 'keyboard',
          //     event,
          //   });
          // }
          break;
        case 'PageUp':
          // Prevent scroll of the page
          // event.preventDefault();
          // changeHighlightedIndex({
          //   diff: -pageSize,
          //   direction: 'previous',
          //   reason: 'keyboard',
          //   event,
          // });
          // handleOpen(event);
          break;
        case 'PageDown':
          // Prevent scroll of the page
          // event.preventDefault();
          // changeHighlightedIndex({ diff: pageSize, direction: 'next', reason: 'keyboard', event });
          // handleOpen(event);
          break;
        case 'ArrowDown':
          // Prevent cursor move
          // event.preventDefault();
          // changeHighlightedIndex({ diff: 1, direction: 'next', reason: 'keyboard', event });
          // handleOpen(event);
          break;
        case 'ArrowUp':
          // Prevent cursor move
          // event.preventDefault();
          // changeHighlightedIndex({ diff: -1, direction: 'previous', reason: 'keyboard', event });
          // handleOpen(event);
          break;
        case 'ArrowLeft':
          // handleFocusTag(event, 'previous');
          break;
        case 'ArrowRight':
          // handleFocusTag(event, 'next');
          break;
        case 'Enter':
          // if (highlightedIndexRef.current !== -1 && popupOpen) {
          //   const option = filteredOptions[highlightedIndexRef.current];
          //   const disabled = getOptionDisabled ? getOptionDisabled(option) : false;

          //   // Avoid early form validation, let the end-users continue filling the form.
          //   event.preventDefault();

          //   if (disabled) {
          //     return;
          //   }

          //   selectNewValue(event, option, 'selectOption');

          //   // Move the selection to the end.
          //   if (autoComplete) {
          //     inputRef.current.setSelectionRange(
          //       inputRef.current.value.length,
          //       inputRef.current.value.length,
          //     );
          //   }
          // } else if (freeSolo && inputValue !== '' && inputValueIsSelectedValue === false) {
          //   if (multiple) {
          //     // Allow people to add new values before they submit the form.
          //     event.preventDefault();
          //   }
          //   selectNewValue(event, inputValue, 'createOption', 'freeSolo');
          // }
          break;
        case 'Escape':
          // if (popupOpen) {
          //   // Avoid Opera to exit fullscreen mode.
          //   event.preventDefault();
          //   // Avoid the Modal to handle the event.
          //   event.stopPropagation();
          //   handleClose(event, 'escape');
          // } else if (clearOnEscape && (inputValue !== '' || (multiple && value.length > 0))) {
          //   // Avoid Opera to exit fullscreen mode.
          //   event.preventDefault();
          //   // Avoid the Modal to handle the event.
          //   event.stopPropagation();
          //   handleClear(event);
          // }
          break;
        case 'Backspace':
          // if (multiple && inputValue === '' && value.length > 0) {
          //   const index = focusedTag === -1 ? value.length - 1 : focusedTag;
          //   const newValue = value.slice();
          //   newValue.splice(index, 1);
          //   handleValue(event, newValue, 'removeOption', {
          //     option: value[index],
          //   });
          // }
          break;
        default:
      }
    }
  };

  useEffect(() => {
    if (querySuggestion) {
      if (Array.isArray(suggesters)) {
        suggesters.forEach((suggester) => {
          if (suggester.querySuggestions) {
            suggester.querySuggestions(queryText);
          }
        });
      }
    }
  }, [querySuggestion, queryText, suggesters]);

  return (
    <div
      className={className ? className : classes.autocomplete}
      style={{
        visibility: querySuggestion ? 'visible' : 'hidden',
      }}
    >
      <ClickAwayListener onClickAway={() => setQuerySuggestion(false)}>
        <MenuList
          classes={{ root: classes.menulist }}
          onKeyDown={handleKeyDown}
        >
          {/* {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child, {
                active: querySuggestion,
                onSelect: buildOnSelect(child.props.onSelect),
              });
            }

            return child;
          })} */}
          {Array.isArray(suggesters) &&
            suggesters.map((suggester) => {
              if (
                !suggester.loading &&
                Array.isArray(suggester.suggestions) &&
                suggester.suggestions.length > 0
              ) {
                const title = suggester.title ?? t('Suggestions');
                const subtitle =
                  suggester.subtitle ??
                  t('Proposed completions for your query');
                return (
                  <>
                    <ListSubheader
                      className={classes.autocompleteTitleContainer}
                      disableSticky={true}
                    >
                      <Typography className={classes.autocompleteTitle}>
                        {title}
                      </Typography>
                      <Typography>{subtitle}</Typography>
                    </ListSubheader>
                    <Divider />
                    {suggester.suggestions &&
                      suggester.suggestions.length > 0 &&
                      suggester.suggestions.map((element) => (
                        <MenuItem
                          onClick={() => {
                            if (suggester.onSelect) {
                              suggester.onSelect(element, onSelect);
                            } else {
                              onSelect(element);
                            }
                          }}
                        >
                          {element}
                        </MenuItem>
                      ))}
                  </>
                );
              } else {
                return [];
              }
            })}
        </MenuList>
      </ClickAwayListener>
    </div>
  );
};

export default AutocompleteContainer;
