module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "@babel/preset-typescript"],
    plugins: [
      // other plugins if you have any
      "react-native-reanimated/plugin" // always ensure this is the last plugin
    ]
  };
};
