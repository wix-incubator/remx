declare module 'remx' {
  import * as React from 'react';

  interface HOC<TInner, TOuter> {
    <P extends TInner>(
      component: React.ComponentType<P>
    ): React.ComponentType<Omit<P, keyof TInner> & TOuter>;
  }

  export function connect<TInner, TOuter>(createProps: (a: TOuter) => TInner): HOC<TInner, TOuter>;

  export function connect<T>(component: React.ComponentType<T>): React.ComponentType<T>;

  export function getters<T extends {}>(g: T): T;

  export function state<T extends {}>(s: T): T;

  export function setters<T extends {}>(s: T): T;

  export function useConnect<T extends {}>(mapStateToProps: () => T, dependencies?: any[]);

  type Getter<T, A extends any[]> = (...args: A) => T

  export function useRemxValue<T, A>(getter: Getter<T, A>, ...dependencies: A): T;
}
