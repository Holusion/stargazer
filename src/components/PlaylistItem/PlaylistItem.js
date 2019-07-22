import './PlaylistItem.css'
import ButtonIcon from '../ButtonIcon'
import Card from '../Card';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import PropTypes from 'prop-types'
import React from 'react'
import Switch from '../Switch';

export default class PlaylistItem extends React.Component {

    createTop() {
        return (
            <div className="playlist-item-top">
                <div className="playlist-item-top-left">
                    <Checkbox onChange={this.props.item.onCheckboxChange} />
                </div>
                <div className="playlist-item-top-middle">
                    <Switch checked={this.props.item.active} onChange={this.props.item.onSwitchChange}/>
                </div>
                <div className="playlist-item-top-right">
                    <button className="playlist-item-remove" onClick={this.props.item.onRemove}>
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        )
    }

    createPrimary() {
        const display = this.props.item.current ? <Icon name="play" width="100" height="100"/> : null;

        return (
            <div className="playlist-item-current">
                {display}
            </div>
        )
    }

    createBottom() {
        return (
            <div className="playlist-item-bottom">
                <div className="playlist-item-title">
                    <span>{this.props.item.name}</span>
                </div>
                <div className="playlist-item-main-action">
                    <ButtonIcon name="play" onClick={this.props.item.onPlay} />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={`playlist-item ${this.props.item.selected ? "selected" : ""} ${this.props.item.active ? "active" : ""} ${this.props.item.visible ? "visible" : ""}`} onClick={this.props.item.onClick} title={this.props.item.name}>
                <Card top={this.createTop()} primary={this.createPrimary()} bottom={this.createBottom()} image={this.props.image} />
            </div>
        )
    }
}

PlaylistItem.propTypes = {
    item: PropTypes.object,
    image: PropTypes.string,
}