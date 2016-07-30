Redux Pipeline
================

Merge [Redux][] reducers together to make one composite reducer.

<http://code.mediadrake.com/redux-pipeline>

## Installation

    % npm install redux-pipeline

## Usage

### Redux pipeline combines reducers together to make composite reducers dead simple  

Tired of massive, unwieldly switch statements? Wish you could break up reducers into re-usable and configurable parts?

> Yes, this problem is literally ruining my life.

We thought so. With redux-pipeline you can chain reducers together and get back to worrying about application logic instead of how tired you are from javascript fatigue.

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

## Advanced Features

> That's boring, can't this thing do anything that's cool?

It can! Let's check out some more advanced stuff.

### Namespacing

You might want to apply a reducer to a single state key. Well that's easy as pie.

### Defaults

If you're heavy into namespacing, defaults are a pain - just pass it in instead of a reducer.

### Nesting

Because we're just making reducers, you're free to do this!


### Configurable Reducers

Not something you absolutely need this package for, but it makes this pattern a whole lot easier.

### Interrupt

You might want to stop the flow of the reducer chain. This is especially true if you create a generic configurable reducer but want to surpress some actions. There's actually a way to do this.

```js
import pipeline from 'redux-pipeline';

function reducer1(state = 0, action, end) {
    // ...
}

function reducer2(state = 0, action) {
    // ...
}

export default createStore(
  pipeline(reducer1, reducer2)
);
// State is: Number
```

## API

### pipeline

```js
import pipeline from 'redux-pipeline';
pipeline([steps ...]);
```

There's only one function, but it's got a few different ways to send args in. Let's look at them all.

#### Functions

```js
pipeline([<Function>...]);
```

```js
import pipeline from 'redux-pipeline';

function reducer1(state = 0, action) {
    // ...
}

function reducer2(state = 0, action) {
    // ...
}

export default createStore(
  pipeline(reducer1, reducer2)
);
// State is: Number
```

Just take any regular old reducer and pass it in. You can do one reducer or you can do 100.

#### Object Configs

```js
pipeline([{select<string>, reducer<Function>}...]);
// or
pipeline([{select<Function>, merge<Function>, reducer<Function>}...]);
// don't be afraid to mix them together either
pipeline({select<Function>, merge<Function>, reducer<Function>}, {select<string>, reducer<Function>}, <Function>);
```

```js
import pipeline from 'redux-pipeline';

function rootReducer(state = {}, action) {
    return state;
}

function reducer1(state = 0, action) {
    // ...
}

function reducer2(state = 0, action) {
    // ...
}

export default createStore(
  pipeline(
    rootReducer,
    {select: 'paramOne' ,reducer: reducer1}, 
    {select: state => state.paramTwo, merge: (result, state) => ({...state, paramTwo: result}), reducer: reducer2}
  )
);
// State is: {paramOne<Number>, paramTwo<Number>}
```

If your reducer is changing keys on an object, make sure you have a root reducer or a default value! Look at the `select` example above if this seems crazy.

#### Arrays

```js
pipeline([[<string>, <Function>]...]); // identical to {select<string>, reducer<Function>}
// or
pipeline([[<Function>, <Function>, <Function>]...]); // identical to {select<Function>, merge<Function>, reducer<Function>}
// you can mix these together too
```

```js
import pipeline from 'redux-pipeline';

function rootReducer(state = {}, action) {
    return state;
}

function reducer1(state = 0, action) {
    // ...
}

function reducer2(state = 0, action) {
    // ...
}

export default createStore(
  pipeline(
    rootReducer,
    ['paramOne', reducer1], 
    [state => state.paramTwo, (result, state) => ({...state, paramTwo: result}), reducer: reducer2]
  )
);
// State is: {paramOne<Number>, paramTwo<Number>}
```

This really just maps the array to the configs above. It gets pretty useful if you're nesting reducers.

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

Of course, if you decide to have a reducer with default values that include a string named `select` and a function named `reducer`, this obviously won't work. But let's be honest, that sounds like a silly thing to do. 

If you find yourself in that situation, just use a root reducer that sets those defaults instead - more boilerplate for you.

## Native

### This works with React Native too

Nothing special - use it like any other redux package. Check the examples if you don't believe me.

## Credits

Redux Pipeline is free software under the MIT license. It was created in sunny Santa Monica by [Matthew Drake][].

[Redux]: https://github.com/reactjs/redux
[Matthew Drake]: http://www.mediadrake.com
