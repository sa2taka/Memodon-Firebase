const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  transpileDependencies: ['vuetify'],

  devServer: {
    disableHostCheck: true,
    watchOptions: {
      poll: true,
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'jp',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
  configureWebpack: {
    plugins: [new HardSourceWebpackPlugin()],
  },
};
