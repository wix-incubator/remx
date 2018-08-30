module.exports = {
  ...require('./remx'),
  connect: require('./connect').connect,
  action: require('mobx').action,
  runInAction: require('mobx').runInAction,
  inject: require('mobx-react/custom').inject,
  Provider: require('mobx-react/custom').Provider
};
