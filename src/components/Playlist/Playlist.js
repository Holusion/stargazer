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
            let imgUrl = item.image;
            imgUrl = encodeURI(imgUrl.trim())
            return <PlaylistItem 
                        key={item.name} 
                        item={item} 
                        image={imgUrl} 
                    />
        })

        return (
            <div className="playlist-container">
                {cards}
            </div>
        )
    }
}

/**
 * the shape of an item is :
 * {
 *   "name": string,
 *   "rank": int,
 *   "active": bool,
 *   "_id": string,
 *   "onCheckboxChange": func(item, event),
 *   "onSwitchChange": func(item, event),
 *   "onClick": func(item, event),
 *   "onPlay": func(item, event),
 *   "onRemove": func(item, event),
 *   "current": bool,
 *   "selected": bool,
 *   "image": string
 * },
 */
Playlist.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object), 
}