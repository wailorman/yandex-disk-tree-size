import Dexie from 'dexie';
import { migrateDb } from './db-migrator';

export const db = new Dexie('resources');
migrateDb(db);
db.open()
  // eslint-disable-next-line no-console
  .then(() => console.log('Connected to IndexedDB'))
  // eslint-disable-next-line no-console
  .catch(err => console.error('IndexedDB connection error:', err));

export default db;
