import React, { Component } from 'react'

// http://stackoverflow.com/questions/19038799/why-is-there-an-unexplainable-gap-between-these-inline-block-div-elements#answer-19038859
function stripWhitespaceBetweenTags(str) {
  return str.replace(/\>\s+\</g, '><')
}

export default class DocComponent extends Component {
  renderHtml(html, key = 0) {
    //html = stripWhitespaceBetweenTags(html);
    return (
      <div key={key}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <pre>
          <code>
            {html}
          </code>
        </pre>
      </div>
    )
  }

  renderDescription(description) {
    if (!description) return null

    if (!Array.isArray(description)) {
      description = [description]
    }

    return description.map((desc, i) => {
      return <p key={i} dangerouslySetInnerHTML={{ __html: desc }} />
    })
  }

  render() {
    let obj = this,
      topLevel = true

    if (this.props.hasOwnProperty('html')) {
      obj = this.props
      topLevel = false
    }
    const { title, description, html } = obj

    if (!title && !html) {
      throw new Error(
        'Either specify title and html as class variables or override the render() function.',
      )
    }

    const titleId = title.toLowerCase().replace(' ', '-')

    return (
      <div>
        {topLevel
          ? <h2 id={titleId}>{title}</h2>
          : <h3 id={titleId}>{title}</h3>
        }
        {this.renderDescription(description)}
        {Array.isArray(html)
          ? html.map((chunk, i) => this.renderHtml(chunk, i))
          : this.renderHtml(html)
        }
      </div>
    )
  }
}
