import './FilterPanel.css'
import React, {useEffect, useState} from 'react'
import { Checkbox } from "@holusion/react-components-holusion";
import PropTypes from 'prop-types';

function handleOnChange(property, filter, setFilter) {
    if(filter.indexOf(property) >= 0) {
        setFilter(filter.filter(elem => elem !== property))
    } else {
        setFilter([...filter, property]);
    }
}

export default function FilterPanel(props) {
    const [filter, setFilter] = useState([])

    useEffect(() => props.onFilterChange(filter), [filter])

    return (
        <div className={`filter-panel ${props.visible ? "" : "hide"}`}>
            <h3>Filtre : </h3>
            <div className="filter-panel-options">
                <div className="filter-panel-active option">
                    <Checkbox onChange={() => handleOnChange("active", filter, setFilter)} />
                    <h4>Active</h4>
                </div>
                <div className="filter-panel-desactive option">
                    <Checkbox onChange={() => handleOnChange("desactive", filter, setFilter)} />
                    <h4>Desactive</h4>
                </div>
            </div>
        </div>
    )
}

FilterPanel.propTypes = {
    onFilterChange: PropTypes.func,
    visible: PropTypes.bool
}

FilterPanel.defaultProps = {
    onFilterChange: () => {}
}