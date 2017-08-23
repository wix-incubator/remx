const mobxReact = require('mobx-react');
const connect = require('./dist').connect;
module.exports = {
  connect
};
console.warn(`Deprecated warning: do not use connect/react-native. use "import {connect} from 'remx'"`);
