import pipe from '../../../../src/pipeline';

function randomize(state = 0, action) {
  switch (action.type) {
    case 'RANDOMIZE':
      return Math.floor(Math.random() * 1000);
    default:
      return state;
  }
}

function add(state = 0, action) {
  switch (action.type) {
    case 'ADD':
      return state + (action.data === undefined ? 1 : action.data);
    default:
      return state;
  }
}

function filter(state = 0, action) {
  switch (action.type) {
    case 'FILTER_ODDS':
      return state % 2 === 1 ? 0 : state;
    default:
      return state;
  }
}

export default pipe(
  {},
  {select: state => state.random, merge: (result, state) => ({...state, random: result}), reducer: randomize},
  {select: 'add', reducer: add},
  {select: 'add', reducer: filter},
  {select: 'random', reducer: filter}
);
