import React, { Component } from 'react';

import Map from '../../components/map';

import styles from './style.scss';

export default class Start extends Component {
  render() {
    return (
      <div className={styles.main}>
        <Map />
      </div>
    );
  }
}
