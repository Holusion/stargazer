import './Checkbox.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Checkbox extends React.Component {

    render() {
        return (
            <div className="checkbox-container">
                <input type="checkbox" className="checkbox" title={this.props.title} id="checkbox" />
                <label htmlFor="checkbox" />
            </div>
        )
    }
}

Checkbox.propTypes = {
    title: PropTypes.string
}