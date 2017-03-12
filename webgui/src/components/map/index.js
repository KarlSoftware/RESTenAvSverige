import React, { PropTypes } from 'react';
import countyInformation from './countyInformation';
import _ from 'underscore';
import County from './county';

import styles from './style.scss';

export default class Map extends React.Component {
  static propTypes = {
    result: PropTypes.object,
    parts: PropTypes.array.isRequired,
    setLan: PropTypes.func.isRequired,
    clearLan: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      name: 'stockholm',
    };
  }

  onHover = value => this.setState({ name: value });

  render() {
    const self = this;
    return (
      <div className={styles.main}>
        <button onClick={this.props.clearLan}> Återgå till sverige </button>
        <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox={this.props.viewBox || "-8449.69 -8449.69 692875 1.57668e+006"} >
          <g transform="translate(0,1.55978e+006) scale(1, -1)">
            { _.map(this.props.parts, (value, key) => 
              <County 
                key={key} value={value}
                status={self.props.result ? (self.props.result[key] && self.props.result[key].goodness*100) : 1} 
                onMouseOver={() => this.props.onHover(key)}
                onClick={() => this.props.setLan(key)}
              />)
            }
          </g>
        </svg>
      </div>
    );
  }
}
