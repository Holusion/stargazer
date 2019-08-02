import './ProductInfo.css'
import React, {useEffect, useState} from 'react'
import {dispatchInfo, dispatchTask, endTask} from '../../store'
import PropTypes from 'prop-types'
import {ipcRenderer} from 'electron'
import url from 'url'

const mapName = {
    user: "Utilisateur sur lequel le lecteur de médias est lancé",
    pid: "PID du lecteur de médias : ",
    cpu: "Consommation CPU du lecteur de médias : ",
    mem: "Consommation mémoire du lecteur de médias : ",
    start: "Heure de début du lancement du lecteur de médias : ",
    time: "Temps écoulé depuis le début du lancement du lecteur de médias : ",
    command: "Lecteur de médias utilisé : ",
}

export default function ProductInfo(props) {
    const [version, setVersion] = useState("Aucune versions trouvée")
    const [ip, setIp] = useState("Aucune ip trouvée");
    const [process, setProcess] = useState({});

    useEffect(() => {
        fetch(url.resolve(`http://${props.url}`, `/system/ip/status`)).then(res => res.text()).then(text => setIp(text));
        fetch(url.resolve(`http://${props.url}`, `/system/version`)).then(res => res.text()).then(text => setVersion(text));
        fetch(url.resolve(`http://${props.url}`, `/system/process/status`)).then(res => res.json()).then(json => setProcess(json));
    }, [])

    let video_player = [];
    for(let p in process) {
        if(mapName[p]) {
            video_player.push(
                <div key={p} className="item">
                    {mapName[p]}
                    <span>{process[p]}</span>
                </div>
            )
        }
    }

    return (
        <div className="product-info-container">
            <div className="item">
                Url du produit : 
                <span>{props.url}</span>
            </div>
            <div className="item">
                Version du controller : 
                <span>{version}</span>
            </div>
            <div className="item">
                Ip du produit : 
                <span>{ip}</span>
            </div>
            {video_player}
            <div className="log">
                <a onClick={() => {
                    dispatchTask("doawnload_log");
                    ipcRenderer.send('download', {
                        url: url.resolve(`http://${props.url}`, `/system/log`),
                        onmouseover: 'function() {this.style="color: #666"}'
                    });
                    ipcRenderer.on('download-complete', () => {
                        endTask("download_log");
                        dispatchInfo("le fichier log a été téléchargé", "Il se trouve dans le dossier de téléchargement par défaut");
                    })
                }}>Télécharger les logs</a>
            </div>
        </div>
    )
}

ProductInfo.propTypes = {
    url: PropTypes.string.isRequired,
}