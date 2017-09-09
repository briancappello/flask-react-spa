import React from 'react'
import classnames from 'classnames'
import startCase from 'lodash/startCase'
import { Field } from 'redux-form'

import { required as requiredValidator } from './validators'
import { inArray, isArray } from 'utils'


export const EmailField = (props) =>
  <Field type="email" component={_renderInput} required={_isRequired(props)} {...props} />

export const HiddenField = (props) =>
  <Field type="hidden" component="input" {...props} />

export const PasswordField = (props) =>
  <Field type="password" component={_renderInput} required={_isRequired(props)} {...props} />

export const TextField = (props) =>
  <Field type="text" component={_renderInput} required={_isRequired(props)} {...props} />

const _isRequired = ({ validate }) => {
  return isArray(validate) && validate.indexOf(requiredValidator) !== -1
}

const _renderInput = ({ input, label, meta, required, ...props }) => {
  const { touched, error, warning } = meta
  const { name } = input
  const id = name
  label = label || startCase(name)

  const hasError = () => {
    if (touched && error) return 'error'
    if (touched && warning) return 'warning'
    return null
  }

  return (
    <div className={`row ${classnames({ error: hasError() })}`}>
      <label htmlFor={id} className={classnames({ required })}>
        {label}
      </label>
      <input id={id} {...input} placeholder={label} {...props} />
      {hasError() && <div className="help">{error || warning}</div>}
    </div>
  )
}
