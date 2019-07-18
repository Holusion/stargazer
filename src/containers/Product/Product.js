import './Product.css'
import BadProductIPFound from '../../errors/BadProductIPFound'
import Network from '../../network';
import Playlist from '../../components/Playlist';
import PropTypes from 'prop-types'
import React from 'react'
import {dispatchError} from '../../store'
import net from "net";


export default class Product extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playlist: [],
            url: "",
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
          const playlist = await network.getPlaylist();
          this.setState(() => ({url: addr, playlist: [...playlist]}))
        }
    }

    render() {
        return (
            <div className="product">
                <Playlist items={this.state.playlist} url={this.state.url}/>
            </div>
        )
    }
}

Product.propTypes = {
    product: PropTypes.object
}