module.exports = {
  resources: {
    objects: {
      root: {
        id: 'root',
        name: 'Яндекс.Диск',
        path: '/',
        type: 'dir',
        size: 0,
        parentResourceId: null,
      },
      disk: {
        id: 'disk',
        name: 'Диск',
        path: 'disk:/',
        type: 'dir',
        size: 0,
        parentResourceId: 'root',
      },
      trash: {
        id: 'trash',
        name: 'Корзина',
        path: 'trash:/',
        type: 'dir',
        size: 0,
        parentResourceId: 'root',
      },
    },
  },
  user: {},
};
