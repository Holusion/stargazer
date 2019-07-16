import "./Button.css"
import PropTypes from 'prop-types';
import React from 'react';

export default class Button extends React.Component {

    render() {
        return (
            <div className="button">
                {this.props.children}
            </div>
        )
    }
}

Button.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
}