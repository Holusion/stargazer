import './Toolbar.css'
import {ButtonIcon} from '@holusion/react-components-holusion'
import PropTypes from 'prop-types'
import React from 'react';
import url from 'url';

function play(props, item) {
    props.onTaskStart(`play-${item.name}`)
    let options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/control/current/${item.name}`), options).then(res => {    
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            props.onTaskEnd(`play-${item.name}`, err);
        } else {
            props.onTaskEnd(`play-${item.name}`);
        }
    }).catch(err => {
        props.onTaskEnd(`play-${item.name}`, err)
    })
}

function remove(props, item) {
    props.onTaskStart(`remove-${item.name}`);
    let options = {
        method: 'DELETE',
        body: null,
        headers: {
            'Content-Type': 'application/json'
        },
    }
    fetch(url.resolve(`http://${props.url}`, `/medias/${item.name}`), options).then(res => {    
        if(!res.ok) {
            const err = new Error(`${res.status} - ${res.statusText}`);
            props.onTaskEnd(`remove-${item.name}`, err);    
        } else {
            item.visible = false;
            props.onTaskEnd(`remove-${item.name}`);            
        }
    }).catch(err => {
        props.onTaskEnd(`remove-${item.name}`, err);   
    })
}

function removeAll(props, items) {
    for(const item of items) {
        remove(props, item);
    }
}

export default function Toolbar(props) {
    let tools = [];
    if(props.selection.length >= 1) {
        tools.push(<ButtonIcon key="toolbar-remove" name="remove" title="Supprimer un média" onClick={() => removeAll(props, props.selection)} />);
    }
    if(props.selection.length == 1) {
        tools.push(<ButtonIcon key="toolbar-play" name="play" title="Lancer un média" onClick={() => play(props, props.selection[0])} />);
    }

    return (
        <div className="toolbar-container">
            {tools}
            <ButtonIcon name="filter" title="Filtrer les médias" onClick={props.onFilterClick} />
        </div>
    )
}

Toolbar.propTypes = {
    url: PropTypes.string,
    selection: PropTypes.arrayOf(PropTypes.object),
    onTaskStart: PropTypes.func,
    onTaskEnd: PropTypes.func,
    onFilterClick: PropTypes.func,
}