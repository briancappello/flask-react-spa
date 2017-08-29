import { put } from 'redux-saga/effects'

import { fetchProtected } from 'actions/protected'
import { fetchProtectedSaga, fetchProtectedIfNeeded } from '../protected'


describe('fetchProtected saga', () => {
  let protectedGenerator

  beforeEach(() => {
    protectedGenerator = fetchProtectedSaga()

    // iterate past yield put(fetchProtected.request())
    const requestDescriptor = protectedGenerator.next()
    expect(requestDescriptor).toMatchSnapshot()

    // iterate past yield select(selectAuth)
    const selectDescriptor = protectedGenerator.next()
    expect(selectDescriptor).toMatchSnapshot()

    // iterate past yield call(Api.getProtected, token)
    const callDescriptor = protectedGenerator.next('response')
    expect(callDescriptor).toMatchSnapshot()
  })

  it('should dispatch fetchProtected.success if successful', () => {
    const response = { foo: 'bar' }

    const putDescriptor = protectedGenerator.next(response).value;
    expect(putDescriptor).toEqual(put(fetchProtected.success(response)))
  })

  it('should dispatch fetchProtected.failure if error', () => {
    const error = new Error('fail')

    const putDescriptor = protectedGenerator.throw(error).value
    expect(putDescriptor).toEqual(put(fetchProtected.failure(error)))
  })
})

describe('fetchProtectedIfNeeded saga', () => {
  let maybeFetchGenerator

  beforeEach(() => {
    maybeFetchGenerator = fetchProtectedIfNeeded()

    const selectDescriptor = maybeFetchGenerator.next()
    expect(selectDescriptor).toMatchSnapshot()
  })

  it('should yield fetchProtected.trigger when not loaded or loading', () => {
    const result = maybeFetchGenerator.next({ isLoaded: false, isLoading: false }).value
    expect(result).toEqual(put(fetchProtected.trigger()))
  })

  it('should not yield fetchProtected.trigger when loaded', () => {
    const result = maybeFetchGenerator.next({ isLoaded: true, isLoading: false }).value
    expect(result).toEqual(undefined)
  })

  it('should not yield fetchProtected.trigger when loading', () => {
    const result = maybeFetchGenerator.next({ isLoaded: false, isLoading: true }).value
    expect(result).toEqual(undefined)
  })
})
