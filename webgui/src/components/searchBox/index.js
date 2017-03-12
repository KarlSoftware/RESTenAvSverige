// React Hot Reload does not support stateless function components as of now
/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from "react";
import $ from "jquery";
import _ from "underscore";
import Select from "react-select";
import "react-select/dist/react-select.css";

import styles from "./style.scss";
import { API } from "../../routes";

// import styles from './style.scss';

export default class App extends Component {
  static propTypes = {
//    children: PropTypes.node.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = { options: [], value: [] };
  }
  componentDidMount = () => {
    $.ajax({
      url: API.yrkesgrupper,
      dataType: 'json',
      success: function (data) {
        const values = _.map(data, (value) => (
          { value: value.yrkesgrupp_id.toString(), label: value.yrkesgrupp }
        ));
        this.setState({
          options: values,
        });
      }.bind(this),
      error(xhr, status, err) {
        console.error(status, err.toString());
      },
    });
  }
  handleSelectChange = (value) => {
    this.setState({ value });
  }
  handleSend = () => {
    const yrkesgrupper = _.map(this.state.value, value => value.value);
    $.ajax({
      url: API.search,
      data: JSON.stringify({ yrkesgrupper, narliggande: false }),
      dataType: 'json',
      contentType: 'application/json',
      type: 'POST',
      success: function(data) {
        console.log(data);
        if(!data.error){
          this.props.setResult(data);
        }
      }.bind(this),
      error(xhr, status, err) {
        console.error(status, err.toString());
      },
    });
  }

  render() {
    const x = 7;
    return (
      <div className={styles.box}>
        <Select
          ref="stateSelect" multi autofocus name="selected-state"
          searchable
          options={this.state.options}
          value={this.state.value}
          onChange={this.handleSelectChange}
        />
        <div className={styles.searchButton} >
          <button className={'pure-button ' + styles.button} onClick={this.handleSend} >
            Sök
          </button>
        </div>
      </div>
    );
  }
}
