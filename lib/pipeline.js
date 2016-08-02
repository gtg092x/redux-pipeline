'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configurePipeline = exports.debugPipeline = exports.pipeline = undefined;

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _reducify = require('reducify');

var _reducify2 = _interopRequireDefault(_reducify);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    // Normally unused in redux, this is to not hijack any functionality
    var context = this;

    for (var _len = arguments.length, reducerArgs = Array(_len), _key = 0; _key < _len; _key++) {
      reducerArgs[_key] = arguments[_key];
    }

    var reducers = reducerArgs.map(_reducify2.default);

    // Returning a single reducer
    return function (state, action) {

      var output = state;

      var end = function end(result) {
        output = result;
        return EARLY;
      };

      // Reducify does most of the work for us
      for (var i = 0; i < reducers.length; i++) {
        var result = reducers.call(context, state, action, end);
        if (result === EARLY) {
          break;
        }
        output = result;
      }
      return output;
    };
  };
}

var pipeline = configure();

exports.default = pipeline;


var debugPipeline = configure({ debug: true });
exports.pipeline = pipeline;
exports.debugPipeline = debugPipeline;
exports.configurePipeline = configure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBO0FBQ0EsSUFBTSxRQUFRLHNCQUFPLE9BQVAsQ0FBZDs7QUFFQSxTQUFTLFNBQVQsR0FBeUM7QUFBQSxtRUFBSixFQUFJOztBQUFBLHdCQUFyQixLQUFxQjtBQUFBLE1BQXJCLEtBQXFCLDhCQUFiLEtBQWE7O0FBQ3ZDLE1BQU0sTUFBTSxTQUFOLEdBQU07QUFBQTs7QUFBQSxXQUFhLFVBQVUsSUFBVixHQUFpQixxQkFBUSxHQUFSLDJCQUFqQixHQUF3QyxpQkFBRSxJQUF2RDtBQUFBLEdBQVo7QUFDQTs7OztBQUlBLFNBQU8sU0FBUyxRQUFULEdBQWtDO0FBQ3ZDO0FBQ0EsUUFBTSxVQUFVLElBQWhCOztBQUZ1QyxzQ0FBYixXQUFhO0FBQWIsaUJBQWE7QUFBQTs7QUFJdkMsUUFBTSxXQUFXLFlBQVksR0FBWixvQkFBakI7O0FBRUE7QUFDQSxXQUFPLFVBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7O0FBRXhCLFVBQUksU0FBUyxLQUFiOztBQUVBLFVBQU0sTUFBTSxTQUFOLEdBQU0sQ0FBQyxNQUFELEVBQVk7QUFDdEIsaUJBQVMsTUFBVDtBQUNBLGVBQU8sS0FBUDtBQUNELE9BSEQ7O0FBS0E7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBUyxNQUE3QixFQUFxQyxHQUFyQyxFQUEyQztBQUN6QyxZQUFNLFNBQVMsU0FBUyxJQUFULENBQWMsT0FBZCxFQUF1QixLQUF2QixFQUE4QixNQUE5QixFQUFzQyxHQUF0QyxDQUFmO0FBQ0EsWUFBSSxXQUFXLEtBQWYsRUFBc0I7QUFDcEI7QUFDRDtBQUNELGlCQUFTLE1BQVQ7QUFDRDtBQUNELGFBQU8sTUFBUDtBQUNELEtBbEJEO0FBbUJELEdBMUJEO0FBMkJEOztBQUVELElBQU0sV0FBVyxXQUFqQjs7a0JBRWUsUTs7O0FBRWYsSUFBTSxnQkFBZ0IsVUFBVSxFQUFDLE9BQU8sSUFBUixFQUFWLENBQXRCO1FBRUUsUSxHQUFBLFE7UUFDQSxhLEdBQUEsYTtRQUNhLGlCLEdBQWIsUyIsImZpbGUiOiJwaXBlbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZWR1Y2lmeSBmcm9tICdyZWR1Y2lmeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG4vLyBTaWduYWxzIHVzZWQgZm9yIGNvbnRyb2wgZmxvdyBjb21tYW5kc1xuY29uc3QgRUFSTFkgPSBTeW1ib2woJ0VBUkxZJyk7XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZSh7ZGVidWcgPSBmYWxzZX0gPSB7fSkge1xuICBjb25zdCBsb2cgPSAoLi4uYXJncykgPT4gZGVidWcgPT09IHRydWUgPyBjb25zb2xlLmxvZyguLi5hcmdzKSA6IF8ubm9vcDtcbiAgLypcbiAgIE1lcmdlIHJlZHVjZXJzIGludG8gYSBzaW5nbGUgcmVkdWNlci5cbiAgIEBwYXJhbXMgW3JlZHVjZXJBcmdzXSAtIGFyZ3VtZW50cyB0aGF0IGFyZSBlaXRoZXIgZnVuY3Rpb25zIG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uIHBpcGVsaW5lKC4uLnJlZHVjZXJBcmdzKSB7XG4gICAgLy8gTm9ybWFsbHkgdW51c2VkIGluIHJlZHV4LCB0aGlzIGlzIHRvIG5vdCBoaWphY2sgYW55IGZ1bmN0aW9uYWxpdHlcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcblxuICAgIGNvbnN0IHJlZHVjZXJzID0gcmVkdWNlckFyZ3MubWFwKHJlZHVjaWZ5KTtcblxuICAgIC8vIFJldHVybmluZyBhIHNpbmdsZSByZWR1Y2VyXG4gICAgcmV0dXJuIChzdGF0ZSwgYWN0aW9uKSA9PiB7XG5cbiAgICAgIGxldCBvdXRwdXQgPSBzdGF0ZTtcblxuICAgICAgY29uc3QgZW5kID0gKHJlc3VsdCkgPT4ge1xuICAgICAgICBvdXRwdXQgPSByZXN1bHQ7XG4gICAgICAgIHJldHVybiBFQVJMWTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFJlZHVjaWZ5IGRvZXMgbW9zdCBvZiB0aGUgd29yayBmb3IgdXNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVkdWNlcnMubGVuZ3RoOyBpICsrKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXJzLmNhbGwoY29udGV4dCwgc3RhdGUsIGFjdGlvbiwgZW5kKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gRUFSTFkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQgPSByZXN1bHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG4gIH1cbn1cblxuY29uc3QgcGlwZWxpbmUgPSBjb25maWd1cmUoKTtcblxuZXhwb3J0IGRlZmF1bHQgcGlwZWxpbmU7XG5cbmNvbnN0IGRlYnVnUGlwZWxpbmUgPSBjb25maWd1cmUoe2RlYnVnOiB0cnVlfSk7XG5leHBvcnQge1xuICBwaXBlbGluZSxcbiAgZGVidWdQaXBlbGluZSxcbiAgY29uZmlndXJlIGFzIGNvbmZpZ3VyZVBpcGVsaW5lLFxufTtcbiJdfQ==