import React from 'react'
import { DocComponent } from 'components'


export default class Code extends React.Component {
  javascript = `\
import React from 'react';
import PropTypes from 'prop-types';

class CodeExample extends React.Component {

  code = \`\\
<blockquote>
  Failure is simply the opportunity to begin again, this time more intelligently.
  <cite>Henry Ford</cite>
</blockquote>
\`

  render() {
    return (
      <div>
        {/* The following injects the unescaped HTML code into the DOM. */}
        <div dangerouslySetInnerHTML={{__html: this.code}}></div>

        {/* And here we show the same HTML in a code block. */}
        <pre><code>{this.code}</code></pre>
      </div>
    );
  }
}
`

  render() {
    return (
      <div>
        <h2 id="code">Code</h2>
        <p>
          All of the html examples on this page are using the included code
          styling. Be sure to wrap your <code>code</code> tags with{' '}
          <code>pre</code> tags if you want to preserve whitespace. Here's how
          some code gets rendered from JSX:
        </p>
        <pre>
          <code>
            {this.javascript}
          </code>
        </pre>

        <h3>Code Highlighting</h3>
        <p>
          You should use a 3rd party library like{' '}
          <a href="https://highlightjs.org/" target="_blank">
            highlight.js
          </a>{' '}
          (client-side) or{' '}
          <a href="http://pygments.org/" target="_blank">
            Pygments
          </a>{' '}
          (server-side) to do code highlighting.
        </p>
      </div>
    )
  }
}
