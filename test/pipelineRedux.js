import { createStore, combineReducers } from 'redux';
import _ from 'lodash';
import chai from 'chai';
import pipeline from '../src/pipeline';

const {assert} = chai;

export default function () {

  describe('should integreate with redux', function () {

    const addReducer = (state = 0, action) => {
      switch (action.type) {
        case "ADD":
          return state + action.data;
        default:
          return state;
      }
    };
    const subReducer = (state = 0, action) => {
      switch (action.type) {
        case "SUBTRACT":
          return state - action.data;
        default:
          return state;
      }
    };
    const setReducer = (state = 0, action) => {
      switch (action.type) {
        case "SET":
          return action.data;
        default:
          return state;
      }
    };



    it('handle all dispatches args', function () {

      const store = createStore(pipeline(
        addReducer,
        subReducer,
        setReducer
      ));


      const {dispatch, getState} = store;
      let toCompare = 10;
      dispatch({type: 'SET', data: toCompare});

      const toAdd = 10;
      dispatch({type: 'ADD', data: toAdd});
      toCompare += toAdd;
      assert.equal(toCompare, getState());

      const toAddAgain = 5;
      dispatch({type: 'ADD', data: toAddAgain});
      toCompare += toAddAgain;
      assert.equal(toCompare, getState());

      const toSubtract = 5;
      dispatch({type: 'SUBTRACT', data: toSubtract});
      toCompare -= toSubtract;
      assert.equal(toCompare, getState());

      const toSet = 13;
      dispatch({type: 'SET', data: toSet});
      toCompare = toSet;
      assert.equal(toCompare, getState());

      dispatch({type: 'NONE'});
      assert.equal(toCompare, getState());
    });
    it('should work with combine reducers', function () {

      const pipelineResult = pipeline(
        addReducer,
        subReducer,
        setReducer
      );
      const store = createStore(combineReducers({data: pipelineResult}));
      const {dispatch, getState} = store;
      let toCompare = 10;
      dispatch({type: 'SET', data: toCompare});

      const toAdd = 10;
      dispatch({type: 'ADD', data: toAdd});
      toCompare += toAdd;
      assert.equal(toCompare, getState().data);

      const toAddAgain = 5;
      dispatch({type: 'ADD', data: toAddAgain});
      toCompare += toAddAgain;
      assert.equal(toCompare, getState().data);

      const toSubtract = 5;
      dispatch({type: 'SUBTRACT', data: toSubtract});
      toCompare -= toSubtract;
      assert.equal(toCompare, getState().data);

      const toSet = 13;
      dispatch({type: 'SET', data: toSet});
      toCompare = toSet;
      assert.equal(toCompare, getState().data);

      dispatch({type: 'NONE'});
      assert.equal(toCompare, getState().data);

    });
  });
}
