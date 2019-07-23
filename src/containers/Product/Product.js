import './Product.css'
import BadProductIPFound from '../../errors/BadProductIPFound'
import Network from '../../network';
import {Playlist, Fab} from '@holusion/react-components-holusion';
import PropTypes from 'prop-types'
import React from 'react'
import {dispatchError, listenPlaylist} from '../../store'
import net from "net";

export default class Product extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playlist: [],
            url: "",
            selected: [],
            removed: [],
            current: {}
        }
    }

    async componentDidMount() {
        let addr = null;
        if(process.platform === "win32") {
            for(let a of this.props.product.addresses) {
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
                    dispatchError(new BadProductIPFound(this.props.product.name, addr));
                    break;
                default:
            }
        } else {
            addr = `${this.props.product.name}.local`;
        }

        if(addr) {
            const network = new Network(addr);
            this.endSynchronize = network.synchronize();
            const playlist = await network.getPlaylist();
            let current = await network.getCurrent();
            this.setState(() => ({url: addr, playlist: [...playlist], current: current}))
            this.updateCurrent = this.updateCurrent.bind(this, network);
            this.stopListenPlaylist = listenPlaylist("current-playlist", this.updateCurrent);
        }
    }

    componentWillUnmount() {
        this.endSynchronize();
        this.stopListenPlaylist();
    }
    
    async updateCurrent(network) {
        let current = await network.getCurrent();
        this.setState(() => ({current: current}))
    }

    select(item) {
        this.setState(() => {
            const newState = {selected: [...this.state.selected, item]};
            if(this.props.onSelectionChange) this.props.onSelectionChange(newState.selected);
            return newState;
        })
    }

    unselectItem(item) {
        this.setState(() => {
            const newState = {selected: this.state.selected.filter(elem => elem.name !== item.name)};
            if(this.props.onSelectionChange) this.props.onSelectionChange(newState.selected);
            return newState;
        })
    }

    selectOneItem(item) {
        this.setState(() => {
            const newState = {selected: [item]};
            if(this.props.onSelectionChange) this.props.onSelectionChange(newState.selected);
            return newState;
        })
    }

    handleCheckboxChange(item, event) {
        event.target.checked ? this.select(item) : this.unselectItem(item);
    }

    handleOnRemove(item, event) {
        this.setState(() => ({removed: [...this.state.removed, item]}))
    }

    handleOnClick(item, event) {
        if(event.target.className === "card")
        this.selectOneItem(item);
    }

    render() {
        const items = this.state.playlist.map(elem => ({
            ...elem,
            image: `http://${this.state.url}/medias/${elem.name}?thumb=true`,
            selected: this.state.selected.filter(item => item.name === elem.name).length > 0,
            current: this.state.current.name === elem.name,
            visible: this.state.removed.filter(item => item.name === elem.name).length == 0,
            onCheckboxChange: this.handleCheckboxChange.bind(this, elem),
            onRemove: this.handleOnRemove.bind(this, elem),
            onClick: this.handleOnClick.bind(this, elem)
        }))

        return (
            <div className="product">
                <Playlist items={items} />
                <Fab title="Ajouter un média" icon="upload"/>
            </div>
        )
    }
}

Product.propTypes = {
    product: PropTypes.object,
    onSelectionChange: PropTypes.func
}