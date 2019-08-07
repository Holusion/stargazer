import {Button, List, ListItem} from '@holusion/react-components-holusion'
import PropTypes from 'prop-types'
import React from 'react'

export default function ProductList(props) {
    const items = props.list.map(msg => <ListItem key={msg.name} icon="library" onClick={() => props.onListItemClick(msg)}>{msg.name}</ListItem>)

    return (
        <div className={`left-content ${props.hide ? "hide" : ""}`}>
            <div className="list-group">
                <Button onClick={props.onButtonClick}>Actualiser</Button>
                <List>
                    {items}
                </List>
            </div>
        </div>
    )
}

ProductList.propTypes = {
    onListItemClick: PropTypes.func,
    onButtonClick: PropTypes.func,
    list: PropTypes.arrayOf(PropTypes.object),
    hide: PropTypes.bool,
}