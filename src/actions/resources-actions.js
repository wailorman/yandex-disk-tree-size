import Promise from 'bluebird';
import * as AT from '../constants/action-types';
import * as ResourcesSelectors from '../selectors/resources-selectors';
import * as ResourcesPuller from '../api/puller';
import { db } from '../api/db';

let yandexDiskPuller;

export const startFetchingResources = () => async (dispatch, getState) => {
  dispatch({ type: AT.START_FETCHING_RESOURCES });

  yandexDiskPuller = await ResourcesPuller.configure({
    onChange: async (resourcesIds) => {
      const resources = await Promise.map(resourcesIds, resourceId => db.resources.get(resourceId));
      dispatch({ type: AT.RESOURCE_FETCH_SUCCESS, payload: { resources } });
    },
    throttle: 2000,
    rootResources: [
      {
        id: 'root',
        name: 'root',
        path: '/',
      },
      {
        id: 'disk',
        name: 'Disk',
        path: 'disk:/',
        parentResourceId: 'root',
      },
      {
        id: 'trash',
        name: 'Trash',
        path: 'trash:/',
        parentResourceId: 'root',
      },
    ],
    tasks: [
      {
        id: 'disk',
        path: 'disk:/',
      },
      // {
      //   id: 'trash',
      //   path: 'trash:/',
      // },
    ],
  });

  yandexDiskPuller.start();

  const presentedResourcesIds = Object.keys(ResourcesSelectors.objectsSelector(getState()));
  yandexDiskPuller.subscribeTo(presentedResourcesIds);
};

export const changeCollapsedState = resourceId => async (dispatch, getState) => {
  const state = getState();

  const currentState = ResourcesSelectors.isResourceOpenedSelector(resourceId)(state);

  const isOpening = !currentState;

  if (isOpening) {
    dispatch({ type: AT.RESOURCE_FETCH, payload: { id: resourceId } });

    dispatch({
      type: AT.CHANGE_RESOURCE_COLLAPSED_STATE,
      payload: { id: resourceId, state: !currentState },
    });

    const resources = await db.resources.where({ parentResourceId: resourceId }).toArray();

    dispatch({ type: AT.RESOURCE_FETCH_SUCCESS, payload: { id: resourceId, resources } });
  } else {
    // closing
    dispatch({
      type: AT.CHANGE_RESOURCE_COLLAPSED_STATE,
      payload: { id: resourceId, state: !currentState },
    });
  }

  const presentedResourcesIds = Object.keys(ResourcesSelectors.objectsSelector(getState()));
  if (yandexDiskPuller) yandexDiskPuller.subscribeTo(presentedResourcesIds);
};
