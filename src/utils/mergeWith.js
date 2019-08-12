export default function mergeWith(object, ...sources) {
  const mergeCustomizer = sources.pop();
  sources.forEach((source) => {
    if (!source || typeof source !== 'object') {
      return;
    }
    // eslint-disable-next-line guard-for-in
    for (const key in source) {
      const objValue = object[key];
      const srcValue = source[key];
      const value = mergeCustomizer(objValue, srcValue, key, object, source);
      if (value !== undefined) {
        object[key] = value;
      } else if (objValue && typeof objValue === 'object' && srcValue && typeof srcValue === 'object') {
        object[key] = mergeWith(objValue, srcValue, mergeCustomizer);
      } else {
        object[key] = srcValue;
      }
    }
  });
  return object;
}
