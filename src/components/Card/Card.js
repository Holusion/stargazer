import './Card.css'
import PropTypes from 'prop-types'
import React from 'react'

export default class Card extends React.Component {

    render() {
        return (
            <div className="card" style={{backgroundImage: `url(${this.props.image})`}}>
                <div className="card-top">
                    {this.props.top}
                </div>
                <div className="card-primary">
                    {this.props.primary}
                </div>
                <div className="card-bottom">
                    {this.props.bottom}
                </div>
            </div>
        )
    }
}

Card.propTypes = {
    top: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    primary: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    bottom: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    image: PropTypes.string
}