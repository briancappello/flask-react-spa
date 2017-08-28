import authSagas from './auth'
import protectedSagas from './protected'

export default [
  ...authSagas,
  ...protectedSagas,
]
