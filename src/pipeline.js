import reducify from 'reducify';
import _ from 'lodash';

function cleanArg(arg) {
  if (!_.isArray(arg)) {
    return arg;
  }
  return [undefined, ...arg];
}

// Signals used for control flow commands
const EARLY = Symbol('EARLY');

function configure({debug = false} = {}) {
  const log = (...args) => debug === true ? console.log(...args) : _.noop;
  /*
   Merge reducers into a single reducer.
   @params [reducerArgs] - arguments that are either functions or configuration objects
   */
  return function pipeline(...reducerArgs) {
    // Normally unused in redux, this is to not hijack any functionality
    const reducers = reducerArgs.map(arg => reducify(cleanArg(arg)));

    // Returning a single reducer
    return function pipelineReducer(state, action, ...restArgs) {
      const context = this;
      let nextState = state;

      const end = (result) => {
        nextState = result;
        return EARLY;
      };

      // Reducify does most of the work for us
      for (let i = 0; i < reducers.length; i ++) {
        const result = reducers[i].call(context, nextState, action, end, ...restArgs);
        if (result === EARLY) {
          break;
        }
        nextState = result;
      }
      return nextState;
    };
  }
}

const pipeline = configure();

export default pipeline;

const debugPipeline = configure({debug: true});
export {
  pipeline,
  debugPipeline,
  configure as configurePipeline,
};
