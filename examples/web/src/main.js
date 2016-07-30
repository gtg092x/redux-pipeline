import React from 'react';
import ReactDOM from 'react-dom';
import Examples from './Examples';
import getContainers from './containers';

class Loader extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {

  }
  render() {

    return <Examples containers={getContainers()} />;
  }
}

ReactDOM.render((
    <Loader />
), document.getElementById('root'));
