const ActionTypes = {

  INIT: '@@redux/INIT'  // an action dispatched when reducer is initialised
};

function createStore(reducer, initialState) {
	if (typeof reducer !== 'function') {
		throw new Error(
			'Expected the reducer to be a function.'
		);
	}

	let currentReducer = reducer;
	let currentState = initialState;
	let isDispatching = false;
	let listeners = [];

	function getState() {
		if (isDispatching) {
			throw new Error(
				'Cannot call getState while the reducer is dispatching.'
			);
		}
		return currentState;
	}

	function replaceReducer(newReducer) {
		if (typeof newReducer !== 'function') {
			throw new Error(
				'Expected the newReducer to be a function.'
			);
		}

		if (isDispatching) {
			throw new Error(
				'Cannot replaceReducer while the reducer is executing.'
			);
		}
		currentReducer = newReducer;
		dispatch({ type: ActionTypes.INIT });
	}

	function subscribe(listener) {
		listeners.push(listener);
		let isSubscribed = true;

		if (isDispatching) {
			throw new Error(
				'Cannot subscribe while the reducer is executing.'
			);
		}

		return function unsubscribe() {
			if (!isSubscribed) {
				return;
			}

			if (isDispatching) {
				throw new Error(
					'Cannot unsubscribe while the reducer is executing.'
				);
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

		if (isDispatching) {
			throw new Error(
				'Reducers may not dispatch actions.'
			);
		}


		try {
			isDispatching = true;
			currentState = currentReducer(currentState, action);
		} finally {
			isDispatching = false;
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

/* Lodash version here: https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L12036 */
function isPlainObject(obj) {
	if (typeof obj !== 'object' || obj === null) return false;

	let proto = obj;

	// Plain object has root Object proto (no other derivative)
	// null -> Object -> PainObject (Derivatives)
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto);
	}

	return Object.getPrototypeOf(obj) === proto;
}

module.exports = {
	ActionTypes,
	createStore,
};

