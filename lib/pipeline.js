'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configurePipeline = exports.debugPipeline = exports.pipeline = undefined;

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

      var end = function end(result) {
        nextState = result;
        return EARLY;
      };

      // Reducify does most of the work for us

      for (var _len2 = arguments.length, restArgs = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        restArgs[_key2 - 2] = arguments[_key2];
      }

      for (var i = 0; i < reducers.length; i++) {
        var _reducers$i;

        var result = (_reducers$i = reducers[i]).call.apply(_reducers$i, [context, nextState, action, end].concat(restArgs));
        if (result === EARLY) {
          break;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDckIsTUFBSSxDQUFDLGlCQUFFLE9BQUYsQ0FBVSxHQUFWLENBQUwsRUFBcUI7QUFDbkIsV0FBTyxHQUFQO0FBQ0Q7QUFDRCxVQUFRLFNBQVIsMENBQXNCLEdBQXRCO0FBQ0Q7O0FBRUQ7QUFDQSxJQUFNLFFBQVEsc0JBQU8sT0FBUCxDQUFkOztBQUVBLFNBQVMsU0FBVCxHQUF5QztBQUFBLG1FQUFKLEVBQUk7O0FBQUEsd0JBQXJCLEtBQXFCO0FBQUEsTUFBckIsS0FBcUIsOEJBQWIsS0FBYTs7QUFDdkMsTUFBTSxNQUFNLFNBQU4sR0FBTTtBQUFBOztBQUFBLFdBQWEsVUFBVSxJQUFWLEdBQWlCLHFCQUFRLEdBQVIsMkJBQWpCLEdBQXdDLGlCQUFFLElBQXZEO0FBQUEsR0FBWjtBQUNBOzs7O0FBSUEsU0FBTyxTQUFTLFFBQVQsR0FBa0M7QUFBQSxzQ0FBYixXQUFhO0FBQWIsaUJBQWE7QUFBQTs7QUFDdkM7QUFDQSxRQUFNLFdBQVcsWUFBWSxHQUFaLENBQWdCO0FBQUEsYUFBTyx3QkFBUyxTQUFTLEdBQVQsQ0FBVCxDQUFQO0FBQUEsS0FBaEIsQ0FBakI7O0FBRUE7QUFDQSxXQUFPLFNBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQyxNQUFoQyxFQUFxRDtBQUMxRCxVQUFNLFVBQVUsSUFBaEI7QUFDQSxVQUFJLFlBQVksS0FBaEI7O0FBRUEsVUFBTSxNQUFNLFNBQU4sR0FBTSxDQUFDLE1BQUQsRUFBWTtBQUN0QixvQkFBWSxNQUFaO0FBQ0EsZUFBTyxLQUFQO0FBQ0QsT0FIRDs7QUFLQTs7QUFUMEQseUNBQVYsUUFBVTtBQUFWLGdCQUFVO0FBQUE7O0FBVTFELFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTJDO0FBQUE7O0FBQ3pDLFlBQU0sU0FBUyx3QkFBUyxDQUFULEdBQVksSUFBWixxQkFBaUIsT0FBakIsRUFBMEIsU0FBMUIsRUFBcUMsTUFBckMsRUFBNkMsR0FBN0MsU0FBcUQsUUFBckQsRUFBZjtBQUNBLFlBQUksV0FBVyxLQUFmLEVBQXNCO0FBQ3BCO0FBQ0Q7QUFDRCxvQkFBWSxNQUFaO0FBQ0Q7QUFDRCxhQUFPLFNBQVA7QUFDRCxLQWxCRDtBQW1CRCxHQXhCRDtBQXlCRDs7QUFFRCxJQUFNLFdBQVcsV0FBakI7O2tCQUVlLFE7OztBQUVmLElBQU0sZ0JBQWdCLFVBQVUsRUFBQyxPQUFPLElBQVIsRUFBVixDQUF0QjtRQUVFLFEsR0FBQSxRO1FBQ0EsYSxHQUFBLGE7UUFDYSxpQixHQUFiLFMiLCJmaWxlIjoicGlwZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVkdWNpZnkgZnJvbSAncmVkdWNpZnknO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZnVuY3Rpb24gY2xlYW5BcmcoYXJnKSB7XG4gIGlmICghXy5pc0FycmF5KGFyZykpIHtcbiAgICByZXR1cm4gYXJnO1xuICB9XG4gIHJldHVybiBbdW5kZWZpbmVkLCAuLi5hcmddO1xufVxuXG4vLyBTaWduYWxzIHVzZWQgZm9yIGNvbnRyb2wgZmxvdyBjb21tYW5kc1xuY29uc3QgRUFSTFkgPSBTeW1ib2woJ0VBUkxZJyk7XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZSh7ZGVidWcgPSBmYWxzZX0gPSB7fSkge1xuICBjb25zdCBsb2cgPSAoLi4uYXJncykgPT4gZGVidWcgPT09IHRydWUgPyBjb25zb2xlLmxvZyguLi5hcmdzKSA6IF8ubm9vcDtcbiAgLypcbiAgIE1lcmdlIHJlZHVjZXJzIGludG8gYSBzaW5nbGUgcmVkdWNlci5cbiAgIEBwYXJhbXMgW3JlZHVjZXJBcmdzXSAtIGFyZ3VtZW50cyB0aGF0IGFyZSBlaXRoZXIgZnVuY3Rpb25zIG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIHBpcGVsaW5lKC4uLnJlZHVjZXJBcmdzKSB7XG4gICAgLy8gTm9ybWFsbHkgdW51c2VkIGluIHJlZHV4LCB0aGlzIGlzIHRvIG5vdCBoaWphY2sgYW55IGZ1bmN0aW9uYWxpdHlcbiAgICBjb25zdCByZWR1Y2VycyA9IHJlZHVjZXJBcmdzLm1hcChhcmcgPT4gcmVkdWNpZnkoY2xlYW5BcmcoYXJnKSkpO1xuXG4gICAgLy8gUmV0dXJuaW5nIGEgc2luZ2xlIHJlZHVjZXJcbiAgICByZXR1cm4gZnVuY3Rpb24gcGlwZWxpbmVSZWR1Y2VyKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3RBcmdzKSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAgIGxldCBuZXh0U3RhdGUgPSBzdGF0ZTtcblxuICAgICAgY29uc3QgZW5kID0gKHJlc3VsdCkgPT4ge1xuICAgICAgICBuZXh0U3RhdGUgPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiBFQVJMWTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFJlZHVjaWZ5IGRvZXMgbW9zdCBvZiB0aGUgd29yayBmb3IgdXNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVkdWNlcnMubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXJzW2ldLmNhbGwoY29udGV4dCwgbmV4dFN0YXRlLCBhY3Rpb24sIGVuZCwgLi4ucmVzdEFyZ3MpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBFQVJMWSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG5leHRTdGF0ZSA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBwaXBlbGluZSA9IGNvbmZpZ3VyZSgpO1xuXG5leHBvcnQgZGVmYXVsdCBwaXBlbGluZTtcblxuY29uc3QgZGVidWdQaXBlbGluZSA9IGNvbmZpZ3VyZSh7ZGVidWc6IHRydWV9KTtcbmV4cG9ydCB7XG4gIHBpcGVsaW5lLFxuICBkZWJ1Z1BpcGVsaW5lLFxuICBjb25maWd1cmUgYXMgY29uZmlndXJlUGlwZWxpbmUsXG59O1xuIl19