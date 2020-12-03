# 4.0.0 (RC)

* Remove legacyRemx, Update to mobx@6
* Add error on accessing state in render w/o observer (#66)
* Introduce observer, deprecate connect

# 3.0.0

* Upgraded to `mobx@4` and `mobx-react@5`.


# 2.0.0
### Complete support for es6 Proxies
* cleaner api, original objects (without all those ObservableArray wrappers), more performant.

* No need for `toJS`: from now on `remx.state(initialState)` will return a plain object.

* `import { connect } from remx/react-native;` is now changed to: `import { connect } from remx`. Agnostic to environment.

* There is no more `merge` function on the state object. remx.state is now a plain object so you can use any merge function you want, or you can just mutate the state. (You can still import the merge function from remx: `import { merge } from remx` for easier merging)

* Added `registerLoggerForDebug`
