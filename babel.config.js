module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      helpers: true,
      regenerator: true,
      corejs: false,
      absoluteRuntime: false,
      version: '^7.23.0',
    }],
  ],
};
