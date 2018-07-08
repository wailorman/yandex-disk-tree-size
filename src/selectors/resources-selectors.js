import { createSelector } from 'reselect';

export const resourcesStateSelector = state => state.resources;

// ----------------------

export const objectsSelector = createSelector(
  resourcesStateSelector,
  resourcesState => resourcesState.objects || {},
);

export const hasManyRelationsSelector = createSelector(
  resourcesStateSelector,
  resourcesState => resourcesState.hasManyRelations,
);

export const belongsToRelationsSelector = createSelector(
  resourcesStateSelector,
  resourcesState => resourcesState.belongsToRelations,
);

export const openedSelector = createSelector(
  resourcesStateSelector,
  resourcesState => resourcesState.opened,
);

// ----------------------

export const childResourcesIdsSelector = (requestedResourceId = 'root') =>
  createSelector(hasManyRelationsSelector, objectsSelector, (hasManyRelationsState, objects) =>
    Object.keys(hasManyRelationsState[requestedResourceId] || {}).sort((resIdA, resIdB) => {
      const { size: sizeA } = objects[resIdA];
      const { size: sizeB } = objects[resIdB];
      return (sizeB || 0) - (sizeA || 0);
    }));

// export const childResourcesSelector = (requestedResourceId = 'root') =>
//   createSelector(objectsSelector, objectsState =>
//     Object.keys(objectsState)
//       .map(resourceId => objectsState[resourceId])
//       .filter(resource => resource.parentResourceId === requestedResourceId));

export const resourceSelector = (requestedResourceId = 'root') =>
  createSelector(objectsSelector, objectsState => objectsState[requestedResourceId] || {});

export const isResourceOpenedSelector = requestedResourceId =>
  createSelector(openedSelector, openedState => !!openedState[requestedResourceId]);
