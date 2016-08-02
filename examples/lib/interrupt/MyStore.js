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

function subtractReducer(state = 0, action, end) {
  switch(action.type) {
    case 'SUBTRACT':
      return end(state - action.data);
    default:
      return state;
  }
}

function interruptedReducer(state = 0, action) {
  switch(action.type) {
    case 'SUBTRACT':
      console.log('Should not reach this point');
      return end(state - action.data);
    default:
      return state;
  }
}

export default createStore(
  pipeline(addReducer, subtractReducer, interruptedReducer)
);
