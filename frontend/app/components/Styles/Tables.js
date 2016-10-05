import React from 'react';
import { DocComponent } from 'components';

export default class Tables extends DocComponent {
    html = `\
<table>
    <thead>
        <tr>
            <th>Ticker
            <th>Company
            <th>CEO
            <th>Website
    <tbody>
        <tr>
            <td>INTC
            <td>Intel
            <td>Brian Krzanich
            <td><a href="http://www.intel.com/">intel.com</a>
        <tr>
            <td>NVDA
            <td>NVIDIA
            <td>Jen-Hsun Huang
            <td><a href="http://nvidia.com/">nvidia.com</a>
        <tr>
            <td>AMD
            <td>Advanced Micro Devices
            <td>Lisa Su
            <td><a href="https://www.amd.com/">amd.com</a>
</table>
`

    render() {
        return (
            <div>
                <h2>Tables</h2>
                {this.renderHtml(this.html)}
                <p>NOTE: Haven't seen this table syntax before? Check out <a href="https://html.spec.whatwg.org/multipage/syntax.html#optional-tags:the-thead-element" target="_blank">the HTML5 specs</a> for an explanation of which trailing tags can be safely omitted.</p>
            </div>
        );
    }
}
