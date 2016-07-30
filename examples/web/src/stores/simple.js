import { createStore, applyMiddleware, combineReducers } from 'redux';

import simple from '../reducers/composite';


const reducer = combineReducers({simple});
export default createStore(
  reducer,
  undefined,
  applyMiddleware()
);
