import './Switch.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Switch extends React.Component {

    render() {
        const id = '_' + Math.random().toString(36).substr(2, 9);

        return (
            <div className="switch-container">
                <input type="checkbox" className="switch" title={this.props.title} id={id} defaultChecked={this.props.checked} onChange={this.props.onChange} />
                <label htmlFor={id} />
            </div>
        )
    }
}

Switch.propTypes = {
    title: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
}