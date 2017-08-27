import { flashClear } from 'actions/flash'
import { LOCATION_CHANGE } from 'react-router-redux'

export const flashClearMiddleware = ({
  getState,
  dispatch,
}) => next => action => {
  if (action.type == LOCATION_CHANGE && getState().flash.visible) {
    dispatch(flashClear())
  }
  return next(action)
}
