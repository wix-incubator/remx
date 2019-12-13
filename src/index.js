if (global.Proxy) {
  module.exports = {
    ...require('./es6Remx'),
    __versionType: 'es6'
  };
} else {
  module.exports = {
    ...require('./legacyRemx'),
    __versionType: 'legacy'
  };
}
