'use strict'
import "./ListItem.css"
import Icon from "../Icon";
import PropTypes from 'prop-types'
import React from 'react'

export default class ListItem extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let icon = null;
        if(this.props.icon) icon = <div className="list-icon"><Icon name={this.props.icon} /></div>

        return (
            <li className={`list-item ${this.props.selected ? "selected" : ""}`} onClick={this.props.onClick}>
                {icon}
                <span className="list-content">{this.props.children}</span>
            </li>
        )
    }
}

ListItem.propTypes = {
    children: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    icon: PropTypes.string
}