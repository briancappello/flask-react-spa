import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, actions } from 'redux-form'
const { reset } = actions

import { contact } from 'actions/contact'
import { DangerAlert, PageContent } from 'components'
import { EmailField, TextArea, TextField } from 'components/Form'

import contactSaga from 'sagas/contact'
import injectSaga from 'utils/injectSaga'


const Contact = (props) => {
  const { error, handleSubmit, pristine, submitting } = props
  return (
    <PageContent>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <h1>Contact!</h1>
      {error && <DangerAlert>{error}</DangerAlert>}
      <form onSubmit={handleSubmit(contact)}>
        <div className="row">
          <div className="six cols">
            <TextField name="name"
                       label="Name"
                       className="full-width"
                       autoFocus
            />
          </div>
          <div className="six cols">
            <EmailField name="email"
                        className="full-width"
            />
          </div>
        </div>
        <TextArea name="message"
                  className="full-width"
                  rows="6"
        />
        <div className="row">
          <button type="submit"
                  className="button-primary"
                  disabled={pristine || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </PageContent>
  )
}

const withConnect = connect(
  (state) => state.auth.isAuthenticated
    ? { initialValues: { email: state.auth.user.email } }
    : {},
)

const withForm = reduxForm({
  form: 'contact',
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset('contact'))
  }
})

const withSaga = injectSaga({ key: 'contact', saga: contactSaga })

export default compose(
  withConnect,
  withForm,
  withSaga,
)(Contact)
