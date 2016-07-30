import React from 'react';
import { connect, Provider } from 'react-redux'
import store from '../stores/simple';
import {stop, randomize, filter, add} from '../actions';

function SimpleContainer({onStop, onRandomize, onAdd, onFilter, simple = 15}) {



  return (
    <div>
      <h1>Simple</h1>
      <button onClick={onStop}>Stop</button>
      <button onClick={onAdd}>Add</button>
      <button onClick={onRandomize}>Random</button>
      <button onClick={onFilter}>Filter</button>
      <pre>
        {JSON.stringify({simple}, undefined, 4)}
      </pre>
    </div>
  );
}

function mapStateToProps(props) {
  return props;
}

function mapDispatchToProps(dispatch, props) {
  return {
    ...props,
    onStop: stop.bind(undefined, dispatch),
    onRandomize: randomize.bind(undefined, dispatch),
    onFilter: filter.bind(undefined, dispatch),
    onAdd: add.bind(undefined, dispatch)
  };
}

const SimpleContainerConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleContainer);

export default function (props) {
  return <Provider store={store}><SimpleContainerConnected {...props} /></Provider>
}
