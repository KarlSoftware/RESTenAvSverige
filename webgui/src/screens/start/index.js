import React, { Component } from 'react';

import Map from '../../components/map';
import Search from '../../components/searchBox';
import Information from '../../components/information';
import countyInformation from '../../components/map/countyInformation';

import styles from './style.scss';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  setResult = (result) => {
    this.setState({ result });
  }
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.navbar_buffer} />
        <div className={styles.flex} >
          <div style={{ width: '66%' }}>
            <Map result={this.state.result} />
          </div>
          <div style={{ width: '33%' }}>
            <Search setResult={this.setResult} />
            <div className={styles.information}>
              <Information name={countyInformation['stockholm'].name} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
