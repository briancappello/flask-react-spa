export const FETCH_PROTECTED_IF_NEEDED = 'FETCH_PROTECTED_IF_NEEDED'
export const PROTECTED_REQUEST = 'PROTECTED_REQUEST'
export const PROTECTED_SUCCESS = 'PROTECTED_SUCCESS'
export const PROTECTED_FAILURE = 'PROTECTED_FAILURE'

export function protectedRequest() {
  return {
    type: PROTECTED_REQUEST,
  }
}

export function protectedSuccess(data) {
  return {
    type: PROTECTED_SUCCESS,
    payload: data,
  }
}

export function protectedFailure(error) {
  return {
    type: PROTECTED_FAILURE,
    payload: error,
  }
}

export function fetchProtectedIfNeeded() {
  return {
    type: FETCH_PROTECTED_IF_NEEDED,
  }
}
