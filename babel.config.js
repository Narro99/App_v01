module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['expo-router/babel'], // 👈 necesario para que funcione expo-router
  };
};
