import React from 'react';

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
export const grabConsoleWarns = (fn) => grabConsole(fn, ['warn']).map((args) => args.slice(1));

export class Text extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export class FlatList extends React.PureComponent {
  render() {
    return this.props.data.map((item, i) => {
      const Renderer = this.props.renderItem;
      return <Renderer item={item} key={this.props.keyExtractor(item, i)} />;
    });
  }
}
