export default null;

export const isDev = () =>
  global.__DEV__ ||
  process.env.NODE_ENV === 'dev' ||
  process.env.NODE_ENV === 'development';
