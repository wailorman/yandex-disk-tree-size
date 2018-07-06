module.exports = {
  resources: {
    objects: {
      disk: {
        id: 'disk',
        name: 'Диск',
        path: 'disk:/',
        type: 'dir',
        size: 0,
        parentResourceId: null,
      },
      trash: {
        id: 'trash',
        name: 'Диск',
        path: 'trash:/',
        type: 'dir',
        size: 0,
        parentResourceId: null,
      },
    },
    opened: {},
    belongsToRelations: {
      disk: 'root',
      trash: 'root',
    },
    hasManyRelations: {
      root: {
        disk: true,
        trash: true,
      },
    },
  },
  user: {},
};
