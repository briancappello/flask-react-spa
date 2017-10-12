import { put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { login, logout } from 'security/actions'
import { loginSaga, logoutSaga } from '../auth'


describe('auth login saga', () => {
  let loginGenerator
  const redirect = '/',
        payload = { email: 'a@a.com', password: 'foobar' }

  beforeEach(() => {
    loginGenerator = loginSaga({ payload: { redirect, ...payload } })

    // iterate past yield put(login.request())
    const requestDescriptor = loginGenerator.next()
    expect(requestDescriptor).toMatchSnapshot()

    // iterate past yield call(Api.login, payload)
    const callDescriptor = loginGenerator.next()
    expect(callDescriptor).toMatchSnapshot()
  })

  it('should dispatch login.success if successful', () => {
    const response = {
      token: 'token!',
      user: {
        email: 'a@a.com',
        username: 'success',
      }
    }

    const putDescriptor = loginGenerator.next(response).value;
    expect(putDescriptor).toEqual(put(login.success(response)))
  })

  it('should redirect after successful login', () => {
    loginGenerator.next('response')
    const putDescriptor = loginGenerator.next().value
    expect(putDescriptor).toEqual(put(push(redirect)))
  })

  it('should dispatch login.failure if error', () => {
    const error = new Error('fail')

    const putDescriptor = loginGenerator.throw(error).value
    expect(putDescriptor).toEqual(put(login.failure(error)))
  })
})

describe('auth logout saga', () => {
  let logoutGenerator
  const redirect = '/'

  beforeEach(() => {
    logoutGenerator = logoutSaga()

    // iterate past yield put(logout.request())
    const requestDescriptor = logoutGenerator.next()
    expect(requestDescriptor).toMatchSnapshot()

    // iterate past yield call(Api.logout, payload)
    const callDescriptor = logoutGenerator.next()
    expect(callDescriptor).toMatchSnapshot()
  })

  it('should dispatch logout.success if successful', () => {
    const response = { logout: true }

    const putDescriptor = logoutGenerator.next(response).value;
    expect(putDescriptor).toEqual(put(logout.success(response)))
  })

  it('should redirect after successful logout', () => {
    logoutGenerator.next('response')
    const putDescriptor = logoutGenerator.next().value
    expect(putDescriptor).toEqual(put(push(redirect)))
  })

  it('should dispatch logout.failure if error', () => {
    const error = new Error('fail')

    const putDescriptor = logoutGenerator.throw(error).value
    expect(putDescriptor).toEqual(put(logout.failure(error)))
  })
})
