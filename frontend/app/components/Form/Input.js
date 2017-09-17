import React from 'react'
import classnames from 'classnames'
import startCase from 'lodash/startCase'
import { Field } from 'redux-form'


export const EmailField = (props) =>
  <Field type="email" component={_renderInput} {...props} />

export const HiddenField = (props) =>
  <Field type="hidden" component="input" {...props} />

export const PasswordField = (props) =>
  <Field type="password" component={_renderInput} {...props} />

export const TextField = (props) =>
  <Field type="text" component={_renderInput} {...props} />

export const TextArea = (props) =>
  <Field component={_renderTextArea} {...props} />


const _renderInput = (props) => _renderField({ component: 'input', ...props })

const _renderTextArea = (props) => _renderField({ component: 'textarea', ...props })

const _renderField = ({ component: Component, input, label, meta, required, ...props }) => {
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
      <Component id={id} {...input} placeholder={label} {...props} />
      {hasError() && <div className="help">{error || warning}</div>}
    </div>
  )
}
