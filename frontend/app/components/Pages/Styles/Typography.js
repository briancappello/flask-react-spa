import React from 'react'
import { DocComponent } from 'components'


export default class Typography extends DocComponent {
  title = 'Typography'
  html = `\
<h1>Heading 1 (5rem)</h1>
<h2>Heading 2 (4.2rem)</h2>
<h3>Heading 3 (3.6rem)</h3>
<h4>Heading 4 (3rem)</h4>
<h5>Heading 5 (2.4rem)</h5>
<h6>Heading 6 (1.8rem)</h6>
<p>Despite the optical illusion, they are in fact all the same color. Also, this is text inside a paragraph tag (1.5rem). Here's what some <strong>bold text</strong>, some <u>underlined text</u>, and some <em>italicized text</em> looks like.</p>
`
}
