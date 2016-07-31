import async from 'async';
import _ from 'lodash';

// Signals used for control flow commands
const EARLY = Symbol('EARLY');
const EARLY_NULL = Symbol('EARLY_NULL');
const EARLY_UNDEFINED = Symbol('EARLY_UNDEFINED');

const RESULT_NULL = Symbol('RESULT_NULL');
const RESULT_UNDEFINED = Symbol('RESULT_UNDEFINED');

// We'll pass these in if they aren't provided
const mapDefaults = {
  select: _.identity,
  merge: _.identity
};

// From key to map functions
function propMap(key) {
  return {
    select(state) {
      if (!_.isObject(state)) {
        throw {name: 'stateMerge', message: '[Redux Pipeline] Can\'t Namespace when a string or numeric selector when state is not an object. Add a root reducer or default argument'};
      }
      return state[key];
    },
    merge(result, state) {
      return {
        ...state,
        [key]: result
      };
    }
  };
}

function isValidKey(key) {
  return _.isString(key) || _.isNumber(key) || _.isSymbol(key);
}

/*
  @param reducer argument - one of the steps passed to pipeline(...)
  Returns {select<Function>, merge<Function>, reducer<Function>}
 */
function normalizeArg(reducerArg) {
  if (_.isArray(reducerArg)) {
    if (reducerArg.length === 2 && isValidKey(reducerArg[0]) && _.isFunction(reducerArg[1])) {
      const [select, reducer] = reducerArg;
      return normalizeArg({select, reducer});
    } else if (reducerArg.length === 3 && _.isFunction(reducerArg[0]) && _.isFunction(reducerArg[1]) && _.isFunction(reducerArg[2])) {
      const [select, merge, reducer] = reducerArg;
      return normalizeArg({select, merge, reducer});
    }
  }
  if (_.isFunction(reducerArg)) {
    return {...mapDefaults, reducer: reducerArg};
  }
  if (_.isString(reducerArg.select)) {
    return {...mapDefaults, ...propMap(reducerArg.select), reducer: reducerArg.reducer};
  }
  if (reducerArg.reducer === undefined || !_.isFunction(reducerArg.reducer)) {
    return {...mapDefaults, reducer: (state = reducerArg) => state};
  }
  return {...mapDefaults, ...reducerArg};
}

function configure({debug = false} = {}) {
  const log = (...args) => debug === true ? console.log(...args) : _.noop;
  /*
   Merge reducers into a single reducer.
   @params [reducerArgs] - arguments that are either functions or configuration objects
   */
  return function pipeline(...reducers) {
    // Normally unused in redux, this is to not hijack any functionality
    const context = this;

    // Returning a single reducer
    return (state, action) => {

      let output;

      // Waterfall for control flow utils
      async.waterfall(reducers.map((reducerArg, index) => {

        // All flows here must be synchronous
        log(`Received ${reducerArg}`);
        const {reducer, select, merge} = normalizeArg(reducerArg);
        log(`Normalized to ${reducer} ${select} ${merge}`);

        // Waterfall changes arguments depending on what was previously returned
        // we can't make assumptions about defaults here, so we'll just handle the variants
        return (...args) => {

          const cb = args.pop();
          // nextState is always root state
          let nextState = args.pop() || state;

          // more dancing around control flow
          if (nextState === RESULT_NULL) {
            nextState = null;
          } else if (nextState === RESULT_UNDEFINED) {
            nextState = undefined;
          }

          // nextStateFragment is namespaced
          const nextStateFragment = select(nextState);

          // bail is largely unused, but we want the user to have control if need be
          // This is the `end` method used for chain interrupts
          const bail = (earlyState) => {

            const outEarlyState = merge(earlyState, nextState);

            // Symbols to get around waterfall's control methods
            if (outEarlyState === undefined) {
              log(`Received undefined interrupt, passing ${String(EARLY_UNDEFINED)}`);
              cb(EARLY_UNDEFINED);
            } else if (outEarlyState === null) {
              log(`Received null interrupt, passing ${String(EARLY_NULL)}`);
              cb(EARLY_NULL);
            } else {
              log(`Received interrupt, passing ${outEarlyState}`);
              cb(outEarlyState);
            }
            return EARLY;

          };

          // Run the reducer - the result may be passed to `bail`
          log(`Calling reducer step ${index}`);
          const result = reducer.call(context, nextStateFragment, action, bail);
          log(`Received reducer step ${index}`);

          if (result !== EARLY) {
            // if we didn't bail and we received null or undefined,
            // we must pass that to the next reducer
            const outState = merge(result, nextState);
            if (outState === null) {
              log(`Received null result, passing ${String(RESULT_NULL)}`);
              cb(null, RESULT_NULL);
            } else if (outState === RESULT_UNDEFINED) {
              log(`Received undefined result, passing ${String(RESULT_UNDEFINED)}`);
              cb(null, RESULT_UNDEFINED);
            } else {
              log(`Received result, passing ${outState}`);
              cb(null, outState);
            }
          }
        }
      }), (early, result) => {
        // We've got output!
        // If our functions weren't synchronous, we'll have an issues here.
        // I'm going to count on your to write real reducers, so no help from me if this happens
        output = (early === undefined || early === null) ? result : early;
        if (output === EARLY_UNDEFINED || output === RESULT_UNDEFINED) {
          output = undefined;
        }
        if (output === EARLY_NULL || output === RESULT_NULL) {
          output = null;
        }
      });
      return output;
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
  normalizeArg // for testing
};
