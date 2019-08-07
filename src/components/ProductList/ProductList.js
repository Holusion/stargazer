import {Button, List, ListItem} from '@holusion/react-components-holusion'
import BadProductIPFound from '../../errors/BadProductIPFound'
import PropTypes from 'prop-types'
import React from 'react'
import net from "net";

function setUrl(product, props) {
    let addr = null;
    if(process.platform === "win32") {
        for(let a of product.addresses) {
            if(net.isIP(a) == 4) {
                addr = a;
            }
        }

        // Fetch can't parse ipv6 addresses
        switch (net.isIP(addr)) {
            case 6:
                addr = `[${addr}]:3000`;
                break;
            case 0:
                throw new BadProductIPFound(product.name, addr);
            default:
        }
    } else {
        addr = `${product.name}.local`;
    }

    if(addr) {
        props.onProductSelected(addr);
    }
}

export default function ProductList(props) {
    const items = props.list.map(msg => <ListItem key={msg.name} icon="library" onClick={() => setUrl(msg, props)}>{msg.name}</ListItem>)

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
    onProductSelected: PropTypes.func,
    onButtonClick: PropTypes.func,
    list: PropTypes.arrayOf(PropTypes.object),
    hide: PropTypes.bool,
}