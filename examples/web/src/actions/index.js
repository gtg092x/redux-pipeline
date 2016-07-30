
function stop(dispatch) {
  return dispatch({
    type: 'STOP'
  });
}

function randomize(dispatch) {
  return dispatch({
    type: 'RANDOMIZE'
  });
}

function filter(dispatch) {
  return dispatch({
    type: 'FILTER_ODDS'
  });
}

function add(dispatch) {
  return dispatch({
    type: 'ADD'
  });
}

export {stop, randomize, filter, add};
