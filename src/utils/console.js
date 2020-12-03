const warningsByCode = {};

export default null;

export const warnOnceWithCode = (code, warning) => {
  if (!warningsByCode[code]) {
    warningsByCode[code] = true;
    console.warn(warning);
  }
};
