import { call, put, takeLatest } from 'redux-saga/effects'

import { flashSuccess } from 'actions/flash'
import { contact } from 'actions/site'
import { createRoutineFormSaga } from 'sagas'
import { Api } from 'utils'


export const contactSaga = createRoutineFormSaga(
  contact,
  function *successGenerator(payload) {
    const response = yield call(Api.contact, payload)
    yield put(contact.success(response))
    yield put(flashSuccess('Your contact submission has been received.'))
  }
)

export default () => [
  takeLatest(contact.TRIGGER, contactSaga),
]
