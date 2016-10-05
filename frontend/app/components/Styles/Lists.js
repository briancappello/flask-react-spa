import React from 'react';
import { DocComponent } from 'components';

export default class Lists extends DocComponent {
    unordered = `\
<ul>
    <li>
        One
        <ul><li>Stone</li></ul>
    </li>
    <li>
        Two
        <ul><li>Birds</li></ul>
    </li>
    <li>
        Three
        <ul><li>Nested Lists</li></ul>
    </li>
</ul>
`

    ordered = `\
<ol>
    <li>
        One
        <ol><li>Stone</li></ol>
    </li>
    <li>
        Two
        <ol><li>Birds</li></ol>
    </li>
    <li>
        Three
        <ol><li>Nested Lists</li></ol>
    </li>
</ol>
`

    mixed = `\
<ol>
    <li>
        One
        <ul><li>Stone</li></ul>
    </li>
    <li>
        Two
        <ul><li>Birds</li></ul>
    </li>
    <li>
        Three
        <ul><li>Nested Lists</li></ul>
    </li>
</ol>
`

    render() {
        return (
            <div>
                <h2>Lists</h2>
                <div className="row">
                    <div className="third column">
                        <h3>Unordered</h3>
                        {this.renderHtml(this.unordered)}
                    </div>
                    <div className="third column">
                        <h3>Ordered</h3>
                        {this.renderHtml(this.ordered)}
                    </div>
                    <div className="third column">
                        <h3>Mixed</h3>
                        {this.renderHtml(this.mixed)}
                    </div>
                </div>
            </div>
        );
    }
}
