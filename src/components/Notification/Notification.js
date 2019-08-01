import './Notification.css'
import { Icon } from '@holusion/react-components-holusion'
import PropTypes from 'prop-types'
import React from 'react'

export default function Notification(props) {
    const icon = props.icon ?  <div className="notification-icon"><Icon name={props.icon} width={95} height={95} /></div> : null;

    return (
        <div className={`notification-container ${props.visible ? "visible" : ""}`} onClick={props.onClick ? props.onClick : null}>
            <div className="notification-left">
                {icon}
            </div>
            <div className="notification-right">
                <div className="notification-title">
                    {props.title}
                </div>
                {props.content}
            </div>
            <div className="notification-top-right" onClick={props.onClose}>
                <Icon key={props.title} name="close" title="Fermer la notification" />
            </div>
        </div>
    )
}

Notification.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    icon: PropTypes.string,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onClick : PropTypes.func,
}