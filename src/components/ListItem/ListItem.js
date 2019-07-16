'use strict'
import "./ListItem.css"
import PropTypes from 'prop-types'
import React from 'react'

export default class ListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: false,
        }
    }

    select() {
        this.setState(() => ({selected: true}));
    }

    unselect() {
        this.setState(() => ({selected: false}));
    }

    handleClick() {
        this.select();
        // this.props.onClick();
    }
    
    render() {
        return (
            <li className={`list-item ${this.state.selected ? "selected" : ""}`} onClick={this.handleClick.bind(this)}>
                {this.props.children}
            </li>
        )
    }
}

ListItem.propTypes = {
    children: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool
}