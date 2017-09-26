import { createRoutine } from 'actions'

export const changePassword = createRoutine('auth/CHANGE_PASSWORD')
export const forgotPassword = createRoutine('auth/FORGOT_PASSWORD')
export const resetPassword = createRoutine('auth/RESET_PASSWORD')
export const login = createRoutine('auth/LOGIN')
export const logout = createRoutine('auth/LOGOUT')
export const updateProfile = createRoutine('auth/UPDATE_PROFILE')
export const signUp = createRoutine('auth/SIGN_UP')
export const resendConfirmationEmail = createRoutine('auth/RESEND_CONFIRMATION_EMAIL')
