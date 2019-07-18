import "./Playlist.css"
import PlaylistItem from "../PlaylistItem";
import PropTypes from 'prop-types'
import React from 'react'

export default class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: []
        }
    }

    handleSelection(item, event) {
        event.target.checked 
            ? this.setState((prevState) => ({selected: [...prevState.selected, item]})) 
            : this.setState(() => ({selected: this.state.selected.filter(elem => elem.name !== item.name)}))
    }

    render() {
        const cards = this.props.items.map(item => {
            let imgUrl = `http://${this.props.url}/medias/${item.name}?thumb=true`;
            imgUrl = encodeURI(imgUrl.trim())
            return <PlaylistItem 
                        key={item.name} 
                        item={item} 
                        image={imgUrl} 
                        selected={this.state.selected.filter(elem => elem.name === item.name).length > 0} 
                        onCheckboxChange={this.handleSelection.bind(this, item)} 
                    />
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