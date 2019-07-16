'use strict'
import "./List.css"
import ListItem from '../ListItem'
import PropTypes from 'prop-types'
import React from 'react'

export default class List extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: -1
        }
    }

    handleClick(e, index) {
        e.preventDefault();
        if(this) {
            this.setState(() => ({selectedIndex: index}));
            if(this.props.onClick) this.props.onClick()
        }
    }

    render() {
        const listItem = this.props.items.map((e, i) => (
                <li key={i} className={`list-item ${this.state.selectedIndex === i ? "selected" : ""}`} onClick={(e) => this.handleClick(e, i)}>
                    {e}
                </li>
            )
        )

        return (
            <ul className="list" onClick={this.handleClick}>
                {listItem}
            </ul>
        )
    }
}

List.propTypes = {
    items: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.instanceOf(ListItem)), PropTypes.arrayOf(PropTypes.instanceOf(ListItem))]),
    onClick: PropTypes.func
}