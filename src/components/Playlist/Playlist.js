import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React from 'react'

export default class Playlist extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const cards = this.props.items.map(item => <PlaylistItem key={item.name} item={item} image="static/img/16-9.jpg" />)

        return (
            <div className="playlist-container">
                {cards}
            </div>
        )
    }
}

Playlist.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object)
}