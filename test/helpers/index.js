export const ADD_TODO = 'ADD_TODO';

function id(state = []) {
  return state.reduce((result, item) => (
    item.id > result ? item.id : result
  ), 0) + 1;
}

export function todosReducer(state = [], action) {
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

export function todosReverseReducer(state = [], action) {
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
export function addTodoActionCreator(text) {
  return { type: ADD_TODO, text };
}
