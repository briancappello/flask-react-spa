import React from 'react'
import PropTypes from 'prop-types'

import './spinner.scss'

export const Spinner = (props) => {
  const { color } = props
  return (
    <div className={`spinner-loading-indicator ${color}`}>
      <div className="spinner-circle r0" />
      <div className="spinner-circle r30" />
      <div className="spinner-circle r60" />
      <div className="spinner-circle r90" />
      <div className="spinner-circle r120" />
      <div className="spinner-circle r150" />
      <div className="spinner-circle r180" />
      <div className="spinner-circle r210" />
      <div className="spinner-circle r240" />
      <div className="spinner-circle r270" />
      <div className="spinner-circle r300" />
      <div className="spinner-circle r330" />
    </div>
  )
}

Spinner.defaultProps = {
  color: 'black',
}

Spinner.propTypes = {
  color: PropTypes.string,
}

export default Spinner
