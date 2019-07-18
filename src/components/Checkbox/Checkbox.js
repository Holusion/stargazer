import './Checkbox.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Checkbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "checkbox"
        }
    }

    componentDidMount() {
        this.setState(() => ({id: '_' + Math.random().toString(36).substr(2, 9)}));
    }

    render() {

        return (
            <div className="checkbox-container">
                <input type="checkbox" className="checkbox" title={this.props.title} id={this.state.id} defaultChecked={false} onChange={this.props.onChange}/>
                <label htmlFor={this.state.id} />
            </div>
        )
    }
}

Checkbox.propTypes = {
    title: PropTypes.string,
    onChange: PropTypes.func
}