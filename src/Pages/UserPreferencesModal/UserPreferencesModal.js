import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogTitle from '../../Components/DialogTitle/DialogTitle';
import { APIEndpointsContext } from '../../Contexts/api-endpoints-context';
import { UIConfigContext } from '../../Contexts/ui-config-context';
import { UserContext } from '../../Contexts/user-context';
import useHttp from '../../Hooks/useHttp';
import UserPreferenceTitle from './UserPreferenceTitle';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'grid',
    gap: '1em',
  },

  title: {
    paddingBottom: '0.5em',
  },

  facetsContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '0.85em',
  },

  listOrder: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },

  fieldsPadding: {
    paddingBottom: theme.spacing(2),
  },
}));

const UserPreferencesModal = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { isLoading, data, error, sendRequest } = useHttp();
  const { apiEndpointsContext } = useContext(APIEndpointsContext);
  const { uiDefinition, defaultUiDefinition } = useContext(UIConfigContext);
  const { actions } = useContext(UserContext);

  // States
  const [facetsPosition, setFacetPosition] = useState(
    uiDefinition.direction || 'ltr' // default is ltr
  );
  const [leftFacetsOrder, setLeftFacetsOrder] = useState(uiDefinition.left || []);
  const [rightFacetsOrder, setRightFacetsOrder] = useState(uiDefinition.right || []);

  const [sources, setSources] = useState([]);

  useEffect(() => {
    let newQueryID = Math.random().toString(36).substring(2, 15);
    sendRequest(
      `${apiEndpointsContext.searchURL}/select?q=*:*&facet.field=repo_source&facet=true`,
      'GET',
      null,
      newQueryID
    );
  }, [apiEndpointsContext.searchURL, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      setSources(formatSource(data));
    }
  }, [isLoading, data, error]);

  function formatSource(data) {
    const { facet_counts } = data;

    return facet_counts?.facet_fields?.repo_source.filter((source, index) => index % 2 === 0) || [];
  }

  // const handleFacetLocationChange = ({ target: { value = '' } }) => {
  //   setFacetPosition(value);
  // };

  const handleEntityOrder = (entity, entities, stateCallback, isUp) => {
    const facetIndex = entities.findIndex((f) => entity === f);
    const newEntities = entities.filter((f, index) => index !== facetIndex);
    newEntities.splice(
      isUp ? Math.max(facetIndex - 1, 0) : Math.min(facetIndex + 1, entities.length),
      0,
      entity
    );

    stateCallback(newEntities);
  };

  const handleChangeFacetPosition = (facet, source, setSource, target, setTarget) => {
    setSource(source.filter((f) => f !== facet));
    setTarget([...target, facet]);
  };

  const handleShowFacet = (checked, facet, source, target) => {
    target(
      source.map((f) => {
        if (f === facet) {
          return {
            ...f,
            show: checked,
          };
        }
        return f;
      })
    );
  };

  const handleReset = () => {
    // Reset from uiDefinition values
    setFacetPosition(defaultUiDefinition.direction || 'ltr');
    setLeftFacetsOrder([...defaultUiDefinition.left] || []);
    setRightFacetsOrder([...defaultUiDefinition.right] || []);
    setSources([...defaultUiDefinition.sources] || formatSource(data));
  };

  const handleClose = useCallback(() => {
    actions.updateUserUiDefinition({
      direction: facetsPosition,
      left: leftFacetsOrder,
      right: rightFacetsOrder,
      sources,
    });
    props.onClose();
  }, [props, actions, facetsPosition, leftFacetsOrder, rightFacetsOrder, sources]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth="md"
      className={classes.dialog}>
      <DialogTitle onClose={props.onClose}>{t('User Preferences')}</DialogTitle>
      <Divider />
      <DialogContent>
        <div className={classes.content}>
          {/* FACETS POSITION */}
          {/* TODO: TBD: Left/right reading to be implemented in main panel only */}
          {/* <div>
            <UserPreferenceTitle
              title={t("Facets position")}
              tooltip={t("Facets position tooltip")}
            />
            <RadioGroup
              aria-label="facet-location"
              name="facet-location"
              value={facetsPosition}
              onChange={handleFacetLocationChange}
            >
              <FormControlLabel
                value="ltr"
                control={<Radio />}
                label={t("Left")}
              />
              <FormControlLabel
                value="rtl"
                control={<Radio />}
                label={t("Right")}
              />
            </RadioGroup>
          </div> */}

          {/* FACETS ORDER */}
          <div className={classes.facetsContent}>
            {/* LEFT FACETS ORDER */}
            <div>
              <UserPreferenceTitle
                title={t('Left facets order')}
                tooltip={t('Left facets order tooltip')}
              />

              {leftFacetsOrder.map((facet, index) => (
                <div className={classes.listOrder}>
                  <div key={facet.field}>
                    <Checkbox
                      style={{ padding: 0 }}
                      checked={facet.show === undefined ? true : facet.show}
                      onClick={(e) =>
                        handleShowFacet(
                          e.target.checked,
                          facet,
                          leftFacetsOrder,
                          setLeftFacetsOrder
                        )
                      }
                    />{' '}
                    {index + 1} - {t(facet.title)}{' '}
                  </div>
                  <div>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEntityOrder(facet, leftFacetsOrder, setLeftFacetsOrder, true)
                      }>
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEntityOrder(facet, leftFacetsOrder, setLeftFacetsOrder)}>
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleChangeFacetPosition(
                          facet,
                          leftFacetsOrder,
                          setLeftFacetsOrder,
                          rightFacetsOrder,
                          setRightFacetsOrder
                        )
                      }>
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT FACETS ORDER */}
            <div>
              <UserPreferenceTitle
                title={t('Right facets order')}
                tooltip={t('Right facets order tooltip')}
              />
              {rightFacetsOrder.map((facet, index) => (
                <div className={classes.listOrder}>
                  <div key={facet.field}>
                    <Checkbox
                      style={{ padding: 0 }}
                      checked={facet.show === undefined ? true : facet.show}
                      onClick={(e) =>
                        handleShowFacet(
                          e.target.checked,
                          facet,
                          rightFacetsOrder,
                          setRightFacetsOrder
                        )
                      }
                    />{' '}
                    {index + 1} - {t(facet.title)}{' '}
                  </div>
                  <div>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEntityOrder(facet, rightFacetsOrder, setRightFacetsOrder, true)
                      }>
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEntityOrder(facet, rightFacetsOrder, setRightFacetsOrder)
                      }>
                      <ArrowDownIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleChangeFacetPosition(
                          facet,
                          rightFacetsOrder,
                          setRightFacetsOrder,
                          leftFacetsOrder,
                          setLeftFacetsOrder
                        )
                      }>
                      <ArrowLeftIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOURCES */}
          <div>
            <UserPreferenceTitle title={t('Sources order')} tooltip={t('Sources order tooltip')} />
            <div className={classes.listOrder}>
              <div className={classes.listOrder}>
                {sources.map((source, index) => (
                  <>
                    <div key={source}>
                      {index + 1} - {t(source)}{' '}
                    </div>
                    <div>
                      <IconButton
                        size="small"
                        onClick={() => handleEntityOrder(source, sources, setSources, true)}>
                        <ArrowUpIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEntityOrder(source, sources, setSources)}>
                        <ArrowDownIcon />
                      </IconButton>
                    </div>
                  </>
                ))}
              </div>
              <div />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="primary" variant="contained" size="small">
          {t('Reset')}
        </Button>
        <Button onClick={handleClose} color="secondary" variant="contained" size="small">
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPreferencesModal;
