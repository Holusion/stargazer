import './Product.css'
import BadProductIPFound from '../../errors/BadProductIPFound'
import Network from '../../network';
import Playlist from '../../components/Playlist';
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
          network.synchronize();
          const playlist = await network.getPlaylist();
          let current = await network.getCurrent();
          this.setState(() => ({url: addr, playlist: [...playlist], current: current}))

          listenPlaylist("current-playlist", async () => {
            current = await network.getCurrent();
            this.setState(() => ({current: current}))
          })
        }

    }

    handleCheckboxChange(item, event) {
        event.target.checked 
            ? this.setState((prevState) => ({selected: [...prevState.selected, item]})) 
            : this.setState(() => ({selected: this.state.selected.filter(elem => elem.name !== item.name)}))
    }

    render() {
        const items = this.state.playlist.map(elem => ({
            ...elem,
            image: `http://${this.state.url}/medias/${elem.name}?thumb=true`,
            selected: this.state.selected.filter(item => item.name === elem.name).length > 0,
            current: this.state.current.name === elem.name,
            onCheckboxChange: this.handleCheckboxChange.bind(this, elem),
        }))

        return (
            <div className="product">
                <Playlist items={items} />
            </div>
        )
    }
}

Product.propTypes = {
    product: PropTypes.object
}