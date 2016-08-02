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
const SKIP = Symbol('SKIP');
const NEXT = Symbol('NEXT');

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
      let nextAction = action;
      let skipCount = 1;


      const pipe = {
        end(result) {
          nextState = result;
          return EARLY;
        },
        skip(result, toSkip = 1) {
          nextState = result;
          skipCount = toSkip;
          return SKIP;
        },
        mutateAction(mutation, ...args) {
          nextAction = _.isFunction(mutation) ? mutation(nextAction) : {...nextAction, ...mutation};
          if (args.length > 0) {
            nextState = args[0];
            return NEXT;
          }
          return pipe;
        }
      };

      // Reducify does most of the work for us
      for (let i = 0; i < reducers.length; i ++) {
        const result = reducers[i].call(context, nextState, nextAction, pipe, ...restArgs);
        if (result === EARLY) {
          break;
        }
        if (result === NEXT) {
          continue;
        }
        if (result === SKIP) {
          i += skipCount;
          continue;
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
