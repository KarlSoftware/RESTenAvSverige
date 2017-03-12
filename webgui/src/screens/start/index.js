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
      name: 1,
      result: {},
    };
  }
  componentDidMount = () => {
    $.ajax({
      url: API.geografi,
      dataType: 'json',
      success: function (data) {
        this.setState({
          geografi: data,
          lanskoder: _.invert(_.mapObject(data, value => (value.lansnamn_short))),
          lansnamn: _.mapObject(data, value => (value.lansnamn_short)),
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

    this.setState({ result });
  }
  clearResult = () => {
    this.setState({ result: null });
  }
  setLan = (id) => {
    this.setState({ focus: id });
  }
  clearLan = () => {
    this.setState({ focus: null });
  }
  render() {
    let parts = counties;
    let viewBox = null;
    if (this.state.geografi && this.state.focus){
      const val = _.map(this.state.geografi[this.state.focus].kommuner, (value) => (value.kommunkod));
      parts = _.pick(komuner, (value, key) => {
        return _.contains(val, key);
      });
      viewBox = countyInformation[this.state.focus].viewBox;
    }
    return (
      <div className={styles.main}>
        <div className={styles.navbar_buffer} />
        <div className={styles.flex} >
          <div style={{ width:"66%" }}>
            <Map result={this.state.focus ? this.state.result[this.state.focus] && this.state.result[this.state.focus].kommuner : this.state.result} parts={parts} viewBox={viewBox} onHover={this.onHover} setLan={this.setLan} clearLan={this.clearLan} />
          </div>
          <div style={{ width: '33%' }}>
            <Search setResult={this.setResult} clearResult={this.clearResult} />
            <div className={styles.information}>
              <Information name={countyInformation[this.state.name] && countyInformation[this.state.name].name} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
