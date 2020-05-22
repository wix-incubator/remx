export default function immutableDate(date) {
  date = new Date(date);
  [
    'setDate',
    'setFullYear',
    'setHours',
    'setMilliseconds',
    'setMinutes',
    'setMonth',
    'setSeconds',
    'setTime',
    'setUTCDate',
    'setUTCFullYear',
    'setUTCHours',
    'setUTCMilliseconds',
    'setUTCMinutes',
    'setUTCMonth',
    'setUTCSeconds',
    'setYear'
  ].forEach((key) => {
    date[key] = () => {
      throw new Error(`[remx] attempted to call Date#${key}, modifying dates in store are disallowed, create a new Date instead`);
    };
  });
  return date;
}
