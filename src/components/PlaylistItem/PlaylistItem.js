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
                    <Checkbox onChange={this.props.onCheckboxChange} />
                </div>
                <div className="playlist-item-top-middle">
                    <Switch checked={this.props.item.active} onChange={this.props.onSwitchChange}/>
                </div>
                <div className="playlist-item-top-right">
                    <button className="playlist-item-remove">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        )
    }

    createPrimary() {
        const display = this.props.current ? <Icon name="play" width="100" height="100"/> : null;

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
                    {this.props.item.name}
                </div>
                <div className="playlist-item-main-action">
                    <ButtonIcon name="play" />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={`playlist-item ${this.props.selected ? "selected" : ""}`} onClick={this.props.onClick}>
                <Card top={this.createTop()} primary={this.createPrimary()} bottom={this.createBottom()} image={this.props.image} />
            </div>
        )
    }
}

PlaylistItem.propTypes = {
    item: PropTypes.object,
    onSwitchChange: PropTypes.func,
    onCheckboxChange: PropTypes.func,
    onClick: PropTypes.func,
    image: PropTypes.string,
    current: PropTypes.bool,
    selected: PropTypes.bool
}