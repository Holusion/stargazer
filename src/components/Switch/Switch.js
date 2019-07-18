import './Switch.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Switch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "switch"
        }
    }

    componentDidMount() {
        this.setState(() => ({id: '_' + Math.random().toString(36).substr(2, 9)}));
    }

    render() {
        return (
            <div className="switch-container">
                <input type="checkbox" className="switch" title={this.props.title} id={this.state.id} defaultChecked={this.props.checked} onChange={this.props.onChange} />
                <label htmlFor={this.state.id} />
            </div>
        )
    }
}

Switch.propTypes = {
    title: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
}