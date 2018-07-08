import Promise from 'bluebird';
import uniq from 'lodash/uniq';

export const setChildResourcesIds = (ctx = {}) => async (resourcePayload = {}) => {
  const { resources = [] } = resourcePayload;
  await Promise.each(resources, async (resource) => {
    const { parentResourceId } = resource;
    if (!parentResourceId) return;
    const parentResource = await ctx.db.resources.get(parentResourceId);
    if (!parentResource) {
      throw new Error(`Can't find parent resource with id ${parentResourceId}`);
    }
    const newChildResourcesIds = uniq([...(parentResource.childResourcesIds || []), resource.id]);
    await ctx.db.resources.update(parentResourceId, { childResourcesIds: newChildResourcesIds });
  });
  return resourcePayload;
};

export const saveResources = ctx => async (resourcePayload = {}) => {
  const { resources = [] } = resourcePayload;
  await ctx.db.resources.bulkPut(resources);
  return resourcePayload;
};

// eslint-disable-next-line no-underscore-dangle
export const _splitToRelationsSteps = (resources) => {
  const getParentResources = (resource) => {
    if (!resource || !resource.parentResourceId) {
      return [];
    }
    return [
      resource.parentResourceId,
      ...getParentResources(resources.find(({ id }) => id === resource.parentResourceId)),
    ];
  };

  return resources.reduce((prev, resource) => {
    const parentResources = getParentResources(resource);
    const newPrev = [...prev];
    newPrev[parentResources.length] = (newPrev[parentResources.length] || []).concat(resource.id);
    return newPrev;
  }, []);
};

export const setAllParentResourcesIds = ctx => async (resourcePayload = {}) => {
  const { resources = [] } = resourcePayload;
  const relationsSteps = _splitToRelationsSteps(resources);

  await Promise.each(relationsSteps, async (resourcesIds = []) => {
    await Promise.map(resourcesIds, async (resourceId) => {
      const resource = resources.find(({ id }) => id === resourceId);
      const { parentResourceId } = resource;
      if (!parentResourceId) return;
      const parentResource = await ctx.db.resources.get(parentResourceId);
      if (!parentResource) {
        throw new Error(`Can't find parent resource with id ${parentResourceId}`);
      }

      const greatParents = parentResource.allParentResourcesIds || [];

      const newAllParentResourcesIds = uniq([...greatParents, resource.parentResourceId]);
      await ctx.db.resources.update(resourceId, {
        allParentResourcesIds: newAllParentResourcesIds,
      });
    });
  });

  return resourcePayload;
};
