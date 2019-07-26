import './Product.css'
import {Fab, Playlist, SocketProvider, uploader} from '@holusion/react-components-holusion';
import React, {useEffect, useState} from 'react'
import {dispatchError, dispatchTask, endTask} from '../../store'
import BadProductIPFound from '../../errors/BadProductIPFound'
import PropTypes from 'prop-types'
import net from "net";

function initProduct(product, setUrl) {
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
                dispatchError(new BadProductIPFound(product.name, addr));
                break;
            default:
        }
    } else {
        addr = `${product.name}.local`;
    }

    if(addr) {
        setUrl(addr);
    }
}

export default function Product(props) {
    const [url, setUrl] = useState("");

    useEffect(() => initProduct(props.product, setUrl), [props.product]);
    
    const FabUpload = uploader(Fab, {title: "Ajouter un média", icon: "upload"});
    const playlist = url ? <SocketProvider url={`http://${url}/playlist`}><Playlist url={url} onTaskStart={dispatchTask} onTaskEnd={endTask} /></SocketProvider> : null;

    return (
        <div className="product">
            {playlist}
            <FabUpload url={url} onTaskStart={dispatchTask} onTaskEnd={endTask} />
        </div>
    )
}

Product.propTypes = {
    product: PropTypes.object
}