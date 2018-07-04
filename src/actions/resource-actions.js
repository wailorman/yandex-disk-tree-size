/* eslint-disable import/prefer-default-export */
import { pullResourceInfo } from '../api/methods';
import * as AT from '../constants/action-types';
import * as ResourceSelectors from '../selectors/resources-selectors';

export const fetchResources = (args = {}) => async (dispatch, getState) => {
  const { id = 'disk' } = args;
  const state = getState();

  const { path } = ResourceSelectors.resourceSelector(id)(state);

  dispatch({ type: AT.RESOURCE_FETCH, payload: { id } });

  try {
    const res = await pullResourceInfo({ path });

    // eslint-disable-next-line no-underscore-dangle
    const resources = res._embedded.items.map(resource => ({
      id: resource.resource_id,
      name: resource.name,
      type: resource.type,
      path: resource.path,
      size: resource.size || 0,
      parentResourceId: id,
    }));

    dispatch({ type: AT.RESOURCE_FETCH_SUCCESS, payload: { id, resources } });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    dispatch({ type: AT.RESOURCE_FETCH_FAILED, error });
  }
};
