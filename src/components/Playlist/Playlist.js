import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React from 'react'

export default class Playlist extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const cards = this.props.items.map(item => {
            let imgUrl = `http://${this.props.url}/medias/${item.name}?thumb=true`;
            imgUrl = encodeURI(imgUrl.trim())
            return <PlaylistItem key={item.name} item={item} image={imgUrl} />
        })

        return (
            <div className="playlist-container">
                {cards}
            </div>
        )
    }
}

Playlist.propTypes = {
    url: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object)
}