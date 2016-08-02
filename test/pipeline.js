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
      {"SUBTRACT": (state = 0, action) => state - action.data}
    );

    it('should be a function', function () {
      assert.isFunction(pipelineResult);
    });
    it('should act as identity if no type or action passed', function () {
      const state = 10;
      assert.equal(state, pipelineResult(state, {}));
      assert.equal(state, pipelineResult(state, {data: 4}));
    });
    it('should support multiple dispatch types', function () {
      const state = 10;

      const toAdd = 4;
      assert.equal(state + toAdd, pipelineResult(state, {type: 'ADD', data: toAdd}));

      const toSubtract = 4;
      assert.equal(state - toSubtract, pipelineResult(state, {type: 'SUBTRACT', data: toSubtract}));
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
      [
        (state) => state.addKey3,
        (result, state) => {
          return ({...state, addKey3: result});
        },
        addReducer
      ],
      [
        'mixedKey',
        subtractReducer
      ]
    );

    it('should be a function', function () {
      assert.isFunction(pipelineResult);
    });

    it('should apply reducers to all configured keys', function () {

      const state = {
        'mixedKey': 10, 'addKey2': 2, 'addKey3': 8
      };

      const toAdd = 4;
      assert.deepEqual(mapObject(state, val => val + toAdd), pipelineResult(state, {type: 'ADD', data: toAdd}));

    });

    it('should not apply reducers non configured keys', function () {

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

      const stateCopy = _.cloneDeep(state);

      const toAdd = 4;
      const action = {type: 'ADD', data: toAdd};
      pipelineResult(state, action);
      assert.deepEqual(state, stateCopy);
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
      const stateCopy = _.cloneDeep(state);
      pipelineResult(state, action);


      assert.deepEqual(state, stateCopy);
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
