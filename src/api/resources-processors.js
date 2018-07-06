/* eslint-disable import/prefer-default-export */
import Promise from 'bluebird';

export const setChildResourcesIds = (ctx = {}) => async (resources) => {
  await Promise.each(resources, async (resource) => {
    const { parentResourceId } = resource;
    const parentResource = await ctx.db.resources.get(parentResourceId);
    if (!parentResource) {
      throw new Error(`Can't find parent resource with id ${parentResourceId}`);
    }
    const newChildResourcesIds = [...(parentResource.childResourcesIds || []), resource.id];
    await ctx.db.resources.update(parentResourceId, { childResourcesIds: newChildResourcesIds });
  });
  return resources;
};
