import React from 'react';
import { PropTypes } from 'react';

import styles from './style.scss';

export default class Information extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>Lorem ipsum Lorem ipsumLorem ipsumLorem i
          psumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum   Lorem
          ipsumLorem ipsumLorem ipsum Lorem ipsumLorem ipsum
        </p>
      </div>
    );
  }
}
