const ADD_TODO = 'ADD_TODO'
const DISPATCH_IN_MIDDLE = 'DISPATCH_IN_MIDDLE'
const GET_STATE_IN_MIDDLE = 'GET_STATE_IN_MIDDLE'
const SUBSCRIBE_IN_MIDDLE = 'SUBSCRIBE_IN_MIDDLE'
const UNSUBSCRIBE_IN_MIDDLE = 'UNSUBSCRIBE_IN_MIDDLE'
const THROW_ERROR = 'THROW_ERROR'
const UNKNOWN_ACTION = 'UNKNOWN_ACTION'

function id(state = []) {
  return state.reduce((result, item) => (
    item.id > result ? item.id : result
  ), 0) + 1;
}

function todosReducer(state = [], action) {
  switch (action.type) {
  case ADD_TODO:
    return [...state, {
      id: id(state),
      text: action.text
    }];
  default:
    return state;
  }
}

function todosReverseReducer(state = [], action) {
  switch (action.type) {
  case ADD_TODO:
    return [{
      id: id(state),
      text: action.text
    }, ...state];
  default:
    return state;
  }
}

function dispatchInTheMiddleOfReducer(state = [], action) {
  switch (action.type) {
    case DISPATCH_IN_MIDDLE:
      action.boundDispatchFn()
      return state
    default:
      return state
  }
}

function getStateInTheMiddleOfReducer(state = [], action) {
  switch (action.type) {
    case GET_STATE_IN_MIDDLE:
      action.boundGetStateFn()
      return state
    default:
      return state
  }
}

function subscribeInTheMiddleOfReducer(state = [], action) {
  switch (action.type) {
    case SUBSCRIBE_IN_MIDDLE:
      action.boundSubscribeFn()
      return state
    default:
      return state
  }
}

function unsubscribeInTheMiddleOfReducer(state = [], action) {
  switch (action.type) {
    case UNSUBSCRIBE_IN_MIDDLE:
      action.boundUnsubscribeFn()
      return state
    default:
      return state
  }
}

function errorThrowingReducer(state = [], action) {
  switch (action.type) {
    case THROW_ERROR:
      throw new Error()
    default:
      return state
  }
}

const reducers = {
	todosReducer,
	todosReverseReducer,
	errorThrowingReducer,
	dispatchInTheMiddleOfReducer,
	subscribeInTheMiddleOfReducer,
	unsubscribeInTheMiddleOfReducer,
	getStateInTheMiddleOfReducer,

};


// action creators

function addTodo(text) {
  return { type: ADD_TODO, text }
}

function dispatchInMiddle(boundDispatchFn) {
  return {
    type: DISPATCH_IN_MIDDLE,
    boundDispatchFn
  }
}

function getStateInMiddle(boundGetStateFn) {
  return {
    type: GET_STATE_IN_MIDDLE,
    boundGetStateFn
  }
}

function subscribeInMiddle(boundSubscribeFn) {
  return {
    type: SUBSCRIBE_IN_MIDDLE,
    boundSubscribeFn
  }
}

function unsubscribeInMiddle(boundUnsubscribeFn) {
  return {
    type: UNSUBSCRIBE_IN_MIDDLE,
    boundUnsubscribeFn
  }
}

function throwError() {
  return {
    type: THROW_ERROR
  }
}

function unknownAction() {
  return {
    type: UNKNOWN_ACTION
  }
}

module.exports = {
	ADD_TODO,
	UNKNOWN_ACTION,
	id,
	todosReducer,
	todosReverseReducer,
	addTodo,
	unknownAction,
	reducers,
	dispatchInMiddle,
	getStateInMiddle,
	subscribeInMiddle,
	unsubscribeInMiddle,
	throwError,
	unknownAction,
};
