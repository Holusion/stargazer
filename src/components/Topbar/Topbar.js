import './Topbar.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Topbar extends React.Component {
    render() {
        return (
            <div className="topbar">
                <span className="title">{this.props.title}</span>
            </div>
        )
    }
}

Topbar.propTypes = {
    title: PropTypes.string
}