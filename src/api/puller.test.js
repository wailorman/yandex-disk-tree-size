import Dexie from 'dexie';
import setGlobalVars from 'indexeddbshim';
import { setChildResourcesIds } from './resources-processors';

describe('Storage / Resource processors', () => {
  let db;

  beforeAll(() => {
    const shim = {};
    setGlobalVars(shim, {
      checkOrigin: false,
    });
    const { indexedDB, IDBKeyRange } = shim;
    Dexie.dependencies.indexedDB = indexedDB;
    Dexie.dependencies.IDBKeyRange = IDBKeyRange;

    db = new Dexie('resources');
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

    db.open();
  });

  beforeEach(async () => {
    const fixtures = [
      {
        id: 'root',
        name: 'YandexDisk',
        childResourcesIds: ['disk'],
        path: '/',
      },
      {
        id: 'disk',
        name: 'Disk',
        parentResourceId: 'root',
        path: 'disk:/',
      },
    ];

    await db.resources.clear();
    await db.resources.bulkPut(fixtures);
  });

  describe('#setChildResourcesIds', () => {
    it('should return the same resources array', async () => {
      const resources = [
        {
          id: 'screenshots01',
          name: 'Screenshots',
          parentResourceId: 'disk',
        },
        {
          id: 'screenshots02',
          name: 'Screenshots2',
          parentResourceId: 'disk',
        },
      ];

      const res = await setChildResourcesIds(db)(resources);
      expect(res).toEqual(resources);
    });

    it('should set childResourcesIds for parent resource', async () => {
      const resources = [
        {
          id: 'screenshots01',
          name: 'Screenshots',
          parentResourceId: 'disk',
        },
        {
          id: 'screenshots02',
          name: 'Screenshots2',
          parentResourceId: 'disk',
        },
      ];

      await setChildResourcesIds(db)(resources);
      const parentResource = await db.resources.get('disk');
      expect(parentResource.childResourcesIds).toEqual(['screenshots01', 'screenshots02']);
    });

    it('should throw error if no such parentResourceId', async () => {
      const resources = [
        {
          id: 'screenshots01',
          name: 'Screenshots',
          parentResourceId: 'disk000',
        },
      ];

      const spy = jasmine.createSpy('catch');
      await setChildResourcesIds(db)(resources).catch(spy);

      expect(spy.calls.count()).toEqual(1);
      expect(spy.calls.argsFor(0).toString()).toMatch(/can't find/i);
    });
  });
});
