import "./ButtonIcon.css";
import Icon from "../Icon";
import PropTypes from 'prop-types'
import React from 'react';

export default class ButtonIcon extends React.Component {

    render() {
        return (
            <a className="button-icon" onClick={this.props.onClick} title={this.props.title}>
                <Icon name={this.props.name}/>
            </a>
        )
    }
}

ButtonIcon.propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func
}