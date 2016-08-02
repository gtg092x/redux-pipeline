import store from './MyStore'

const {dispatch, subscribe, getState} = store;

subscribe(val => console.log('State is:', getState()));

dispatch({
  type: 'ADD',
  data: 2
});
// State is: 2

dispatch({
  type: 'SUBTRACT',
  data: 10
});
// State is: -8
