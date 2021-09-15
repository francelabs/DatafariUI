import { makeStyles } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  QueryContext,
  REGISTER_FIELD_FACET,
  SET_FIELD_FACET_SELECTED,
} from '../../Contexts/query-context';
import TreeView from '@material-ui/lab/TreeView';
import { ResultsContext } from '../../Contexts/results-context';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import produce from 'immer';
import CustomTreeItem from './CustomTreeItem';

export const CHECKED_STATE = 'checked';
export const UNCHECKED_STATE = 'unchecked';
export const UNDETERMINATE_STATE = 'undeterminate';

const useStyles = makeStyles((theme) => ({}));

const HierarchicalFacet = (props) => {
  const { query, dispatch: queryDispatch } = useContext(QueryContext);
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { field, separator, title } = props;
  const { results } = useContext(ResultsContext);
  const [hierarchyState, setHierarchyState] = useState({});

  const getItemDepthAndName = useCallback(
    (itemID) => {
      const itemDepth = parseInt(
        itemID.substring(0, itemID.indexOf(separator)),
        10
      );
      // determines the item name, label are of the form "depth" + separator + path using separator as delimiter between levels
      // e.g. 2/level0/level1/level2 using "/" as the separator.
      const itemName = itemID.substring(itemID.indexOf(separator));
      return [itemDepth, itemName];
    },
    [separator]
  );

  const extractSelected = useCallback(
    (item, hierarchy) => {
      const itemDepth = getItemDepthAndName(item.original)[0];
      switch (item.checked) {
        case CHECKED_STATE:
          // All children are selected too but they are all
          // retrieved when using the parent in the facet.
          return [item.original];
        case UNDETERMINATE_STATE:
          // Some children are selected but not others,
          // recursively retrieve the list.
          let result = [];
          item.children.forEach((childName) => {
            result = result.concat(
              extractSelected(
                hierarchy[`level${itemDepth + 1}`][childName],
                hierarchy
              )
            );
          });
          return result;
        case UNCHECKED_STATE:
        default:
          // All children are not selected too, we can stop
          // there and send an empty array
          return [];
      }
    },
    [getItemDepthAndName]
  );

  const getSelectedListForFacet = useCallback(
    (hierarchy) => {
      let selected = [];
      // Ensure we are using the expected format and retrieve the lowest level
      let lowestDepth = undefined;
      const levelRegex = /^level[0-9]+$/;
      Object.getOwnPropertyNames(hierarchy).forEach((levelName) => {
        if (levelRegex.test(levelName)) {
          const currentLevel = parseInt(levelName.substring(5), 10);
          if (lowestDepth === undefined || currentLevel < lowestDepth) {
            lowestDepth = currentLevel;
          }
        }
      });
      // For any item at the lowest level, extract the list of selected items
      // and add it to the selected array
      if (lowestDepth !== undefined) {
        Object.getOwnPropertyNames(hierarchy[`level${lowestDepth}`]).forEach(
          (itemName) => {
            selected = selected.concat(
              extractSelected(
                hierarchy[`level${lowestDepth}`][itemName],
                hierarchy
              )
            );
          }
        );
      }

      return selected;
    },
    [extractSelected]
  );

  const itemClicked = useCallback(
    (itemID) => {
      setHierarchyState((currentHierarchyState) => {
        if (!itemID || !currentHierarchyState) {
          return;
        }
        return produce(currentHierarchyState, (hierarchyStateDraft) => {
          const recursivelySetState = (item, newState) => {
            if (!item) {
              return item;
            }
            const [itemDepth, itemName] = getItemDepthAndName(item.original);
            hierarchyStateDraft[`level${itemDepth}`][itemName] = produce(
              hierarchyStateDraft[`level${itemDepth}`][itemName],
              (itemDraft) => {
                itemDraft.checked = newState;
              }
            );
            if (item.children) {
              item.children.forEach((childName) => {
                const childDepth = itemDepth + 1;
                const childItem =
                  currentHierarchyState[`level${childDepth}`][childName];
                recursivelySetState(childItem, newState);
              });
            }
          };

          const updateParents = (item) => {
            const [itemDepth, itemName] = getItemDepthAndName(item.original);

            let parentName = itemName.substring(
              0,
              itemName.lastIndexOf(separator)
            );
            if (parentName === '') {
              parentName = separator;
            }
            if (
              hierarchyStateDraft['level' + (itemDepth - 1)] &&
              hierarchyStateDraft['level' + (itemDepth - 1)][parentName]
            ) {
              const parentItem =
                hierarchyStateDraft['level' + (itemDepth - 1)][parentName];
              const childrenCheckedStates = parentItem.children.map(
                (currentItemName) => {
                  const childDepth = itemDepth;
                  const currentItem =
                    hierarchyStateDraft[`level${childDepth}`][currentItemName];
                  return currentItem.checked;
                }
              );
              if (childrenCheckedStates.includes(CHECKED_STATE)) {
                if (
                  childrenCheckedStates.includes(UNCHECKED_STATE) ||
                  childrenCheckedStates.includes(UNDETERMINATE_STATE)
                ) {
                  hierarchyStateDraft['level' + (itemDepth - 1)][
                    parentName
                  ].checked = UNDETERMINATE_STATE;
                } else {
                  hierarchyStateDraft['level' + (itemDepth - 1)][
                    parentName
                  ].checked = CHECKED_STATE;
                }
              } else {
                if (childrenCheckedStates.includes(UNDETERMINATE_STATE)) {
                  hierarchyStateDraft['level' + (itemDepth - 1)][
                    parentName
                  ].checked = UNDETERMINATE_STATE;
                } else {
                  hierarchyStateDraft['level' + (itemDepth - 1)][
                    parentName
                  ].checked = UNCHECKED_STATE;
                }
              }
              updateParents(parentItem);
            }
          };
          const itemDepth = parseInt(
            itemID.substring(0, itemID.indexOf(separator)),
            10
          );
          const itemName = itemID.substring(itemID.indexOf(separator));
          const currentItem =
            hierarchyStateDraft[`level${itemDepth}`][itemName];
          switch (currentItem.checked) {
            case CHECKED_STATE:
            case UNDETERMINATE_STATE:
              // uncheck this and children
              recursivelySetState(currentItem, UNCHECKED_STATE);
              break;
            case UNCHECKED_STATE:
            default:
              // check this and parents
              recursivelySetState(currentItem, CHECKED_STATE);
              break;
          }
          updateParents(currentItem);
          queryDispatch({
            type: SET_FIELD_FACET_SELECTED,
            facetId: field,
            selected: getSelectedListForFacet(hierarchyStateDraft),
          });
        });
      });
    },
    [
      field,
      getItemDepthAndName,
      getSelectedListForFacet,
      queryDispatch,
      separator,
    ]
  );

  const renderTreeItem = useCallback(
    (hierearchyItem, hierearchyItemName, hierarchyState) => {
      if (!hierearchyItem) {
        return;
      }
      const itemDepth = parseInt(
        hierearchyItem.original.substring(
          0,
          hierearchyItem.original.indexOf(separator)
        ),
        10
      );
      return (
        <CustomTreeItem
          id={hierearchyItem.original}
          label={hierearchyItemName}
          number={hierearchyItem.nb}
          onClick={itemClicked}
          checked={hierearchyItem.checked}
        >
          {hierearchyItem.children.map(
            (childName) =>
              hierarchyState[`level${itemDepth + 1}`] &&
              renderTreeItem(
                hierarchyState[`level${itemDepth + 1}`][childName],
                childName,
                hierarchyState
              )
          )}
        </CustomTreeItem>
      );
    },
    [itemClicked, separator]
  );

  // Effect to add the facet to the query if it is not registered
  useEffect(() => {
    const newFacet = {
      id: field,
      field: field,
      tag: field,
      op: 'OR',
      title: title,
    };
    queryDispatch({ type: REGISTER_FIELD_FACET, fieldFacet: newFacet });
  }, [field, queryDispatch, title]);

  useEffect(() => {
    // Checks if an ancestor of a particular item is selected
    const ancestorInList = (item, list) => {
      const itemName = getItemDepthAndName(item.original)[1];
      const resultsList = list.map((selectedItemID) => {
        const selectedItemName = getItemDepthAndName(selectedItemID)[1];
        return itemName.includes(selectedItemName);
      });
      return resultsList.reduce(
        (previous, current) => previous || current,
        false
      );
    };

    // Checks if a descendent of a particular item is selected
    const descendentInList = (item, list) => {
      const itemName = getItemDepthAndName(item.original)[1];
      const resultsList = list.map((selectedItemID) => {
        const selectedItemName = getItemDepthAndName(selectedItemID)[1];
        return selectedItemName.includes(itemName);
      });
      return resultsList.reduce(
        (previous, current) => previous || current,
        false
      );
    };
    // Build a hierarchy map from the results to be displayed
    const hierarchyMap = {};
    // Used to initialize items when they need to be created
    const defaultItem = {
      children: [],
      nb: 0,
      original: '',
      checked: UNCHECKED_STATE,
    };
    if (results.fieldFacets[field]) {
      const data = results.fieldFacets[field];

      const selected = query.selectedFieldFacets[field]
        ? query.selectedFieldFacets[field]
        : [];
      // sorl facet structure is an array, odd indexes are labels, even indexes are the numbers of document matching the previous index label
      for (let i = 0; i < data.length; i += 2) {
        const solrFacetLabel = data[i];
        const numberOfDocs = data[i + 1];
        const itemDepth = parseInt(
          solrFacetLabel.substring(0, solrFacetLabel.indexOf(separator)),
          10
        );
        // determines the item name, label are of the form "depth" + separator + path using separator as delimiter between levels
        // e.g. 2/level0/level1/level2 using "/" as the separator.
        const itemName = solrFacetLabel.substring(
          solrFacetLabel.indexOf(separator)
        );
        if (hierarchyMap['level' + itemDepth] === undefined) {
          hierarchyMap['level' + itemDepth] = {};
        }
        if (hierarchyMap['level' + itemDepth][itemName] === undefined) {
          hierarchyMap['level' + itemDepth][itemName] = produce(
            defaultItem,
            (itemDraft) => {}
          );
        }
        // We don't want to modify the children array here if the parent has been created by a child.
        hierarchyMap['level' + itemDepth][itemName] = produce(
          hierarchyMap['level' + itemDepth][itemName],
          (item) => {
            item.nb = numberOfDocs;
            item.original = solrFacetLabel;
          }
        );

        if (itemDepth > 0) {
          // determines the parent item key
          let parentItem = itemName.substring(
            0,
            itemName.lastIndexOf(separator)
          );
          if (parentItem === '') {
            parentItem = separator;
          }
          if (hierarchyMap['level' + (itemDepth - 1)] === undefined) {
            hierarchyMap['level' + (itemDepth - 1)] = {};
          }
          if (
            hierarchyMap['level' + (itemDepth - 1)][parentItem] === undefined
          ) {
            // If parent level does not exist, create it
            hierarchyMap['level' + (itemDepth - 1)][parentItem] = produce(
              defaultItem,
              (itemDraft) => {}
            );
          }
          hierarchyMap['level' + (itemDepth - 1)][parentItem] = produce(
            hierarchyMap['level' + (itemDepth - 1)][parentItem],
            (parentItem) => {
              // add the name of the current level in the parent level children list as a reference
              parentItem.children[parentItem.children.length] = itemName;
            }
          );
        }

        if (
          hierarchyMap['level' + itemDepth][itemName].checked ===
            UNCHECKED_STATE &&
          selected.includes(
            hierarchyMap['level' + itemDepth][itemName].original
          )
        ) {
          hierarchyMap['level' + itemDepth][itemName] = produce(
            hierarchyMap['level' + itemDepth][itemName],
            (item) => {
              item.checked = CHECKED_STATE;
            }
          );
        } else {
          // So the current item is not directly in the selected list.
          // We need to check if an ancestor or a descendent is.
          if (
            ancestorInList(
              hierarchyMap['level' + itemDepth][itemName],
              selected
            )
          ) {
            hierarchyMap['level' + itemDepth][itemName] = produce(
              hierarchyMap['level' + itemDepth][itemName],
              (item) => {
                item.checked = CHECKED_STATE;
              }
            );
          } else if (
            descendentInList(
              hierarchyMap['level' + itemDepth][itemName],
              selected
            )
          ) {
            hierarchyMap['level' + itemDepth][itemName] = produce(
              hierarchyMap['level' + itemDepth][itemName],
              (item) => {
                item.checked = UNDETERMINATE_STATE;
              }
            );
          }
        }
      }
    }
    setHierarchyState(produce(hierarchyMap, (draft) => {}));
  }, [
    field,
    getItemDepthAndName,
    query.selectedFieldFacets,
    results.fieldFacets,
    separator,
  ]);
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {hierarchyState['level0'] &&
        Object.getOwnPropertyNames(hierarchyState['level0']).map(
          (hierearchyItemName) => {
            return renderTreeItem(
              hierarchyState['level0'][hierearchyItemName],
              hierearchyItemName,
              hierarchyState
            );
          }
        )}
    </TreeView>
  );
};

export default HierarchicalFacet;
