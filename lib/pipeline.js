'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configurePipeline = exports.debugPipeline = exports.pipeline = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _reducify = require('reducify');

var _reducify2 = _interopRequireDefault(_reducify);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cleanArg(arg) {
  if (!_lodash2.default.isArray(arg)) {
    return arg;
  }
  return [undefined].concat((0, _toConsumableArray3.default)(arg));
}

// Signals used for control flow commands
var EARLY = (0, _symbol2.default)('EARLY');
var SKIP = (0, _symbol2.default)('SKIP');
var NEXT = (0, _symbol2.default)('NEXT');

function configure() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$debug = _ref.debug;
  var debug = _ref$debug === undefined ? false : _ref$debug;

  var log = function log() {
    var _console;

    return debug === true ? (_console = console).log.apply(_console, arguments) : _lodash2.default.noop;
  };
  /*
   Merge reducers into a single reducer.
   @params [reducerArgs] - arguments that are either functions or configuration objects
   */
  return function pipeline() {
    for (var _len = arguments.length, reducerArgs = Array(_len), _key = 0; _key < _len; _key++) {
      reducerArgs[_key] = arguments[_key];
    }

    // Normally unused in redux, this is to not hijack any functionality
    var reducers = reducerArgs.map(function (arg) {
      return (0, _reducify2.default)(cleanArg(arg));
    });

    // Returning a single reducer
    return function pipelineReducer(state, action) {
      var context = this;
      var nextState = state;
      var nextAction = action;
      var skipCount = 1;

      var pipe = {
        end: function end(result) {
          nextState = result;
          return EARLY;
        },
        skip: function skip(result) {
          var toSkip = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

          nextState = result;
          skipCount = toSkip;
          return SKIP;
        },
        mutateAction: function mutateAction(mutation) {
          nextAction = _lodash2.default.isFunction(mutation) ? mutation(nextAction) : (0, _extends3.default)({}, nextAction, mutation);
          if ((arguments.length <= 1 ? 0 : arguments.length - 1) > 0) {
            nextState = arguments.length <= 1 ? undefined : arguments[1];
            return NEXT;
          }
          return pipe;
        }
      };

      // Reducify does most of the work for us

      for (var _len2 = arguments.length, restArgs = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        restArgs[_key2 - 2] = arguments[_key2];
      }

      for (var i = 0; i < reducers.length; i++) {
        var _reducers$i;

        var result = (_reducers$i = reducers[i]).call.apply(_reducers$i, [context, nextState, nextAction, pipe].concat(restArgs));
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
  };
}

var pipeline = configure();

exports.default = pipeline;


var debugPipeline = configure({ debug: true });
exports.pipeline = pipeline;
exports.debugPipeline = debugPipeline;
exports.configurePipeline = configure;
//# sourceMappingURL=data:application/json;base64,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cG9ydCByZWR1Y2lmeSBmcm9tICdyZWR1Y2lmeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBjbGVhbkFyZyhhcmcpIHtcbiAgaWYgKCFfLmlzQXJyYXkoYXJnKSkge1xuICAgIHJldHVybiBhcmc7XG4gIH1cbiAgcmV0dXJuIFt1bmRlZmluZWQsIC4uLmFyZ107XG59XG5cbi8vIFNpZ25hbHMgdXNlZCBmb3IgY29udHJvbCBmbG93IGNvbW1hbmRzXG5jb25zdCBFQVJMWSA9IFN5bWJvbCgnRUFSTFknKTtcbmNvbnN0IFNLSVAgPSBTeW1ib2woJ1NLSVAnKTtcbmNvbnN0IE5FWFQgPSBTeW1ib2woJ05FWFQnKTtcblxuZnVuY3Rpb24gY29uZmlndXJlKHtkZWJ1ZyA9IGZhbHNlfSA9IHt9KSB7XG4gIGNvbnN0IGxvZyA9ICguLi5hcmdzKSA9PiBkZWJ1ZyA9PT0gdHJ1ZSA/IGNvbnNvbGUubG9nKC4uLmFyZ3MpIDogXy5ub29wO1xuICAvKlxuICAgTWVyZ2UgcmVkdWNlcnMgaW50byBhIHNpbmdsZSByZWR1Y2VyLlxuICAgQHBhcmFtcyBbcmVkdWNlckFyZ3NdIC0gYXJndW1lbnRzIHRoYXQgYXJlIGVpdGhlciBmdW5jdGlvbnMgb3IgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAqL1xuICByZXR1cm4gZnVuY3Rpb24gcGlwZWxpbmUoLi4ucmVkdWNlckFyZ3MpIHtcbiAgICAvLyBOb3JtYWxseSB1bnVzZWQgaW4gcmVkdXgsIHRoaXMgaXMgdG8gbm90IGhpamFjayBhbnkgZnVuY3Rpb25hbGl0eVxuICAgIGNvbnN0IHJlZHVjZXJzID0gcmVkdWNlckFyZ3MubWFwKGFyZyA9PiByZWR1Y2lmeShjbGVhbkFyZyhhcmcpKSk7XG5cbiAgICAvLyBSZXR1cm5pbmcgYSBzaW5nbGUgcmVkdWNlclxuICAgIHJldHVybiBmdW5jdGlvbiBwaXBlbGluZVJlZHVjZXIoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdEFyZ3MpIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgbGV0IG5leHRTdGF0ZSA9IHN0YXRlO1xuICAgICAgbGV0IG5leHRBY3Rpb24gPSBhY3Rpb247XG4gICAgICBsZXQgc2tpcENvdW50ID0gMTtcblxuXG4gICAgICBjb25zdCBwaXBlID0ge1xuICAgICAgICBlbmQocmVzdWx0KSB7XG4gICAgICAgICAgbmV4dFN0YXRlID0gcmVzdWx0O1xuICAgICAgICAgIHJldHVybiBFQVJMWTtcbiAgICAgICAgfSxcbiAgICAgICAgc2tpcChyZXN1bHQsIHRvU2tpcCA9IDEpIHtcbiAgICAgICAgICBuZXh0U3RhdGUgPSByZXN1bHQ7XG4gICAgICAgICAgc2tpcENvdW50ID0gdG9Ta2lwO1xuICAgICAgICAgIHJldHVybiBTS0lQO1xuICAgICAgICB9LFxuICAgICAgICBtdXRhdGVBY3Rpb24obXV0YXRpb24sIC4uLmFyZ3MpIHtcbiAgICAgICAgICBuZXh0QWN0aW9uID0gXy5pc0Z1bmN0aW9uKG11dGF0aW9uKSA/IG11dGF0aW9uKG5leHRBY3Rpb24pIDogey4uLm5leHRBY3Rpb24sIC4uLm11dGF0aW9ufTtcbiAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGUgPSBhcmdzWzBdO1xuICAgICAgICAgICAgcmV0dXJuIE5FWFQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwaXBlO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBSZWR1Y2lmeSBkb2VzIG1vc3Qgb2YgdGhlIHdvcmsgZm9yIHVzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZHVjZXJzLmxlbmd0aDsgaSArKykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZWR1Y2Vyc1tpXS5jYWxsKGNvbnRleHQsIG5leHRTdGF0ZSwgbmV4dEFjdGlvbiwgcGlwZSwgLi4ucmVzdEFyZ3MpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBFQVJMWSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgPT09IE5FWFQpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ID09PSBTS0lQKSB7XG4gICAgICAgICAgaSArPSBza2lwQ291bnQ7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dFN0YXRlID0gcmVzdWx0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICB9O1xuICB9XG59XG5cbmNvbnN0IHBpcGVsaW5lID0gY29uZmlndXJlKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHBpcGVsaW5lO1xuXG5jb25zdCBkZWJ1Z1BpcGVsaW5lID0gY29uZmlndXJlKHtkZWJ1ZzogdHJ1ZX0pO1xuZXhwb3J0IHtcbiAgcGlwZWxpbmUsXG4gIGRlYnVnUGlwZWxpbmUsXG4gIGNvbmZpZ3VyZSBhcyBjb25maWd1cmVQaXBlbGluZSxcbn07XG4iXX0=