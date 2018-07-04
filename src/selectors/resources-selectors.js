import { createSelector } from 'reselect';

export const resourcesSelector = state => state.resources;

export const objectsSelector = createSelector(
  resourcesSelector,
  resourcesState => resourcesState.objects,
);

export const childResourcesSelector = (requestedResourceId = 'root') =>
  createSelector(objectsSelector, objectsState =>
    Object.keys(objectsState)
      .map(resourceId => objectsState[resourceId])
      .filter(resource => resource.parentResourceId === requestedResourceId));

export const childResourcesIdsSelector = (requestedResourceId = 'root') =>
  createSelector(childResourcesSelector(requestedResourceId), childResourcesArray =>
    childResourcesArray.map(({ id }) => id));

export const resourceSelector = (requestedResourceId = 'root') =>
  createSelector(objectsSelector, objectsState => objectsState[requestedResourceId]);
