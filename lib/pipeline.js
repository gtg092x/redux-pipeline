'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configurePipeline = exports.debugPipeline = exports.pipeline = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reducify = require('reducify');

var _reducify2 = _interopRequireDefault(_reducify);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function cleanArg(arg) {
  if (!_lodash2.default.isArray(arg)) {
    return arg;
  }
  return [undefined].concat(_toConsumableArray(arg));
}

// Signals used for control flow commands
var EARLY = Symbol('EARLY');
var SKIP = Symbol('SKIP');
var NEXT = Symbol('NEXT');

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
          nextAction = _lodash2.default.isFunction(mutation) ? mutation(nextAction) : _extends({}, nextAction, mutation);
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
//# sourceMappingURL=data:application/json;base64,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ZnkgZnJvbSAncmVkdWNpZnknO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZnVuY3Rpb24gY2xlYW5BcmcoYXJnKSB7XG4gIGlmICghXy5pc0FycmF5KGFyZykpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9XG4gIHJldHVybiBbdW5kZWZpbmVkLCAuLi5hcmddO1xufVxuXG4vLyBTaWduYWxzIHVzZWQgZm9yIGNvbnRyb2wgZmxvdyBjb21tYW5kc1xuY29uc3QgRUFSTFkgPSBTeW1ib2woJ0VBUkxZJyk7XG5jb25zdCBTS0lQID0gU3ltYm9sKCdTS0lQJyk7XG5jb25zdCBORVhUID0gU3ltYm9sKCdORVhUJyk7XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZSh7ZGVidWcgPSBmYWxzZX0gPSB7fSkge1xuICBjb25zdCBsb2cgPSAoLi4uYXJncykgPT4gZGVidWcgPT09IHRydWUgPyBjb25zb2xlLmxvZyguLi5hcmdzKSA6IF8ubm9vcDtcbiAgLypcbiAgIE1lcmdlIHJlZHVjZXJzIGludG8gYSBzaW5nbGUgcmVkdWNlci5cbiAgIEBwYXJhbXMgW3JlZHVjZXJBcmdzXSAtIGFyZ3VtZW50cyB0aGF0IGFyZSBlaXRoZXIgZnVuY3Rpb25zIG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIHBpcGVsaW5lKC4uLnJlZHVjZXJBcmdzKSB7XG4gICAgLy8gTm9ybWFsbHkgdW51c2VkIGluIHJlZHV4LCB0aGlzIGlzIHRvIG5vdCBoaWphY2sgYW55IGZ1bmN0aW9uYWxpdHlcbiAgICBjb25zdCByZWR1Y2VycyA9IHJlZHVjZXJBcmdzLm1hcChhcmcgPT4gcmVkdWNpZnkoY2xlYW5BcmcoYXJnKSkpO1xuXG4gICAgLy8gUmV0dXJuaW5nIGEgc2luZ2xlIHJlZHVjZXJcbiAgICByZXR1cm4gZnVuY3Rpb24gcGlwZWxpbmVSZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3RBcmdzKSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAgIGxldCBuZXh0U3RhdGUgPSBzdGF0ZTtcbiAgICAgIGxldCBuZXh0QWN0aW9uID0gYWN0aW9uO1xuICAgICAgbGV0IHNraXBDb3VudCA9IDE7XG5cblxuICAgICAgY29uc3QgcGlwZSA9IHtcbiAgICAgICAgZW5kKHJlc3VsdCkge1xuICAgICAgICAgIG5leHRTdGF0ZSA9IHJlc3VsdDtcbiAgICAgICAgICByZXR1cm4gRUFSTFk7XG4gICAgICAgIH0sXG4gICAgICAgIHNraXAocmVzdWx0LCB0b1NraXAgPSAxKSB7XG4gICAgICAgICAgbmV4dFN0YXRlID0gcmVzdWx0O1xuICAgICAgICAgIHNraXBDb3VudCA9IHRvU2tpcDtcbiAgICAgICAgICByZXR1cm4gU0tJUDtcbiAgICAgICAgfSxcbiAgICAgICAgbXV0YXRlQWN0aW9uKG11dGF0aW9uLCAuLi5hcmdzKSB7XG4gICAgICAgICAgbmV4dEFjdGlvbiA9IF8uaXNGdW5jdGlvbihtdXRhdGlvbikgPyBtdXRhdGlvbihuZXh0QWN0aW9uKSA6IHsuLi5uZXh0QWN0aW9uLCAuLi5tdXRhdGlvbn07XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbmV4dFN0YXRlID0gYXJnc1swXTtcbiAgICAgICAgICAgIHJldHVybiBORVhUO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGlwZTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gUmVkdWNpZnkgZG9lcyBtb3N0IG9mIHRoZSB3b3JrIGZvciB1c1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWR1Y2Vycy5sZW5ndGg7IGkgKyspIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlcnNbaV0uY2FsbChjb250ZXh0LCBuZXh0U3RhdGUsIG5leHRBY3Rpb24sIHBpcGUsIC4uLnJlc3RBcmdzKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gRUFSTFkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ID09PSBORVhUKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gU0tJUCkge1xuICAgICAgICAgIGkgKz0gc2tpcENvdW50O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIG5leHRTdGF0ZSA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBwaXBlbGluZSA9IGNvbmZpZ3VyZSgpO1xuXG5leHBvcnQgZGVmYXVsdCBwaXBlbGluZTtcblxuY29uc3QgZGVidWdQaXBlbGluZSA9IGNvbmZpZ3VyZSh7ZGVidWc6IHRydWV9KTtcbmV4cG9ydCB7XG4gIHBpcGVsaW5lLFxuICBkZWJ1Z1BpcGVsaW5lLFxuICBjb25maWd1cmUgYXMgY29uZmlndXJlUGlwZWxpbmUsXG59O1xuIl19