import './Notification.css'
import { ButtonIcon, Icon } from '@holusion/react-components-holusion'
import React, {useState} from 'react'
import PropTypes from 'prop-types'

export default function Notification(props) {
    const [visible, setVisible] = useState(true);
    
    const icon = props.icon ?  <div className="notification-icon"><Icon name={props.icon} /></div> : null;

    return (
        <div className={`notification-container ${visible ? "visible" : ""}`}>
            <div className="notification-left">
                {icon}
            </div>
            <div className="notification-right">
                <div className="notification-title">
                    {props.title}
                </div>
                {props.content}
            </div>
            <div className="notification-top-right">
                <ButtonIcon key={props.title} name="close" title="Fermer la notification" onClick={() => {props.onClose(); setVisible(false)}} />
            </div>
        </div>
    )
}

Notification.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    icon: PropTypes.element,
    onClose: PropTypes.func,
}