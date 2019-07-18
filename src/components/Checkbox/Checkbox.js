import './Checkbox.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Checkbox extends React.Component {

    render() {
        const id = '_' + Math.random().toString(36).substr(2, 9);

        return (
            <div className="checkbox-container">
                <input type="checkbox" className="checkbox" title={this.props.title} id={id} defaultChecked={false}/>
                <label htmlFor={id} />
            </div>
        )
    }
}

Checkbox.propTypes = {
    title: PropTypes.string
}