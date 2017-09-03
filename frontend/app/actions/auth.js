import { createRoutine } from 'actions'

export const login = createRoutine('auth/LOGIN')
export const logout = createRoutine('auth/LOGOUT')
export const fetchProfile = createRoutine('auth/FETCH_PROFILE')
export const signUp = createRoutine('auth/SIGN_UP')
