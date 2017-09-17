import React from 'react'
import { DocComponent } from 'components'


export default class Tables extends DocComponent {
  title = 'Tables'
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
}
