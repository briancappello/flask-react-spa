import React from 'react'

import Flash from 'components/Flash'


export default class PageContent extends React.Component {
  static defaultProps = {
    className: '',
  }

  render() {
    return (
      <div className="container">
        <Flash />
        <div className={`${this.props.className} content`}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
