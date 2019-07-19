import './Fab.css'
import Icon from '../Icon';
import PropTypes from 'prop-types'
import React from 'react'

export default class Fab extends React.Component {

    render() {
        return (
            <div className="fab-container" onClick={this.props.onClick} title={this.props.title}>
                <Icon name={this.props.icon} />
            </div>
        )
    }
}

Fab.propTypes = {
    onClick: PropTypes.func,
    icon: PropTypes.string,
    title: PropTypes.string
}