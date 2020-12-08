const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "~components": path.resolve(__dirname, "src/components"),
      "~config": path.resolve(__dirname, "src/config"),
      "~core": path.resolve(__dirname, "src/core"),
      "~utils": path.resolve(__dirname, "src/utils"),
    },
  },
};
