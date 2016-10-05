import React, { Component } from 'react';
import { DocComponent } from 'components';

import './grid.scss';

export default class Grid extends Component {
    render() {
        return (
            <div className="grid-docs">
                <h2>Grid</h2>
                <DocComponent {...this.columns}/>
                <DocComponent {...this.fractions}/>
                <DocComponent {...this.columnOffsets}/>
                <DocComponent {...this.fractionOffsets}/>
            </div>
        );
    }

    columns = {
        title: 'Columns',
        description: [
            'Columns should be wrapped by <code>.row</code> and <strong>any combination will work so long as it adds up to <u>nine</u></strong> (eg 1+8, 2+5+2, 6+3, etc).',
            'It is <em>not recommended</em> to nest columns, because nested column margins will be smaller than top-level column margins (both column widths and margins are based on percents).',
            'NOTE: <em>one</em> column has a singular class of <code>.column</code>, while larger columns have a plural class of <code>.columns</code>.',
        ],
        html: [
`<div class="row">
    <div class="one column">one column</div>
    <div class="eight columns">eight columns</div>
</div>
`,
`<div class="row">
    <div class="two columns">two columns</div>
    <div class="seven columns">seven columns</div>
</div>
`,
`<div class="row">
    <div class="three columns">three columns</div>
    <div class="six columns">six columns</div>
</div>
`,
`<div class="row">
    <div class="four columns">four columns</div>
    <div class="five columns">five columns</div>
</div>
`,
    ]}

    fractions = {
        title: 'Fractions',
        description: 'Columns should be wrapped by <code>.row</code> and <strong>any combination adding up to <u>one</u> will work</strong> (eg <sup>1</sup>/<sub>4</sub> + <sup>3</sup>/<sub>4</sub>, <sup>1</sup>/<sub>4</sub> + <sup>1</sup>/<sub>2</sub> + <sup>1</sup>/<sub>4</sub>, <sup>2</sup>/<sub>3</sub> + <sup>1</sup>/<sub>3</sub>, etc)',
        html: [
`<div class="row">
    <div class="quarter column">quarter column</div>
    <div class="three-quarters column">three-quarters column</div>
</div>
<!-- NOTE: .quarter and .one-quarter are interchangeable -->
`,
`<div class="row">
    <div class="third column">third column</div>
    <div class="two-thirds column">two-thirds column</div>
</div>
<!-- NOTE: .third and .one-third are interchangeable -->
`,
`<div class="row">
    <div class="half column">half column</div>
    <div class="half column">half column</div>
</div>
<!-- NOTE: .half and .one-half are interchangeable -->
`,
    ]}

    columnOffsets = {
        title: 'Column Offsets',
        description: 'Offset classes should be added to the first column in a row to push the columns to the right. <strong>The total of offset plus columns should equal <u>nine</u></strong>.',
        html: [
`<div class="row">
    <div class="two columns offset-by-one">two columns offset-by-one</div>
    <div class="two columns">two columns</div>
    <div class="four columns">four columns</div>
</div>
`,
`<div class="row">
    <div class="eight columns offset-by-one">eight columns offset-by-one</div>
</div>
`,
`<div class="row">
    <div class="seven columns offset-by-two">seven columns offset-by-two</div>
</div>
`,
`<div class="row">
    <div class="six columns offset-by-three">six columns offset-by-three</div>
</div>
`,
`<div class="row">
    <div class="five columns offset-by-four">five columns offset-by-four</div>
</div>
`,
`<div class="row">
    <div class="four columns offset-by-five">four columns offset-by-five</div>
</div>
`,
`<div class="row">
    <div class="three columns offset-by-six">three columns offset-by-six</div>
</div>
`,
`<div class="row">
    <div class="two columns offset-by-seven">two columns offset-by-seven</div>
</div>
`,
`<div class="row">
    <div class="one column offset-by-eight">one column offset-by-eight</div>
</div>
`,
    ]}

    fractionOffsets = {
        title: 'Fraction Offsets',
        description: 'Offset classes should be added to the first column in a row to push the columns to the right. <strong>The total of offset plus columns should equal <u>one</u></strong>.',
        html: [
`<div class="row">
    <div class="offset-by-one-quarter three-quarters column">three-quarters column offset-by-one-quarter</div>
</div>
<!-- NOTE: .offset-by-quarter and .offset-by-one-quarter are interchangeable -->
`,
`<div class="row">
    <div class="offset-by-one-third two-thirds column">two-thirds column offset-by-one-third</div>
</div>
<!-- NOTE: .offset-by-third and .offset-by-one-third are interchangeable -->
`,
`<div class="row">
    <div class="offset-by-one-half one-half column">one-half column offset-by-one-half</div>
</div>
<!-- NOTE: .offset-by-half and .offset-by-one-half are interchangeable -->
`,
`<div class="row">
    <div class="offset-by-two-thirds one-third column">one-third column offset-by-two-thirds</div>
</div>
`,
`<div class="row">
    <div class="offset-by-three-quarters quarter column">quarter column offset-by-three-quarters</div>
</div>
`,
    ]}
}
