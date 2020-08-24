import React, { useEffect, useState } from 'react';
import {
  MenuList,
  MenuItem,
  useTheme,
  ListSubheader,
  Typography,
  Divider,
  makeStyles,
} from '@material-ui/core';
import useHttp from '../../../../Hooks/useHttp';
import Spinner from '../../../Spinner/Spinner';

const useStyles = makeStyles((theme) => ({
  autocompleteTitleContainer: {
    display: 'flex',
  },

  autocompleteTitle: {
    flexGrow: 1,
  },
}));

const SimpleAutocomplete = (props) => {
  const baseURL = '/Datafari/SearchAggregator';
  const theme = useTheme();
  const { isLoading, data, error, sendRequest, reqIdentifier } = useHttp();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryID, setQueryID] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (props.active) {
      setSuggestions([]);
      setLoading(true);
      let newQueryID = Math.random().toString(36).substring(2, 15);
      setQueryID(newQueryID);
      sendRequest(
        `${baseURL}/suggest?action=suggest&q=${props.queryText}&autocomplete=true&spellcheck.collateParam=${props.op}`,
        'GET',
        null,
        newQueryID
      );
    }
  }, [props, sendRequest, setSuggestions]);

  useEffect(() => {
    if (!isLoading && !error && data && reqIdentifier === queryID) {
      if (data.spellcheck.collations) {
        const newSuggestions = data.spellcheck.collations
          .filter((element) => {
            return element && element !== 'collation' && element.collationQuery;
          })
          .map((element) => {
            return element.collationQuery;
          });
        setSuggestions(newSuggestions);
        setLoading(false);
      }
    }
  }, [data, error, isLoading, setSuggestions, reqIdentifier, queryID]);

  return (
    props.active &&
    (loading ? (
      <Spinner />
    ) : (
      <>
        <ListSubheader className={classes.autocompleteTitleContainer}>
          <Typography className={classes.autocompleteTitle}>
            SUGGESTED QUERIES
          </Typography>
          <Typography>Queries extending you current query terms</Typography>
        </ListSubheader>
        <Divider />
        {suggestions &&
          suggestions.length > 0 &&
          suggestions.map((element) => (
            <MenuItem
              onClick={() => {
                if (props.onSelect) {
                  props.onSelect(element);
                }
              }}
            >
              {element}
            </MenuItem>
          ))}
        {(!suggestions || suggestions.length === 0) && (
          <Typography>No suggestions</Typography>
        )}
      </>
    ))
  );
};

export default SimpleAutocomplete;
