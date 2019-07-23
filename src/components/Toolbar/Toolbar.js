import './Toolbar.css'
import {ButtonIcon} from '@holusion/react-components-holusion'
import PropTypes from 'prop-types'
import React from 'react';

export default function Toolbar(props) {
    let tools = [];
    if(props.selectionLength >= 1) {
        tools.push(<ButtonIcon key="toolbar-remove" name="remove" title="Supprimer un média" />);
    }
    if(props.selectionLength == 1) {
        tools.push(<ButtonIcon key="toolbar-play" name="play" title="Lancer un média" />);
    }

    return (
        <div className="toolbar-container">
            {tools}
            <ButtonIcon name="filter" title="Filtrer les médias" />
        </div>
    )
}

Toolbar.propTypes = {
    selectionLength: PropTypes.number
}