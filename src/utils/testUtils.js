export default null;

export const grabConsole = (fn, methods = ['log', 'warn', 'error', 'trace']) => {
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

export const grabConsoleErrors = (fn) => grabConsole(fn, ['error']).map((args) => args.slice(1));
// export const grabConsoleWarns = (fn) => grabConsole(fn, ['warn']).map((args) => args.slice(1));
