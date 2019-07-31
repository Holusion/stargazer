import './Product.css'
import {Playlist, SocketProvider} from '@holusion/react-components-holusion';
import React, {useEffect, useState} from 'react'
import {dispatchError, dispatchTask, endTask} from '../../store'
import BadProductIPFound from '../../errors/BadProductIPFound'
import FilterPanel from '../../components/FilterPanel';
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

function handleFilterBy(filter, elem) {
    if(filter.length === 0) {
        return true;
    } else {
        return filter.filter(item => {
            switch(item) {
                case "active":
                    return elem.active === true;
                case "desactive":
                    return elem.active === false;
                default:
                    return true;
            }
        }).length > 0;
    }
}

export default function Product(props) {
    const [url, setUrl] = useState("");
    const [filter, setFilter] = useState([]);

    useEffect(() => initProduct(props.product, setUrl), [props.product]);
    useEffect(() => props.onUrlFound(url), [url]);
    
    const playlist = url ? <SocketProvider url={`http://${url}/playlist`}>
                                <Playlist url={url} onTaskStart={dispatchTask} onTaskEnd={endTask} onSelectionChange={props.onSelectionChange} filterBy={(elem) => handleFilterBy(filter, elem)} />
                            </SocketProvider> 
                        : null;

    return (
        <div className="product">
            <FilterPanel visible={props.filterOpen} onFilterChange={(elem) => setFilter(elem)} />
            {playlist}
        </div>
    )
}

Product.propTypes = {
    product: PropTypes.object,
    filterOpen: PropTypes.bool,
    onSelectionChange: PropTypes.func,
    onUrlFound: PropTypes.func,
}