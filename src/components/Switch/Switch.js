import './Switch.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Switch extends React.Component {

    render() {
        return (
            <div className="switch-container">
                <input type="checkbox" className="switch" title={this.props.title} id="switch" />
                <label htmlFor="switch" />
            </div>
        )
    }
}

Switch.propTypes = {
    title: PropTypes.string
}