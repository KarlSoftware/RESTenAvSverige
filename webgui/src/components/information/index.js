import React from 'react';
import { PropTypes } from 'react';

import styles from './style.scss';

export default class Information extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <div className={styles.informationText}>
          {this.props.text}
        </div>
      </div>
    );
  }
}
