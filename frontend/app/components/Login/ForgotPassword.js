import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { bindRoutineCreators } from 'actions'
import { forgotPassword } from 'actions/auth'

import { PageContent } from 'components/Content'

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    const { success } = nextProps
    if (success) {
      this.setState({ email: '' })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.forgotPassword.trigger(this.state)
  }

  render() {
    const { errors, isSubmitting } = this.props
    return (
      <PageContent>
        <h1>Forgot Password</h1>
        <form>
          <div className={`row ${classnames({ error: errors.email })}`}>
            <label htmlFor="email">Email Address</label>
            <input type="email"
                   id="email"
                   placeholder="Email Address"
                   autoFocus
                   value={this.state.email}
                   onChange={(e) => this.setState({ email: e.target.value })}
            />
            { errors.email && <div className="help">{errors.email[0]}</div>}
          </div>
          <div className="row">
            <button type="submit"
                    className="btn btn-primary"
                    onClick={this.onSubmit}
                    disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </PageContent>
    )
  }
}

export default connect(
  (state) => state.auth.forgotPassword,
  (dispatch) => bindRoutineCreators({ forgotPassword }, dispatch),
)(ForgotPassword)
