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
    if (!this.state.focus) {
      this.setState({ focus: id });
    }
  }
  clearLan = () => {
    this.setState({ focus: null });
  }
  render() {
    let parts = counties;
    let viewBox = null;
    if (this.state.geografi && this.state.focus) {
      const val = _.map(this.state.geografi[this.state.focus].kommuner, (value) => (value.kommunkod));
      parts = _.pick(komuner, (value, key) => {
        return _.contains(val, key);
      });
      viewBox = countyInformation[this.state.focus].viewBox;
    }
    let text = null;
    let title = null;
    if (this.state.geografi) {
      let tmp = null;
      if (this.state.focus) {
        tmp = _.object(_.map(this.state.geografi[this.state.focus].kommuner, function (item) {
          return [item.kommunkod, item];
        }));
        tmp = tmp[this.state.name];
        title = tmp && tmp.kommunnamn;
      } else {
        tmp = this.state.geografi[this.state.name];
        title = tmp && tmp.lansnamn;
      }
      console.log(tmp);
      text = <span>
        <p> <b>Befolkning: </b> {tmp && tmp.befolkning} </p>
        <p> <b>Nöjd-medborgare Index: </b> {tmp && Math.round(tmp.nmi_delta * 100) / 100} </p>
        <p> <b>Skattesats: </b> {tmp && Math.round(tmp.skattesats * 100) / 100}% </p>
        <p> <b>Snittkostnad per kvadratmeter: </b> {tmp && Math.round(tmp.avg_sqm_cost)}sek </p>
      </span>
    }
    return (
      <div className={styles.main}>
        <div className={styles.navbar_buffer} />
        <div className={styles.flex} >
          <div style={{ width: "66%" }}>
            <Map result={this.state.focus ? this.state.result[this.state.focus] && this.state.result[this.state.focus].kommuner : this.state.result} parts={parts} viewBox={viewBox} onHover={this.onHover} setLan={this.setLan} clearLan={this.clearLan} />
          </div>
          <div style={{ width: '33%' }}>
            <div className={styles.information}>
              <Information
                name={title || (countyInformation[this.state.name] && countyInformation[this.state.name].name)}
                text={text}
              />
            </div>
            <div className={styles.searchbox} >
            <Search setResult={this.setResult} clearResult={this.clearResult} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          Med data från <a href="https://www.arbetsformedlingen.se/" target="_blank">Arbetsförmedlingen</a><span>, </span>
          <a href="https://www.lantmateriet.se/" target="_blank"> Lantmäteriet</a><span>, </span>
          <a href="https://www.kolada.se/?_p=index" target="_blank">Kolada</a><span> och </span>
          <a href="https://www.booli.se/" target="_blank">Booli</a><span>. </span>
          Skapat av RESTenAvSverige: Veronica, Petter, Calle och Hilding
        </div>
      </div>
    );
  }
}
