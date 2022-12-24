const ADD_TODO = 'ADD_TODO';
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


// action creators

function addTodo(text) {
  return { type: ADD_TODO, text }
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
};
