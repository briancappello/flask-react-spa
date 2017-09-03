import React from 'react'
import startCase from 'lodash/startCase'


export function TextField(props) {
  const { name } = props
  return <input type="text"
                id={name}
                name={name}
                placeholder={startCase(name)}
                {...props}
         />
}
