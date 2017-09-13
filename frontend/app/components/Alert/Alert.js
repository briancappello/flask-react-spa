import React from 'react'


export const DangerAlert = (props) => (
  <div>
    <div className="flash danger">{props.children}</div>
    <br/>
  </div>
)
