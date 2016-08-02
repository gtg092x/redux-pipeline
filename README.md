# Redux Pipeline [![Build Status](https://travis-ci.org/gtg092x/redux-pipeline.svg?branch=master)](https://travis-ci.org/gtg092x/redux-pipeline)

Run [Redux][] Reducers Together.

[![NPM](https://nodei.co/npm/redux-pipeline.png?downloads=true&stars=true)](https://nodei.co/npm/redux-pipeline/)

<http://redux-pipeline.mediadrake.com/>

## Installation

    % npm install redux-pipeline

## Usage

Redux pipeline combines reducers into a single, manageable sequence.

#### MyStore.js

```js
import { createStore } from 'redux';
import pipeline from 'redux-pipeline';

function addReducer(state = 0, action) {
    switch(action.type) {
        case 'ADD':
            return state + action.data;
        default:
            return state;
    }
}

function subtractReducer(state = 0, action) {
    switch(action.type) {
        case 'SUBTRACT':
            return state - action.data;
        default:
            return state;
    }
}

export default createStore(
  pipeline(addReducer, subtractReducer)
);
```

Then just call actions like normal!

#### MyActions.js

```js
import store from './MyStore'

const {dispatch, subscribe, getState} = store;

subscribe(val => console.log('State is:', getState()));

dispatch({
    type: 'ADD',
    data: 2
});
// State is: 2

dispatch({
    type: 'SUBTRACT',
    data: 10
});
// State is: -8
```

## With Reducify

The above reducers can actually be a whole lot shorter.

```js
import { createStore } from 'redux';
import pipeline from 'redux-pipeline';

export default createStore(
  pipeline(
    {"ADD": (state = 0, action) => state + action.data}, 
    {"SUBTRACT": (state = 0, action) => state - action.data}}
  )
);
```

This is courtesy of [Reducify][]. Head over to their documentation and check out all the ways you can make reducers. Any argument you pass to pipeline gets automatically passed to reducify.

**Note!** We do have one big change between the API for [Reducify][] and Redux Pipeline - arrays will get parsed like this:
  
`[[select, merge], reducer]`

Notice we're not pulling a default value from the array! Use an earlier step in the pipeline for that.

```js
import pipeline from 'redux-pipeline';


function reducer1(state = 0, action) {
    // ...
}

function reducer2(state = 0, action) {
    // ...
}

// Works
export default createStore(
  pipeline(
    {paramOne: 1},
    ['paramOne', reducer1], 
    [state => state.paramTwo, (result, state) => ({...state, paramTwo: result}), reducer: reducer2]
  )
);

// Does not work
export default createStore(
  pipeline(    
    [{paramOne: 1}, 'paramOne', reducer1], 
    [state => state.paramTwo, (result, state) => ({...state, paramTwo: result}), reducer: reducer2]
  )
);
```

## Defaults

Just pass it in instead of a reducer. They'll turn into a reducify static reducer and you can keep on going.

```js
import { createStore } from 'redux';
import pipeline from 'redux-pipeline';

function mathReducer(state = 0, action) {
    // ...
}

function toggleReducer(state = false, action) {
    // ...
}

const store = createStore(
  pipeline(
    {myNumber: 0, myBoolean: false}, // Just pass in an object - this will be your default state
    {select: 'myNumber', reducer: mathReducer},
    {select: 'myBoolean', reducer: toggleReducer}
  )
);

store.dispatch({
   type: 'ADD',
   data: 10
});

store.dispatch({
   type: 'TOGGLE'
});

// State is: {myNumber: 10, myBoolean: true}
```

## Nesting

Because we're just making reducers, you're free to do pipe all the way down!

```js
import { createStore } from 'redux';
import pipeline from 'redux-pipeline';

function mathReducer(state = 0, action) {
    // ...
}

function toggleReducer(state = false, action) {
    // ...
}

const store = createStore(
  pipeline(
    {data: {}, otherData: {}},
    {select: 'data', reducer: pipeline(
        {select: 'myNumber', reducer: mathReducer},
        {select: 'myBoolean', reducer: toggleReducer}
    )},
    // you can use the same shortcuts when you nest
    // this is pretty much the same thing
    ['otherData', pipeline(
        ['myNumber', mathReducer],
        ['myBoolean', toggleReducer],
    )]
  )
);

store.dispatch({
   type: 'ADD',
   data: 10
});

store.dispatch({
   type: 'TOGGLE'
});

/* 
State is:
{
    data: {myNumber: 10, myBoolean: true},
    otherData: {myNumber: 10, myBoolean: true}
}
*/
```

## Generic Reducers

Not something you absolutely need this package for, but it makes this pattern a whole lot easier.

```js
import { createStore } from 'redux';
import pipeline from 'redux-pipeline';

function genericMathReducer({add, subtract}) {
    return (state = 0, action) => {
        switch(action.type) {
            case add:
                return state + action.data;
            case subtract:
                return state - action.data;
            default:
                return state;
        }        
    };    
}

const store = createStore(
  pipeline(
    {myNumber: 0, myOtherNumber: 0}, 
    ['myNumber', genericMathReducer({add: 'ADD_NUMBER', subtract: 'SUBTRACT_NUMBER'})],
    ['myOtherNumber', genericMathReducer({add: 'ADD_OTHER_NUMBER', subtract: 'SUBTRACT_OTHER_NUMBER'})]
  )
);

store.dispatch({
   type: 'ADD_NUMBER',
   data: 10
});

store.dispatch({
   type: 'SUBTRACT_OTHER_NUMBER',
   data: 5
});

// State is: {myNumber: 10, myOtherNumber: -5}
```

## Interrupt

You might want to stop the flow of the reducer chain. This is especially true if you create a generic configurable reducer but want to surpress some actions.

```js
import pipeline from 'redux-pipeline';

function blockSubtract(state = 0, action, end) {
    switch(action.type) {        
        case "SUBTRACT":
            // Notice we're passing state to the end method
            return end(state);
        default:
            return state;
    }
}

// Math reducer would come from a library or something
function mathReducer(state = 0, action) {
    switch(action.type) {
        case "ADD":
            return state + action.data;
        case "SUBTRACT":
            return state - action.data;
        default:
            return state;
    }
}

const store = createStore(
  pipeline(
    blockSubtract, 
    mathReducer
  )
);

store.dispatch({
   type: 'ADD',
   data: 10
});

// This gets blocked
store.dispatch({
   type: 'SUBTRACT',
   data: 5
});

// State is: 10
```

Order matters! If you put an interrupting reducer last, it won't change anything about the final output.

## API

### pipeline

```js
import pipeline from 'redux-pipeline';
pipeline([steps ...]);
```

#### Defaults

```js
pipeline([<Object>...]); // identical to (state = <Object>) => state
```

Adding that root reducer just for a default seemed kind of excessive, so if you pass in an object that doesn't match a config signature, we'll use it as a default.

```js
import pipeline from 'redux-pipeline';

function reducer1(state = 0, action) {
    // ...
}

function reducer2(state = 0, action) {
    // ...
}

export default createStore(
  pipeline(
    {foo: 'bar'},
    ['paramOne', reducer1], 
    [state => state.paramTwo, (result, state) => ({...state, paramTwo: result}), reducer: reducer2]
  )
);
// State is: {paramOne<Number>, paramTwo<Number>, foo: 'bar'}
```

### debugPipeline

```js
import {debugPipeline} from 'redux-pipeline';
pipeline([steps ...]);
```

Same as the default pipeline function, just with a lot of console noise.

## Credits

Redux Pipeline is free software under the MIT license. It was created in sunny Santa Monica by [Matthew Drake][].

[Redux]: https://github.com/reactjs/redux
[Matthew Drake]: http://www.mediadrake.com
[Reducify]: http://reducify.mediadrake.com
