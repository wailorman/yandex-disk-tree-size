/* eslint-disable import/prefer-default-export */
// import { pullResourceInfo } from '../api/methods';
import * as AT from '../constants/action-types';
import * as ResourcesSelectors from '../selectors/resources-selectors';
import * as ResourcesPuller from '../api/puller';
import { db } from '../api/db';

const yandexDiskPuller = ResourcesPuller.configure({
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
    {
      id: 'trash',
      path: 'trash:/',
    },
  ],
});

export const startFetchingResources = () => async (dispatch) => {
  dispatch({ type: AT.START_FETCHING_RESOURCES });

  yandexDiskPuller.start();
};

export const fetchResource = resourceId => async (dispatch) => {
  dispatch({ type: AT.RESOURCE_FETCH, payload: { id: resourceId } });

  const resource = await db.resources.get(resourceId);

  dispatch({ type: AT.RESOURCE_FETCH_SUCCESS, payload: { id: resourceId, resource } });
};

export const fetchResourceChilds = resourceId => async (dispatch) => {
  dispatch({ type: AT.RESOURCE_CHILDS_FETCH, payload: { id: resourceId } });

  const resources = await db.resources.where({ parentResourceId: resourceId }).toArray();

  dispatch({ type: AT.RESOURCE_CHILDS_FETCH_SUCCESS, payload: { id: resourceId, resources } });
};

export const changeCollapsedState = resourceId => (dispatch, getState) => {
  const state = getState();

  const currentState = ResourcesSelectors.isResourceOpenedSelector(resourceId)(state);
  dispatch({
    type: AT.CHANGE_RESOURCE_COLLAPSED_STATE,
    payload: { id: resourceId, state: !currentState },
  });
};
