const mobxReact = require('mobx-react');
const innerConnect = require('./dist/connect');
module.exports = {
  connect: innerConnect.connect(mobxReact.observer)
};
