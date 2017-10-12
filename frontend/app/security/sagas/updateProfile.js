import { call, put, select, takeLatest } from 'redux-saga/effects'

import { flashClear, flashSuccess } from 'site/actions'
import { createRoutineFormSaga } from 'sagas'

import { updateProfile } from 'security/actions'
import SecurityApi from 'security/api'
import { selectSecurity } from 'security/reducer'


export const KEY = 'updateProfile'

export const updateProfileSaga = createRoutineFormSaga(
  updateProfile,
  function *successGenerator(payload) {
    yield put(flashClear())
    const { user } = yield select(selectSecurity)
    const updatedUser = yield call(SecurityApi.updateProfile, user, payload)
    yield put(updateProfile.success({ user: updatedUser }))
    yield put(flashSuccess('Your profile has been successfully updated.'))
  },
)

export default () => [
  takeLatest(updateProfile.TRIGGER, updateProfileSaga),
]
