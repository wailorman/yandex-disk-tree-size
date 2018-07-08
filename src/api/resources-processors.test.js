import Dexie from 'dexie';
import setGlobalVars from 'indexeddbshim';
import {
  setChildResourcesIds,
  setAllParentResourcesIds,
  _splitToRelationsSteps,
} from './resources-processors';

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

  describe(`#setChildResourcesIds`, () => {
    it(`should return the same resources array`, async () => {
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

      const ctx = { db };
      const res = await setChildResourcesIds(ctx)({ resources });
      expect(res.resources).toEqual(resources);
    });

    it(`should set childResourcesIds for parent resource`, async () => {
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

      const ctx = { db };
      await setChildResourcesIds(ctx)({ resources });
      const parentResource = await db.resources.get('disk');
      expect(parentResource.childResourcesIds).toEqual(['screenshots01', 'screenshots02']);
    });

    it(`should throw error if no such parentResourceId`, async () => {
      const resources = [
        {
          id: 'screenshots01',
          name: 'Screenshots',
          parentResourceId: 'disk000',
        },
      ];

      const spy = jasmine.createSpy('catch');
      const ctx = { db };
      await setChildResourcesIds(ctx)({ resources }).catch(spy);

      expect(spy.calls.count()).toEqual(1);
      expect(spy.calls.argsFor(0).toString()).toMatch(/can't find/i);
    });

    it(`should works if resource is orphan`, async () => {
      const resources = [
        {
          id: 'screenshots01',
          name: 'Screenshots',
        },
      ];
      const ctx = { db };
      await setChildResourcesIds(ctx)({ resources });
    });
  });

  describe(`#setAllParentResourcesIds`, () => {
    it(`should set all parents' resource ids`, async () => {
      const resources = [
        {
          id: 'disk',
        },
        {
          id: 'folder1',
          parentResourceId: 'disk',
        },
        {
          id: 'folder2',
          parentResourceId: 'folder1',
        },
        {
          id: 'folder3',
          parentResourceId: 'folder2',
        },
      ];

      await db.resources.clear();
      await db.resources.bulkPut(resources);
      const ctx = { db };
      await setAllParentResourcesIds(ctx)({ resources });

      const [disk___, folder1, folder2, folder3] = await Promise.all([
        db.resources.get('disk'),
        db.resources.get('folder1'),
        db.resources.get('folder2'),
        db.resources.get('folder3'),
      ]);

      const sort = (arr = []) => arr.slice().sort();

      expect(sort(disk___.allParentResourcesIds)).toEqual(sort([]));
      expect(sort(folder1.allParentResourcesIds)).toEqual(sort(['disk']));
      expect(sort(folder2.allParentResourcesIds)).toEqual(sort(['disk', 'folder1']));
      expect(sort(folder3.allParentResourcesIds)).toEqual(sort(['disk', 'folder1', 'folder2']));
    });

    it(`should use existing allParentResourcesIds`, async () => {
      const fixtures = [
        {
          id: 'folder1',
          parentResourceId: 'disk',
          allParentResourcesIds: ['disk', '001'],
        },
        {
          id: 'folder2',
          parentResourceId: 'folder1',
          allParentResourcesIds: ['disk', '001', 'folder1'],
        },
        {
          id: 'folder3',
          parentResourceId: 'folder2',
        },
      ];

      const resources = [
        {
          id: 'folder3',
          parentResourceId: 'folder2',
        },
      ];

      await db.resources.clear();
      await db.resources.bulkPut(fixtures);
      const ctx = { db };
      await setAllParentResourcesIds(ctx)({ resources });

      const folder3 = await db.resources.get('folder3');

      const sort = (arr = []) => arr.slice().sort();

      expect(sort(folder3.allParentResourcesIds)).toEqual(
        sort(['disk', '001', 'folder1', 'folder2']),
      );
    });

    it(`should return resources`, async () => {
      const resources = [
        {
          id: 'folder3',
        },
      ];

      const ctx = { db };
      const res = await setAllParentResourcesIds(ctx)({ resources });

      expect(res.resources).toEqual(resources);
    });
  });

  describe(`#_splitToRelationsSteps`, () => {
    it(`should split to relations steps`, async () => {
      const resources = [
        {
          id: 'disk',
        },
        {
          id: 'folder1',
          parentResourceId: 'disk',
        },
        {
          id: 'folder2',
          parentResourceId: 'folder1',
        },
        {
          id: 'folder3.1',
          parentResourceId: 'folder2',
        },
        {
          id: 'folder3.2',
          parentResourceId: 'folder2',
        },
      ];

      const res = _splitToRelationsSteps(resources);

      expect(res.length).toEqual(4);

      expect(res[0].slice().sort()).toEqual(['disk'].sort());
      expect(res[1].slice().sort()).toEqual(['folder1'].sort());
      expect(res[2].slice().sort()).toEqual(['folder2'].sort());
      expect(res[3].slice().sort()).toEqual(['folder3.1', 'folder3.2'].sort());
    });
  });
});
