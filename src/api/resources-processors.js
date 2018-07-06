/* eslint-disable import/prefer-default-export */
import Promise from 'bluebird';

export const setChildResourcesIds = db => async (resources) => {
  await Promise.each(resources, async (resource) => {
    const { parentResourceId } = resource;
    const parentResource = await db.resources.get(parentResourceId);
    if (!parentResource) {
      throw new Error(`Can't find parent resource with id ${parentResourceId}`);
    }
    const newChildResourcesIds = []
      .concat(parentResource.childResourcesIds || [])
      .concat(resource.id);
    await db.resources.update(parentResourceId, { childResourcesIds: newChildResourcesIds });
  });
  return resources;
};
