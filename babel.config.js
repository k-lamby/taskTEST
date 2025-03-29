// ================== babel.config.js =========================== //
// handles passing of the environment variables
// =================================================================
module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        [
          "module:react-native-dotenv",
          {
            moduleName: "@env",
            path: ".env",
            blacklist: null,
            whitelist: null,
            safe: false,
            allowUndefined: true,
          },
        ],
      ],
    };
  };