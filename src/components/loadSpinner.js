import React from 'react'
import PropTypes from 'prop-types'
import './loadSpinner.css'

export default function LoadSpinner({ color, className, style, size }) {
    const circles = [...Array(8)].map((_, index) => {
        return (
            <div key={index}>
                <div className="div-after" style={{ background: color }}></div>
            </div>
        )
    })

    return (
        <div className={`dat-spinner ${className}`} style={{ ...style }}>
            {circles}
        </div>
    )
}

LoadSpinner.propTypes = {
    /** hex color */
    color: PropTypes.string,
    /** class name  */
    className: PropTypes.string,
    /** style object */
    style: PropTypes.object,
}

LoadSpinner.defaultProps = {
    color: '#0050b1',
    className: '',
    style: {}
}