import React, { Component } from 'react';
import $ from "jquery";
import _ from "underscore";
import Map from '../../components/map';
import counties from '../../components/map/counties';
import komuner from '../../components/map/komuner';
import Search from '../../components/searchBox';
import Information from '../../components/information';
import countyInformation from '../../components/map/countyInformation';

import { API } from '../../routes';

import styles from './style.scss';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'stockholm'
    };
  }
  componentDidMount = () => {
    $.ajax({
      url: API.geografi,
      dataType: 'json',
      success: function (data) {
        this.setState({
          geografi: data,
        });
      }.bind(this),
      error(xhr, status, err) {
        console.error(status, err.toString());
      },
    });
  }
  onHover = value => this.setState({ name: value });
  setResult = (result) => {
    const searchResult = _.object(_.map(result, (value, key) => {
      return [this.state.geografi[key].lansnamn_short, value];
    }));

    this.setState({ result: searchResult });
  }
  render() {
    return (
      <div className={styles.main}>
        <div className={styles.navbar_buffer} />
        <div className={styles.flex} >
          <div style={{ width:"66%" }}>
            <Map result={this.state.result} parts={counties} onHover={this.onHover} />
          </div>
          <div style={{ width: '33%' }}>
            <Search setResult={this.setResult} />
            <div className={styles.information}>
              <Information name={countyInformation[this.state.name].name} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
