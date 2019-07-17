'use strict'
import "./List.css"
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
        }
    }

    render() {
        const listItem = React.Children.toArray(this.props.children);
        // Children is immutable so we have to clone children to handle selected items
        const mapList = listItem.map((child, i) => {
            return React.cloneElement(child, {selected: i == this.state.selectedIndex, onClick: (ev) => {
                this.handleClick(ev, i);
                if(child.props.onClick) child.props.onClick();
            }})
        })

        return (
            <ul className="list">
                {mapList}
            </ul>
        )
    }
}

List.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    onClick: PropTypes.func
}