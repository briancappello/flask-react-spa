import React from 'react'
import { DocComponent } from 'components'

import './grid.scss'


export default class Grid extends React.Component {
  render() {
    return (
      <div className="grid-docs">
        <h2 id="grid">Grid</h2>
        <DocComponent {...this.columns} />
        <DocComponent {...this.fractions} />
        <DocComponent {...this.columnOffsets} />
        <DocComponent {...this.fractionOffsets} />
      </div>
    )
  }

  columns = {
    title: 'Columns',
    description: [
      'Columns should be wrapped by <code>.row</code> and any combination will work so long as it adds up to <strong><u>twelve</u></strong> (eg 2+10, 3+6+3, 2+4+6, etc).',
      'It is <em>not recommended</em> to nest columns, because nested column margins will be smaller than top-level column margins (column widths and column margins are based on percents).',
      'NOTE: <code>.col</code> and <code>.cols</code> are interchangeable.',
    ],
    html: [
`<div class="row">
  <div class="one col">one col</div>
  <div class="eleven cols">eleven cols</div>
</div>
`,
`<div class="row">
  <div class="two cols">two cols</div>
  <div class="ten cols">ten cols</div>
</div>
`,
`<div class="row">
  <div class="two cols">two cols</div>
  <div class="five cols">five cols</div>
  <div class="five cols">five cols</div>
</div>
`,
`<div class="row">
  <div class="three cols">three cols</div>
  <div class="nine cols">nine cols</div>
</div>
`,
`<div class="row">
  <div class="three cols">three cols</div>
  <div class="six cols">six cols</div>
  <div class="three cols">three cols</div>
</div>
`,
`<div class="row">
  <div class="four cols">four cols</div>
  <div class="eight cols">eight cols</div>
</div>
`,
`<div class="row">
  <div class="four cols">four cols</div>
  <div class="four cols">four cols</div>
  <div class="four cols">four cols</div>
</div>
`,
`<div class="row">
  <div class="five cols">five cols</div>
  <div class="seven cols">seven cols</div>
</div>
`,
`<div class="row">
  <div class="six cols">six cols</div>
  <div class="six cols">six cols</div>
</div>
`,
`<div class="row">
  <p>There are three ways to make a full-width column. Simply use <code>.row</code>, or if you have styling targeting the column classes, use one of these:</p>
</div>
<div class="row">
  <div class="col">col</div>
</div>
<div class="row">
  <div class="twelve cols">twelve cols</div>
</div>
`,
    ],
  }

  fractions = {
    title: 'Fractions',
    description:
      'Columns should be wrapped by <code>.row</code> and any combination adding up to <strong><u>one</u></strong> will work (eg <sup>1</sup>/<sub>4</sub> + <sup>3</sup>/<sub>4</sub>, <sup>1</sup>/<sub>4</sub> + <sup>1</sup>/<sub>2</sub> + <sup>1</sup>/<sub>4</sub>, <sup>2</sup>/<sub>3</sub> + <sup>1</sup>/<sub>3</sub>, etc).',
    html: [
`<div class="row">
  <div class="quarter col">quarter col</div>
  <div class="three-quarters col">three-quarters col</div>
</div>
<!-- NOTE: .quarter and .one-quarter are interchangeable -->
`,
`<div class="row">
  <div class="third col">third col</div>
  <div class="two-thirds col">two-thirds col</div>
</div>
<!-- NOTE: .third and .one-third are interchangeable -->
`,
`<div class="row">
  <div class="half col">half col</div>
  <div class="half col">half col</div>
</div>
<!-- NOTE: .half and .one-half are interchangeable -->
`,
    ],
  }

  columnOffsets = {
    title: 'Column Offsets',
    description:
      'Offset classes should be added to the first column in a row to push the columns to the right. The total of offset plus columns should equal <strong><u>twelve</u>.</strong>',
    html: [
`<div class="row">
  <div class="three cols offset-by-one">three cols offset-by-one</div>
  <div class="three cols">three cols</div>
  <div class="five cols">five cols</div>
</div>
`,
`<div class="row">
  <div class="eleven cols offset-by-one">eleven cols offset-by-one</div>
</div>
`,
`<div class="row">
  <div class="ten cols offset-by-two">ten cols offset-by-two</div>
</div>
`,
`<div class="row">
  <div class="nine cols offset-by-three">nine cols offset-by-three</div>
</div>
`,
`<div class="row">
  <div class="eight cols offset-by-four">eight cols offset-by-four</div>
</div>
`,
`<div class="row">
  <div class="seven cols offset-by-five">seven cols offset-by-five</div>
</div>
`,
`<div class="row">
  <div class="six cols offset-by-six">six cols offset-by-six</div>
</div>
`,
`<div class="row">
  <div class="five cols offset-by-seven">five cols offset-by-seven</div>
</div>
`,
`<div class="row">
  <div class="four cols offset-by-eight">four cols offset-by-eight</div>
</div>
`,
`<div class="row">
  <div class="three cols offset-by-nine">three cols offset-by-nine</div>
</div>
`,
`<div class="row"> 
  <div class="two cols offset-by-ten">two cols offset-by-ten</div>
</div>
`,
`<div class="row">
  <div class="one col offset-by-eleven">one col offset-by-eleven</div>
</div>
`,
    ],
  }

  fractionOffsets = {
    title: 'Fraction Offsets',
    description:
      'Offset classes should be added to the first column in a row to push the columns to the right. <strong>The total of offset plus columns should equal <u>one</u>.</strong>',
    html: [
`<div class="row">
  <div class="offset-by-one-quarter three-quarters col">three-quarters col offset-by-one-quarter</div>
</div>
<!-- NOTE: .offset-by-quarter and .offset-by-one-quarter are interchangeable -->
`,
`<div class="row">
  <div class="offset-by-one-third two-thirds col">two-thirds col offset-by-one-third</div>
</div>
<!-- NOTE: .offset-by-third and .offset-by-one-third are interchangeable -->
`,
`<div class="row">
  <div class="offset-by-one-half one-half col">one-half col offset-by-one-half</div>
</div>
<!-- NOTE: .offset-by-half and .offset-by-one-half are interchangeable -->
`,
`<div class="row">
  <div class="offset-by-two-thirds one-third col">one-third col offset-by-two-thirds</div>
</div>
`,
`<div class="row">
  <div class="offset-by-three-quarters quarter col">quarter col offset-by-three-quarters</div>
</div>
`,
    ],
  }
}
