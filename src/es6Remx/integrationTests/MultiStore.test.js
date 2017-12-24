const mobx = require('mobx');

const remx = require('../remx');

describe(`MultiStore`, () => {
  let state, setters, getters, anotherState;

  beforeEach(() => {
    mobx.useStrict(true);

    anotherState = remx.state({
      count: 0
    });

    state = remx.state({
      obj: {
        foo: 'bar'
      }
    });
    setters = remx.setters({
      modify() {
        state.anotherState = anotherState;
        anotherState.count++;
      }
    });
    getters = remx.getters({
      getCount() {
        return state.anotherState ? state.anotherState.count : -1;
      }
    });
  });

  it('support observing on observable objects (remx state inside remx state)', () => {
    const stop = mobx.autorun(() => {
      console.log(getters.getCount());
    });

    expect(getters.getCount()).toEqual(-1);

    setters.modify();

    expect(getters.getCount()).toEqual(1);

    setters.modify();
    expect(anotherState.count).toEqual(2);

    stop();
  });
});
