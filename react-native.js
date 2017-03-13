const mobxReact = require('mobx-react/native');
const innerConnect = require('./dist/connect');
module.exports = {
  connect: innerConnect.connect(mobxReact.observer)
};
