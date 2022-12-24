export var ActionTypes = {
  INIT: '@@redux/INIT'  // an action dispatched when reducer is initialised
};

export default function creatStore(reducer, initialState) {

	let currentReducer = reducer;
	let currentState = initialState;
	let listeners = {};

	function getState() {
		return currentState;
	}

	function getReducer() {
		return currentReducer;
	}

	function replaceReducer(newReducer) {
		currentReducer = newReducer;
		dispatch({ type: ActionTypes.INIT });
	}

	function subscribe(listener) {
		listeners.push(listener);
		return function unsubscribe() {
			const index = listeners.indexOf(listener);
			listeners.splice(index, 1);
		};
	}

	function dispatch(action) {
		try {
		currentState = currentReducer(currentState, action);
		} finally {
			// error handling
		}

		// take slice (clone), so no callbacks can manipulate the listener
		// list inbetween the interations
		listeners.slice().forEach(listeners => listeners());
		return action;
	}

	// all members are init, dispatch default init action
	dispatch({ type: ActionTypes.INIT });

	return {
		dispatch,
		subscribe,
		getState,
		getReducer,
		replaceReducer,
	};
}
