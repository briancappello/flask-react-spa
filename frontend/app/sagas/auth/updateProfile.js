import { call, put, select, takeLatest } from 'redux-saga/effects'

import { selectAuth } from 'reducers/auth'
import { flashClear, flashSuccess } from 'actions/flash'
import { updateProfile } from 'actions/auth'
import AuthApi from 'api/auth'
import { createRoutineFormSaga } from 'sagas'


export const updateProfileSaga = createRoutineFormSaga(
  updateProfile,
  function *successGenerator(payload) {
    yield put(flashClear())
    const { token, user } = yield select(selectAuth)
    const response = yield call(AuthApi.updateProfile, token, user, payload)
    yield put(updateProfile.success({ user: response }))
    yield put(flashSuccess('Your profile has been successfully updated.'))
  },
)

export default () => [
  takeLatest(updateProfile.TRIGGER, updateProfileSaga),
]
