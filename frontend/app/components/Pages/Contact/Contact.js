import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, reset } from 'redux-form'
import Helmet from 'react-helmet'

import { contact } from 'actions/site'
import { DangerAlert, PageContent } from 'components'
import { EmailField, TextArea, TextField } from 'components/Form'


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

const ContactForm = reduxForm({
  form: 'contact',
  onSubmitSuccess: (_, dispatch) => {
    dispatch(reset('contact'))
  }
})(Contact)

export default connect(
  (state) => {
    const { isAuthenticated, user } = state.auth
    if (!isAuthenticated) {
      return {}
    }

    return {
      initialValues: {
        email: user.email,
      },
    }
  }
)(ContactForm)
