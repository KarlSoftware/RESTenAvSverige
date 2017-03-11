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
    let options = [];
    $.ajax({
      url: "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden",
      dataType: "json",
      cache: false,
      async: false,
      success: function (data) {
        const values = _.map(data.soklista.sokdata, (value) => {
          return { value: value.id, label: value.namn };
        });
        options = values;
      },
      error: function (xhr, status, err) {
        console.error(status, err.toString());
      },
    });

    this.state = {
      options: options,
      value: [],
    };
  }
  handleSelectChange = (value) => {
    console.log(value);
    this.setState({ value });
  }
  handleSend = () => {
    $.ajax({
      url: "/api",
      data: { yrkesgrupper: JSON.stringify(this.state.value) },
      dataType: "json",
      type: "POST",
      cache: false,
      async: false,
      success: function (data) {
        console.log(data);
      },
      error: function (xhr, status, err) {
        console.error(status, err.toString());
      },
    });
  }

  render() {
    const x = 7;
    return (
      <div>
        <Select
          ref="stateSelect" multi autofocus simpleValue name="selected-state"
          searchable
          options={this.state.options}
          value={this.state.value}
          onChange={this.handleSelectChange}
        />
        <div className={styles.searchButton} >
          <button className="pure-button" onClick={this.handleSend} >
            Sök
          </button>
        </div>
      </div>
    );
  }
}
