import React from 'react';
import counties from './counties';
import countyInformation from './countyInformation';
import _ from 'underscore';
import County from './county';
import Information from './information';

import styles from './style.scss';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'stockholm',
    };
  }

  onHover = value => this.setState({ name: value });

  render() {
    return (
      <div className={styles.main}>
        <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="-8449.69 -8449.69 692875 1.57668e+006">
          <g transform="translate(0,1.55978e+006) scale(1, -1)">
            { _.map(counties, (value, key) => <County key={key} status={countyInformation[key].status} value={value} onMouseOver={() => this.onHover(key)} />) }
          </g>
        </svg>
        <div className={styles.information}>
          <Information name={countyInformation[this.state.name].name} />
        </div>
      </div>
    );
  }
}
