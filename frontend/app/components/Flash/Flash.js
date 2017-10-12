import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { flashClear } from 'site/actions'

import './flash.scss'


class Flash extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    severity: PropTypes.oneOf(['success', 'info', 'warning', 'danger']),
  }

  close = (e) => {
    e.preventDefault()
    this.props.flashClear()
  }

  render() {
    const { title, message, severity, visible } = this.props
    if (!visible) return null

    return (
      <div className={`flash ${severity}`}>
        <a className="close" href="#" onClick={this.close}>
          &times;
        </a>
        <div className="flash-title">
          {title}
        </div>
        <div className="flash-message">
          {message}
        </div>
      </div>
    )
  }
}

export default connect(
  (state) => ({ ...state.flash }),
  (dispatch) => bindActionCreators({ flashClear }, dispatch),
)(Flash)
