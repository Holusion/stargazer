import './Product.css'
import {Fab, Playlist, SocketProvider} from '@holusion/react-components-holusion';
import React, {useEffect, useState} from 'react'
import BadProductIPFound from '../../errors/BadProductIPFound'
import PropTypes from 'prop-types'
import {dispatchError} from '../../store'
import net from "net";
import uploader from '../../components/Upload';

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

    const FabUpload = uploader(Fab, url, {title: "Ajouter un média", icon: "upload"});
    const playlist = url ? <SocketProvider url={`http://${url}/playlist`}><Playlist url={url} /></SocketProvider> : null;

    return (
        <div className="product">
            {playlist}
            <FabUpload />
        </div>
    )
}

Product.propTypes = {
    product: PropTypes.object
}