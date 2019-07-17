import './Product.css'
import PlaylistItem from '../../components/PlaylistItem'
import PropTypes from 'prop-types'
import React from 'react'

export default class Product extends React.Component {

    render() {
        return (
            <div><PlaylistItem item={{title: "Test"}}/></div>
        )
    }
}

Product.propTypes = {
    product: PropTypes.object
}