const store = require('./store');

async function doSomething() {
  const result = await fetch('http://www.example.com');
  const theName = result.name;
  store.setters.setName(theName);
}

module.exports = { doSomething };
