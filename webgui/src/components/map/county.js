import React from 'react';
import { PropTypes } from 'react';

import styles from './style.scss';

export default class County extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    status: PropTypes.string,
    onMouseOver: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  statusStyle = {
    1: styles.county1,
    2: styles.county2,
  }

  render() {
    return (
      <path 
        className={styles.county}
        d={this.props.value}
        style={{ fillOpacity: this.props.status }}
        onMouseOver={this.props.onMouseOver}
        onClick={this.props.onClick}
      />
    );
  }
}


