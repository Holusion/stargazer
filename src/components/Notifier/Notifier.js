import './Notifier.css'
import React, {useEffect, useState} from 'react'
import Notification from '../Notification'
import PropTypes from 'prop-types'

function genId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function pushNotification(obj, notifications, setNotifications) {
    let list = [...notifications]
    if(list.length >= 3) {
        list.shift();
        list.push(obj);
    } else {
        list.push(obj);
    }
    setNotifications(list);
}

function pushError(err, notifications, setNotifications) {
    if(err) {
        const obj = {id: genId(), title: err.message, content: "Cliquez pour en savoir plus"}
        pushNotification(obj, notifications, setNotifications);
    }
}

function pushInfo(info, notifications, setNotifications) {
    if(info) {
        const obj = {id: genId(), title: info.title, content: info.message}
        pushNotification(obj, notifications, setNotifications);
    }
}

function removeNotification(id, notifications, setNotifications) {
    let list = notifications.filter(elem => elem.id !== id);
    setNotifications(list);
}

export default function Notifier(props) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => pushError(props.error, notifications, setNotifications), [props.error]);
    useEffect(() => pushInfo(props.info, notifications, setNotifications), [props.info]);

    const elems = notifications.map(item => {
        return <Notification key={item.id} title={item.title} content={item.content} onClose={() => setTimeout(() => removeNotification(item.id, notifications, setNotifications), 1000)} />
    });

    return (
        <div className="notifier">
            {elems}
        </div>
    )
}

Notifier.propTypes = {
    error: PropTypes.object,
    info: PropTypes.object
}