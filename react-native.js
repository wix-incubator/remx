console.warn(`Deprecated warning. Please replace this with "require('remx').connect()" or "import {connect} from 'remx'"`);

module.exports = {
  connect: require('./dist/index').connect
};
