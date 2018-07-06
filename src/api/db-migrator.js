export const migrateDb = (db) => {
  db.version(1).stores({
    resources:
      'id,'
      + 'name,'
      + 'type,'
      + 'path,'
      + 'size,'
      + 'totalChildResources,'
      + 'loadedChildResources,'
      + 'parentResourceId,'
      + 'childResourcesIds,'
      + 'allParentResourcesIds,'
      + 'allChildResourcesIds',
  });
}

export default migrateDb;
