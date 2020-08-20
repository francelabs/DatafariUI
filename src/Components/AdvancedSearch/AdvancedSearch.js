import React, { useState, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { QueryContext } from '../../Contexts/query-context';

const OP = 'OP';
const FIELD = 'FIELD';
const ALL_WORDS = 'ALL_WORDS';
const EXACT = 'EXACT';
const AT_LEAST_ONE = 'AT_LEAST_ONE';
const NOT = 'NOT';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AdvancedSearch = () => {
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { t } = useTranslation();
  const [additionalFields, setAdditionalFields] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    //setAdditionalFields([]);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const dispatch = (action) => {
    const newAdditionalFields = [...additionalFields];
    switch (action.type) {
      case OP:
        newAdditionalFields[action.id].op = action.value;
        break;
      case FIELD:
        newAdditionalFields[action.id].field = action.value;
        break;
      case ALL_WORDS:
        newAdditionalFields[action.id].allWords = action.value;
        break;
      case EXACT:
        newAdditionalFields[action.id].exact = action.value;
        break;
      case AT_LEAST_ONE:
        newAdditionalFields[action.id].atLeastOne = action.value;
        break;
      case NOT:
        newAdditionalFields[action.id].not = action.value;
        break;
      default:
        break;
    }
    setAdditionalFields(newAdditionalFields);
  };

  const addField = () => {
    setAdditionalFields([
      ...additionalFields,
      {
        op: 'OR',
        field: '',
        allWords: '',
        exact: '',
        atLeastOne: '',
        not: '',
      },
    ]);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className="modal">
          <div className="modal__content">
            <div>
              <span>{t('Advanced Search')}</span>
            </div>
            <div>
              <span>{t('Basic Search')}</span>
            </div>
            <div>
              <TextField
                id="advanced-search-all-words"
                label={t('All words')}
                helperText={t('Will search for ALL the terms listed')}
                variant="filled"
              />
            </div>
            <div>
              <TextField
                id="advanced-search-exact-expression"
                label={t('Exact expression')}
                helperText={t(
                  'Will search for EXACTLY the sentence you entered'
                )}
                variant="filled"
              />
            </div>
            <div>
              <TextField
                id="advanced-search-at-least-one-word"
                label={t('At least one word')}
                helperText={t(
                  'Will search for documents with AT LEAST ONE of these terms'
                )}
                variant="filled"
              />
            </div>
            <div>
              <TextField
                id="advanced-search-not-these-words"
                label={t('Not these words')}
                helperText={t(
                  'Will NOT DISPLAY documents with AT LEAST ONE of these terms'
                )}
                variant="filled"
              />
            </div>
            <Divider />
            {additionalFields.map((field, index) => {
              return (
                <AdvancedSearchField
                  {...field}
                  id={index}
                  dispatch={dispatch}
                />
              );
            })}
            <div>
              <Button onClick={addField}>{t('Add a search field')}</Button>
              <span>
                {t(
                  'Click if you need to search in a specific field or want to combine with several fields or with basic search'
                )}
              </span>
            </div>
            <div>
              <Button>Search</Button>
            </div>
          </div>
        </div>
      </Modal>
      <MenuItem>
        <Button onClick={handleOpen}>{t('Advanced Search')}</Button>
      </MenuItem>
    </>
  );
};

const AdvancedSearchField = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id={`advanced-search-field-${props.id}-op-label`}>
            {t('Operator')}
          </InputLabel>
          <Select
            labelId={`advanced-search-field-${props.id}-op-label`}
            id={`advanced-search-field-${props.id}-op`}
            value={props.op}
            onChange={(event) => {
              props.dispatch({
                type: OP,
                id: props.id,
                value: event.target.value,
              });
            }}
            variant="filled"
          >
            <MenuItem value="OR">{t('OR')}</MenuItem>
            <MenuItem value="AND">{t('AND')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id={`advanced-search-field-${props.id}-field-label`}>
            {t('Field')}
          </InputLabel>
          <Select
            labelId={`advanced-search-field-${props.id}-field-label`}
            id={`advanced-search-field-${props.id}-field`}
            value={props.field}
            onChange={(event) => {
              props.dispatch({
                type: FIELD,
                id: props.id,
                value: event.target.value,
              });
            }}
            variant="filled"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="OR">{t('OR')}</MenuItem>
            <MenuItem value="AND">{t('AND')}</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <TextField
          id={`advanced-search-${props.id}-all-words`}
          label={t('All words')}
          helperText={t('Will search for ALL the terms listed')}
          value={props.allWords}
          onChange={(event) => {
            props.dispatch({
              type: ALL_WORDS,
              id: props.id,
              value: event.target.value,
            });
          }}
          variant="filled"
        />
      </div>
      <div>
        <TextField
          id={`advanced-search-${props.id}-exact-expression`}
          label={t('Exact expression')}
          helperText={t('Will search for EXACTLY the sentence you entered')}
          value={props.exact}
          onChange={(event) => {
            props.dispatch({
              type: EXACT,
              id: props.id,
              value: event.target.value,
            });
          }}
          variant="filled"
        />
      </div>
      <div>
        <TextField
          id={`advanced-search-${props.id}-at-least-one-word`}
          label={t('At least one word')}
          helperText={t(
            'Will search for documents with AT LEAST ONE of these terms'
          )}
          value={props.atLeastOne}
          onChange={(event) => {
            props.dispatch({
              type: AT_LEAST_ONE,
              id: props.id,
              value: event.target.value,
            });
          }}
          variant="filled"
        />
      </div>
      <div>
        <TextField
          id={`advanced-search-${props.id}-not-these-words`}
          label={t('Not these words')}
          helperText={t(
            'Will NOT DISPLAY documents with AT LEAST ONE of these terms'
          )}
          value={props.not}
          onChange={(event) => {
            props.dispatch({
              type: NOT,
              id: props.id,
              value: event.target.value,
            });
          }}
          variant="filled"
        />
      </div>
      <Divider />
    </div>
  );
};

export default AdvancedSearch;
