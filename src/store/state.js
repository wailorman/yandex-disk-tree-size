module.exports = {
  resources: {
    objects: {
      root: {
        id: 'Яндекс.Диск',
        name: 'root',
        path: '/',
        type: 'dir',
        parentResourceId: null,
      },
      disk: {
        id: 'disk',
        name: 'Диск',
        path: 'disk:/',
        type: 'dir',
        parentResourceId: 'root',
      },
      trash: {
        id: 'trash',
        name: 'Корзина',
        path: 'trash:/',
        type: 'dir',
        parentResourceId: 'root',
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
