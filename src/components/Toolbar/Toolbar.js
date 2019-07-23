import './Toolbar.css'
import {ButtonIcon} from '@holusion/react-components-holusion'
import PropTypes from 'prop-types'
import React from 'react';

export default class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectionLength: 0
        }
    }

    static setLength(length) {
        this.setState(() => ({selectionLength: length}))
    }

    render() {
        let tools = [];
        if(this.state.selectionLength >= 1) {
            tools.push(<ButtonIcon name="delete" title="Supprimer un média" />);
        }
        if(this.state.selectionLength == 1) {
            tools.push(<ButtonIcon name="play" title="Lancer un média" />);
        }

        return (
            <div className="toolbar-container">
                {tools}
                <ButtonIcon name="filter" title="Filtrer les médias" />
            </div>
        )
    }
}