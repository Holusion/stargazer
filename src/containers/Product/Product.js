import './Product.css'
import {Playlist, SocketProvider, Tab, Tabbar} from '@holusion/react-components-holusion';
import React, {useEffect, useState} from 'react'
import {dispatchTask, endTask} from '../../store'
import FilterPanel from '../../components/FilterPanel';
import ProductInfo from '../../components/ProductInfo';
import PropTypes from 'prop-types'

import url from 'url'

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
    const [filter, setFilter] = useState([]);
    const [panel, setPanel] = useState(0);

    const playlist = <SocketProvider key="playlist" url={`http://${props.url}/playlist`}>
                        <Playlist url={props.url} onTaskStart={dispatchTask} onTaskEnd={endTask} onSelectionChange={props.onSelectionChange} filterBy={(elem) => handleFilterBy(filter, elem)} />
                    </SocketProvider>; 

    const productInfo = <ProductInfo url={props.url}/>;

    let panelComponent = [<FilterPanel key="filter-panel" visible={props.filterOpen} onFilterChange={(elem) => setFilter(elem)} />, playlist]

    if(panel === 1) {
        panelComponent = productInfo;
    }

    return (
        <div className="product">
            <div className="product-tab">
                <Tabbar>
                    <Tab text="Playlist" selected onClick={() => setPanel(0)} />
                    <Tab text="Info" onClick={() => setPanel(1)} />
                </Tabbar>
            </div>
            {panelComponent}
        </div>
    )
}

Product.propTypes = {
    url: PropTypes.string,
    filterOpen: PropTypes.bool,
    onSelectionChange: PropTypes.func,
}