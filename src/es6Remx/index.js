module.exports = {
  ...require('./remx'),
  connect: require('./connect').connect,
  observer: require('./observer').observer,
  useConnect: require('./useConnect').useConnect,
  setAccessStateStrictMode: require('./globalState').setAccessStateStrictMode,
};
