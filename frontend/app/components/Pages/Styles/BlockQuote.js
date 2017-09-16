import React from 'react'
import { DocComponent } from 'components'


export default class BlockQuote extends DocComponent {
  title = 'Block Quotes'
  html = `\
<blockquote>
  Success consists of going from failure to failure without loosing enthusiasm.
  <cite>Winston Churchill</cite>
</blockquote>
`
}
