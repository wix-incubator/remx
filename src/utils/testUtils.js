export default null;

export const grabConsole = (fn) => {
  const methods = ['log', 'warn', 'error', 'trace'];
  const originals = {};
  const calls = [];
  methods.forEach((method) => {
    originals[method] = console[method];
    console[method] = (...args) => {
      calls.push([method, ...args]);
    };
  });

  fn();

  methods.forEach((method) => {
    console[method] = originals[method];
  });

  return calls;
};
