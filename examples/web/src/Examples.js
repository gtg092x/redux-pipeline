import React from 'react';
import { createHistory } from 'history';

import classNames from 'classnames';
import './styles/main.less';

const history = createHistory();

export default class Examples extends React.Component {
  constructor(props) {
    super(props);

    this.handleHistoryChange = this.handleHistoryChange.bind(this);

    this.state = {
      selected: Object.keys(props.containers)[0],
    };
  }

  componentDidMount() {
    this.unlistenHistory = history.listen(this.handleHistoryChange);
  }

  componentWillUnmount() {
    this.unlistenHistory();
  }

  handleHistoryChange({ hash }) {
    const fullPath = hash.replace('#', '');
    const pth = fullPath.split('-');
    if (pth && pth[0]) {
      this.setState({
        selected: pth[pth.length - 1],
      },() => window.scrollTo(0, 0));
    }
  }

  renderNavBarExamples() {
    const { selected } = this.state;
    const { containers } = this.props;

    return (
      <div className="nav navbar-nav">
        {
          Object.keys(containers).map(exampleName => {
            return (
              <a href={`#${exampleName}`} key={ exampleName }
                className={ classNames(selected === exampleName ? 'selected' : '', 'nav-item nav-link') }
              >
                { containers[exampleName].title }
              </a>
            );
          })
        }
      </div>
    );
  }

  render() {
    const { selected } = this.state;
    const { containers } = this.props;
    const { component, title, description, props = {}, codeSegments = []} = containers[selected];
    return (

      <div className="app">
        <nav className="navbar navbar-dark bg-inverse">
          <div className="navbar-wrapper container">
            { this.renderNavBarExamples() }
          </div>
        </nav>
        <div className="layout container">
          <div className="examples">
            <h2> { title } </h2>
            <p className="page-description">{description}</p>
            <div className="example">
              <div className="card example-container">
                <div className="card-block">
                  {component}
                </div>
              </div>
              {codeSegments.map(({sample, title}) => (
                <div className="row">
                  <div className="example-code col-xs-12">
                    <h3>{title}</h3>
                  <pre>
                    <code className="language-jsx code">
                      {sample}
                    </code>
                  </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }
}
