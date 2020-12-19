import * as mobx from 'mobx';

export default null;
export function parsistState(params) {
  const value = global.localStorage.getItem('123');
  params.rehydrate(value);
  mobx.reaction(params.dehydrate, (value) => {
    global.localStorage.setItem('123', JSON.stringify(value));
  });
}
