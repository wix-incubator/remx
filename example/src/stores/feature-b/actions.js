const store = require('./store');

async function doSomethingElse() {
  const result = await fetch('http://www.example.com');
  const theName = result.name;
  store.setters.setName(theName);
}

module.exports = { doSomethingElse };
