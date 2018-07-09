export const migrateDb = (db) => {
  db.version(1).stores({
    resources: ['id', 'name', 'type', 'parentResourceId'].join(','),
  });
};

export default migrateDb;
