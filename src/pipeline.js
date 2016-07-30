import async from 'async';
import _ from 'lodash';

// Signals used for control flow commands
const EARLY = Symbol('EARLY');
const EARLY_NULL = Symbol('EARLY_NULL');
const EARLY_UNDEFINED = Symbol('EARLY_UNDEFINED');

const mapDefaults = {
  select: _.identity,
  merge: _.identity
};

function propMap(key) {
  return {
    select(state) {
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

function normalizeArg(reducerArg) {
  if (_.isArray(reducerArg)) {
    if (reducerArg.length === 2 && _.isString(reducerArg[0]) && _.isFunction(reducerArg[1])) {
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

function pipeline(...reducers) {
  const context = this;
  return (state, action) => {
    let output;
    async.waterfall(reducers.map(reducerArg => {

      const {reducer, select, merge} = normalizeArg(reducerArg);

      return (...args) => {
        const cb = args.pop();
        const nextState = args.pop() || state;
        const nextStateFragment = select(nextState);

        const bail = (earlyState) => {

          const outEarlyState = merge(earlyState, nextState);
          if (outEarlyState === undefined) {
            cb(EARLY_UNDEFINED);
          }
          if (outEarlyState === null) {
            cb(EARLY_NULL);
          } else {
            cb(outEarlyState);
          }
          return EARLY;

        };
        const result = reducer.call(context, nextStateFragment, action, bail);

        if (result !== EARLY) {
          const outState = merge(result, nextState);
          cb(null, outState);
        }
      }
    }), (early, result) => {
      output = (early === undefined || early === null) ? result : early;
      if (output === EARLY_UNDEFINED) {
        output = undefined;
      }
      if (output === EARLY_NULL) {
        output = null;
      }
    });
    return output;
  };
}

export default pipeline;
