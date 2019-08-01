import './Notifier.css'
import React, {useEffect, useState} from 'react'
import Notification from '../Notification'
import PropTypes from 'prop-types'

export default function Notifier(props) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => setNotifications(props.list), [props.list]);

    const elems = notifications.map(item => {
        return  <Notification 
                    key={item.id} 
                    title={item.title} 
                    content={item.content}
                    visible={item.visible}
                    onClose={() => props.onRemove(item)}
                />
    });

    return (
        <div className="notifier">
            {elems}
        </div>
    )
}

Notifier.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object),
    onRemove: PropTypes.func
}