const path = require("path");

module.exports = {
  plugins: [
    {
      plugin: {
        overrideCracoConfig: ({ cracoConfig }) => {
          if (typeof cracoConfig.eslint.enable !== "undefined") {
            cracoConfig.disableEslint = !cracoConfig.eslint.enable;
          }
          delete cracoConfig.eslint;
          return cracoConfig;
        },
        overrideWebpackConfig: ({ webpackConfig, cracoConfig }) => {
          if (
            typeof cracoConfig.disableEslint !== "undefined" &&
            cracoConfig.disableEslint === true
          ) {
            webpackConfig.plugins = webpackConfig.plugins.filter(
              (instance) => instance.constructor.name !== "ESLintWebpackPlugin"
            );
          }
          return webpackConfig;
        },
      },
    },
  ],
  webpack: {
    alias: {
      "~components": path.resolve(__dirname, "src/components"),
      "~config": path.resolve(__dirname, "src/config"),
      "~core": path.resolve(__dirname, "src/core"),
      "~utils": path.resolve(__dirname, "src/utils"),
    },
  },
};
