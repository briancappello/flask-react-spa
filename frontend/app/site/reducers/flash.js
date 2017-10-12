import {
  FLASH_SUCCESS,
  FLASH_INFO,
  FLASH_WARNING,
  FLASH_DANGER,
  FLASH_CLEAR,
} from 'site/actions'


export const initialState = {
  title: null,
  message: null,
  severity: null,
  visible: false,
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case FLASH_CLEAR:
      return initialState

    case FLASH_SUCCESS:
      return {
        ...payload,
        visible: true,
        severity: 'success',
      }

    case FLASH_INFO:
      return {
        ...payload,
        visible: true,
        severity: 'info',
      }

    case FLASH_WARNING:
      return {
        ...payload,
        visible: true,
        severity: 'warning',
      }

    case FLASH_DANGER:
      return {
        ...payload,
        visible: true,
        severity: 'danger',
      }

    default:
      return state
  }
}
