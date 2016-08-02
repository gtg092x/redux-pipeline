import { createStore } from 'redux';
import pipeline from 'redux-pipeline';

function addReducer(state = 0, action) {
  switch(action.type) {
    case 'ADD':
      return state + action.data;
    default:
      return state;
  }
}

function subtractReducer(state = 0, action) {
  switch(action.type) {
    case 'SUBTRACT':
      return state - action.data;
    default:
      return state;
  }
}

export default createStore(
  pipeline(
    {hello: 'world', data: 100},
    ['data', addReducer],
    ['data', subtractReducer]
  )
);
