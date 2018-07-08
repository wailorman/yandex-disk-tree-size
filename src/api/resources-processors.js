import Promise from 'bluebird';
import uniq from 'lodash/uniq';
import Dexie from 'dexie';

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

export const setSizes = ctx => async (resourcePayload = {}) => {
  const { resources = [], parentResourceId } = resourcePayload;

  if (!parentResourceId) return resourcePayload;

  const totalSize = resources.reduce((prev, cur) => {
    const curSize = +((cur && cur.size) || 0);
    return prev + curSize;
  }, 0);

  // Sorry for this code, it's Dexie transactions...
  ctx.db.transaction('rw', ctx.db.resources, () => {
    ctx.db.resources.get(parentResourceId).then((parentResource) => {
      const greatParentsIds = parentResource.allParentResourcesIds || [];
      return Dexie.Promise.all(
        greatParentsIds.map(gParentId => ctx.db.resources.get(gParentId)),
      ).then(greatParents =>
        Dexie.Promise.all(
          [parentResource, ...greatParents].map(async (resource) => {
            await ctx.db.resources.update(resource.id, {
              size: (resource.size || 0) + totalSize,
            });
          }),
        ));
    });
  });

  return resourcePayload;
};
