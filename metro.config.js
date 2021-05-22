const path = require('path');

const extraNodeModules = {
  'shared': path.resolve(__dirname + '/../shared'),
};

const watchFolders = [
  path.resolve(__dirname + '/../shared')
];

module.exports = {
  resolver: {
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) =>
        //redirects dependencies referenced from common/ to local node_modules
        name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`),
    }),
  },
  resetCache: true,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders
};
