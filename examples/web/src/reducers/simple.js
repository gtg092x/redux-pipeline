import reduxPipeline from '../../../../src/pipeline';

function randomize(state = {}, action, end) {
  switch (action.type) {
    case 'RANDOMIZE':
      return {...state, data: Math.floor(Math.random() * 1000)};
    case 'STOP':
      return end(state);
    default:
      return state;
  }
}

function clean(state = {}, action) {
  switch (action.type) {
    case 'FILTER_ODDS':
      return {...state, data: state.data % 2 === 1 ? 0 : state.data};
    case 'STOP':
      throw 'You should not get here';
    default:
      return state;
  }
}

function add(state = {}, action) {
  switch (action.type) {
    case 'ADD':
      return {...state, data: (state.data === undefined ? 0 : state.data) + (action.data === undefined ? 1 : action.data)};
    default:
      return state;
  }
}

export default reduxPipeline(
  randomize,
  clean,
  add
);
