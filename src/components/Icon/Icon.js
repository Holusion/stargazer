'use strict';
import PropTypes from 'prop-types'
import React from "react";

export default class Icon extends React.Component {

  static getNode(n, v) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v){
      n.setAttributeNS(null, p, v[p]);
    }
    return n;
  }

  static makeIcon(name){
    if (!name){
      name = "default";
    }
  }

  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={this.props.width ? this.props.width : "24"} height={this.props.height ? this.props.height : "24"} viewBox="0 0 24 24" fill="currentColor">
        <use xmlns="http://www.w3.org/1999/xlink" href={`static/icons/combined.svg#icon-${this.props.name}`} />
      </svg>
    )
  }
}

Icon.propTypes = {
  name: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
}