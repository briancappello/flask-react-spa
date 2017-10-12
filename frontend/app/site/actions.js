import { createRoutine } from 'actions'


export const FLASH_SUCCESS = 'FLASH_SUCCESS'
export const FLASH_INFO = 'FLASH_INFO'
export const FLASH_WARNING = 'FLASH_WARNING'
export const FLASH_DANGER = 'FLASH_DANGER'
export const FLASH_CLEAR = 'FLASH_CLEAR'

export function flashSuccess(title, message) {
  return {
    type: FLASH_SUCCESS,
    payload: { title, message },
  }
}

export function flashInfo(title, message) {
  return {
    type: FLASH_INFO,
    payload: { title, message },
  }
}

export function flashWarning(title, message) {
  return {
    type: FLASH_WARNING,
    payload: { title, message },
  }
}

export function flashDanger(title, message) {
  return {
    type: FLASH_DANGER,
    payload: { title, message },
  }
}

export function flashClear() {
  return {
    type: FLASH_CLEAR,
  }
}

export const contact = createRoutine('site/CONTACT')
