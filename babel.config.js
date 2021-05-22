module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
      ["babel-plugin-module-resolver", {
        alias: {
          context: './context',
          hooks: './hooks',
          theme: './theme',
          screens: './screens',
          lib: './lib',
          components: './components',
          shared: '../shared',
          services: './services',
          assets: './assets',
          navigation: './navigation',
        },
      }]
    ],
  };
};
