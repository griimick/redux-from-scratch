# redux-from-scratch
For educational purpose (uses CommonJS)

```js
// tldr
dispatch(action) {
  state = reducer(state, action);
  subscribers.forEach(s => s());
}
```

[How Redux Toolkit Is Different Than the Redux Core](https://redux.js.org/introduction/why-rtk-is-redux-today#how-redux-toolkit-is-different-than-the-redux-core)

> The first thing to ask is, "what is Redux?"
>
> Redux is really:
>
> A single store containing "global" state
Dispatching plain object actions to the store when something happens in the app
Pure reducer functions looking at those actions and returning immutably updated state
While it's not required, your Redux code also normally includes:
>
> Action creators that generate those action objects
Middleware to enable side effects
Thunk functions that contain sync or async logic with side effects
Normalized state to enable looking up items by ID
Memoized selector functions with the Reselect library for optimizing derived data
The Redux DevTools Extension to view your action history and state changes
TypeScript types for actions, state, and other functions
Additionally, Redux is normally used with the React-Redux library to let your React components talk to a Redux store.

## Changelog
- v1 : pure js implementation of core entities (reducer, store, actions, dispatcher)
