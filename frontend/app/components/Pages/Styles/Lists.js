import React from 'react'
import { DocComponent } from 'components'


export default class Lists extends DocComponent {
  unordered = `\
<ul>
  <li>
    One
    <ul>
      <li>Stone</li>
    </ul>
  </li>
  <li>
    Two
    <ul>
      <li>Birds</li>
    </ul>
  </li>
  <li>
    Three
    <ul>
      <li>Nested</li>
    </ul>
  </li>
</ul>
`

  ordered = `\
<ol>
  <li>
    One
    <ol>
      <li>Stone</li>
    </ol>
  </li>
  <li>
    Two
    <ol>
      <li>Birds</li>
    </ol>
  </li>
  <li>
    Three
    <ol>
      <li>Nested</li>
    </ol>
  </li>
</ol>
`

  mixed = `\
<ol>
  <li>
    One
    <ul>
      <li>Stone</li>
    </ul>
  </li>
  <li>
    Two
    <ul>
      <li>Birds</li>
    </ul>
  </li>
  <li>
    Three
    <ul>
      <li>Nested</li>
    </ul>
  </li>
</ol>
`

  render() {
    return (
      <div>
        <h2 id="lists">Lists</h2>
        <div className="row">
          <div className="third col">
            <h3>Unordered</h3>
            {this.renderHtml(this.unordered)}
          </div>
          <div className="third col">
            <h3>Ordered</h3>
            {this.renderHtml(this.ordered)}
          </div>
          <div className="third col">
            <h3>Mixed</h3>
            {this.renderHtml(this.mixed)}
          </div>
        </div>
      </div>
    )
  }
}
