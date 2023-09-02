module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "@babel/preset-react"],
  };
};

module.exports = {
  plugins: [
    ["nativewind/babel"],
    ["module:react-native-dotenv", {
      "envName": "APP_ENV",
      "moduleName": "@env",
      "path": ".env",
      "safe": false,
      "allowUndefined": true,
      "verbose": false
    }]
  ],
};