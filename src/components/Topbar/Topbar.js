import './Topbar.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Topbar extends React.Component {
    render() {
        return (
            <div className="topbar">
                <div className="start">
                    {this.props.start}
                </div>
                <span className="title">{this.props.title}</span>
                <div className="end">
                    {this.props.end}
                </div>
            </div>
        )
    }
}

Topbar.propTypes = {
    title: PropTypes.string,
    start: PropTypes.element,
    end: PropTypes.element
}