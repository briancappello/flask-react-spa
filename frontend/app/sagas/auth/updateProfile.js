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
    const { user } = yield select(selectAuth)
    const updatedUser = yield call(AuthApi.updateProfile, user, payload)
    yield put(updateProfile.success({ user: updatedUser }))
    yield put(flashSuccess('Your profile has been successfully updated.'))
  },
)

export default () => [
  takeLatest(updateProfile.TRIGGER, updateProfileSaga),
]
