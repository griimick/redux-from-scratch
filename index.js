const ActionTypes = {

  INIT: '@@redux/INIT'  // an action dispatched when reducer is initialised
};

function createStore(reducer, initialState) {
	if (typeof reducer !== 'function') {
		throw new Error('Expected the reducer to be a function.');
	}

	let currentReducer = reducer;
	let currentState = initialState;
	let listeners = [];

	function getState() {
		return currentState;
	}

	function replaceReducer(newReducer) {
		currentReducer = newReducer;
		dispatch({ type: ActionTypes.INIT });
	}

	function subscribe(listener) {
		listeners.push(listener);
		let isSubscribed = true;

		return function unsubscribe() {
			if (!isSubscribed) {
				return;
			}
			const index = listeners.indexOf(listener);
			isSubscribed = false;
			listeners.splice(index, 1);
		};
	}

	function dispatch(action) {
		if (!isPlainObject(action)) {
			throw new Error(
				'Actions must be plain objects.'
			);
		}

		if (typeof action.type === 'undefined') {
			throw new Error(
				'Actions may not have an undefined "type" property. '
			);
		}

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
		replaceReducer,
	};
}

function isPlainObject(obj) {
	if (typeof obj !== 'object' || obj === null) return false;

	let proto = obj;

	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto);
	}

	return Object.getPrototypeOf(obj) === proto;
}

module.exports = {
	ActionTypes,
	createStore,
};

