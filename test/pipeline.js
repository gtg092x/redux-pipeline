import pipeline from '../src/pipeline';
import _ from 'lodash';
import chai from 'chai';

const {assert} = chai;

function mapObject(obj, map) {
  return Object.keys(obj).reduce((pointer, key) => ({...pointer, [key]: map(obj[key])}), {});
}

export default function () {


  describe('flat', function () {

    const pipelineResult = pipeline(
      (state = 0) => {
        return state;
      },
      (state = 0, action) => {
        switch (action.type) {
          case "ADD":
            return state + action.data;
          default:
            return state;
        }
      },
      (state = 0, action) => {
        switch (action.type) {
          case "SUBTRACT":
            return state - action.data;
          default:
            return state;
        }
      }
    );

    it('should be a function', function () {
      assert.isFunction(pipelineResult);
    });
    it('should act as identity if no type or action passed', function () {
      const state = 10;
      assert.equal(state, pipelineResult(state, {}));
      assert.equal(state, pipelineResult(state, {data: 4}));
    });
    it('should support both dispatch types', function () {
      const state = 10;

      const toAdd = 4;
      assert.equal(state + toAdd, pipelineResult(state, {type: 'ADD', data: toAdd}));

      const toSubtract = 4;
      assert.equal(state - toSubtract, pipelineResult(state, {type: 'SUBTRACT', data: toSubtract}));
    });

    it('should be stateless', function () {
      const state = 10;

      const toAdd = 4;
      const addAction = {type: 'ADD', data: toAdd};
      assert.equal(state + toAdd + toAdd, pipelineResult(pipelineResult(state, addAction), addAction));

      const toSubtract = 4;
      const subAction = {type: 'SUBTRACT', data: toSubtract};
      assert.equal(state - toSubtract - toSubtract, pipelineResult(pipelineResult(state, subAction), subAction));
    });
  });

  describe('selects', function () {

    const addReducer = (state = 0, action) => {
      switch (action.type) {
        case "ADD":
          return state + action.data;
        default:
          return state;
      }
    };

    const subtractReducer = (state = 0, action) => {
      switch (action.type) {
        case "SUBTRACT":
          return state - action.data;
        default:
          return state;
      }
    };

    const pipelineResult = pipeline(
      (state = {}) => {
        return state;
      },
      [
        'mixedKey',
        addReducer
      ],
      {
        select: 'addKey2',
        reducer: addReducer
      },
      {
        select: (state) => state.addKey3,
        merge: (result, state) => {
          return ({...state, addKey3: result});
        },
        reducer: addReducer
      },
      [
        'mixedKey',
        subtractReducer
      ]
    );

    it('should be a function', function () {
      assert.isFunction(pipelineResult);
    });
    it('should act as identity if no type or action passed  - defaults are injected', function () {
      const state = {mixedKey: 0, addKey2: 0, addKey3: 0};
      assert.deepEqual(state, pipelineResult(state, {}));
      assert.deepEqual(state, pipelineResult(state, {data: 4}));
    });
    it('should apply reducers to all keys', function () {

      const state = {
        'mixedKey': 10, 'addKey2': 2, 'addKey3': 8
      };

      const toAdd = 4;
      assert.deepEqual(mapObject(state, val => val + toAdd), pipelineResult(state, {type: 'ADD', data: toAdd}));

    });

    it('should apply subtract to only addKey1', function () {

      const state = {
        'mixedKey': 10, 'addKey2': 2, 'addKey3': 8
      };

      const toSubtract = 4;
      const result = pipelineResult(state, {type: 'SUBTRACT', data: toSubtract});
      assert.notDeepEqual(mapObject(state, val => val - toSubtract), result);
      assert.equal(state.mixedKey - toSubtract, result.mixedKey);

    });

    it('should be stateless', function () {
      const state = {
        'mixedKey': 10, 'addKey2': 2, 'addKey3': 8
      };

      const toAdd = 4;
      const action = {type: 'ADD', data: toAdd};
      assert.deepEqual(mapObject(state, val => val + toAdd + toAdd), pipelineResult(pipelineResult(state, action), action));
    });
  });

  describe('nulls and undefined', function () {

    const pipelineResult = pipeline(
      (state = 0) => {
        return state;
      },
      (state = 0, action) => {
        switch (action.type) {
          case "NULL":
            return null;
          default:
            return state;
        }
      },
      (state = 0, action) => {
        switch (action.type) {
          case "UNDEFINED":
            return undefined;
          default:
            return state;
        }
      }
    );

    it('should support undefined', function () {
      assert.isUndefined(pipelineResult(0, {type: 'UNDEFINED'}))
    });

    it('should support null', function () {
      assert.isNull(pipelineResult(0, {type: 'NULL'}))
    });
  });

  describe('nested', function () {

    const addReducer = (state = 0, action) => {
      switch (action.type) {
        case "ADD":
          return state + action.data;
        default:
          return state;
      }
    };

    const pipelineResult = pipeline(
      (state = {}) => {
        return state;
      },
      [
        'addKey1',
        addReducer

      ],
      [
        'addKey2',
        pipeline(
          {},
          [
            'data',
            addReducer
          ]
        )
      ]
    );

    const state = {addKey1: 0, addKey2: {data: 0}};

    it('should be a function', function () {
      assert.isFunction(pipelineResult);
    });
    it('should act as identity if no type or action passed - defaults are injected', function () {


      assert.deepEqual(state, pipelineResult(state, {}));
      assert.deepEqual(state, pipelineResult(state, {data: 4}));

      assert.notDeepEqual({}, pipelineResult(state, {data: 4}));
    });
    it('should apply reducers to all keys', function () {

      const toAdd = 10;
      const action = {type: 'ADD', data: toAdd};
      const result = pipelineResult(state, action);
      assert.equal(state.addKey1 + toAdd, result.addKey1);
      assert.equal(state.addKey2.data + toAdd, result.addKey2.data);
    });

    it('should be stateless', function () {
      const toAdd = 10;
      const action = {type: 'ADD', data: toAdd};
      const result = pipelineResult(pipelineResult(state, action), action);

      assert.equal(state.addKey1 + toAdd + toAdd, result.addKey1);
      assert.equal(state.addKey2.data + toAdd + toAdd, result.addKey2.data);
    });
  });

  describe('defaults', function () {

    const arg = {foo: 'bar'};
    const pipelineResult = pipeline(arg, _.identity);

    it('should be a function', function () {
      assert.isFunction(pipelineResult);
    });
    it('should return the default value', function () {
      assert.deepEqual(pipelineResult(), arg);
    });
  });

  describe('interrupt', function () {

    const pipelineResult = pipeline(
      (state = 0) => {
        return state;
      },
      (state = 0, action, end) => {
        switch (action.type) {
          case "NULL":
            return end(null);
          case "UNDEFINED":
            return end(undefined);
          case "ADD":
            return end(state + action.data);
          default:
            return state;
        }
      },
      (state = 0, action) => {
        switch (action.type) {
          case "ADD":
          case "UNDEFINED":
          case "NULL":
            throw 'Should not reach';
          default:
            return state;
        }
      }
    );

    it('should support undefined', function () {
      assert.isUndefined(pipelineResult(0, {type: 'UNDEFINED'}))
    });
    it('should support null', function () {
      assert.isNull(pipelineResult(0, {type: 'NULL'}))
    });
    it('should support commands', function () {
      const toAdd = 10;
      assert.equal(toAdd, pipelineResult(0, {type: 'ADD', data: toAdd}))
    });
  });
}
