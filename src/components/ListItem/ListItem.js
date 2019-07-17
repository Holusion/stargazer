'use strict'
import "./ListItem.css"
import PropTypes from 'prop-types'
import React from 'react'

export default class ListItem extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <li className={`list-item ${this.props.selected ? "selected" : ""}`} onClick={this.props.onClick}>
                {this.props.children}
            </li>
        )
    }
}

ListItem.propTypes = {
    children: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    key: PropTypes.string
}