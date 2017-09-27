import React from 'react'
import classnames from 'classnames'
import startCase from 'lodash/startCase'
import Field from 'redux-form/es/Field'


export const EmailField = (props) =>
  <Field component={_renderInput} type="email" {...props} />

export const HiddenField = (props) =>
  <Field component="input" type="hidden" {...props} />

export const PasswordField = (props) =>
  <Field component={_renderInput} type="password" {...props} />

export const TextField = (props) =>
  <Field component={_renderInput} type="text" {...props} />

export const TextArea = (props) =>
  <Field component={_renderTextArea} {...props} />


const _renderInput = (props) => _renderField({ component: 'input', ...props })

const _renderTextArea = (props) => _renderField({ component: 'textarea', ...props })

const _renderField = ({ component: Component, input, label, meta, required, ...props }) => {
  const { touched, error, warning } = meta

  const hasError = () => {
    if (touched && error) return 'error'
    if (touched && warning) return 'warning'
    return null
  }

  const { name } = input
  label = label || startCase(name)

  return (
    <div className={`row ${classnames({
      error: hasError() === 'error',
      warning: hasError() === 'warning',
    })}`}>
      <label htmlFor={name} className={classnames({ required })}>
        {label}
      </label>
      <Component id={name} {...input} placeholder={label} {...props} />
      {hasError() && <div className="help">{error || warning}</div>}
    </div>
  )
}
