import camelCase from 'lodash/camelCase'
import { actionTypes, createRoutine, bindRoutineCreators } from '../actions'

test('createRoutine should return an object of action creators and constants', () => {
  const routineName = 'MY_ROUTINE'
  const myRoutine = createRoutine(routineName)
  actionTypes.forEach((actionType) => {
    const actionName = `${routineName}_${actionType}`
    const actionCreatorName = camelCase(actionType)
    expect(myRoutine).toHaveProperty(actionType, actionName)
    expect(myRoutine).toHaveProperty(actionCreatorName)
    expect(myRoutine[actionCreatorName]({ foo: 'bar'})).toEqual({
      type: actionName,
      payload: { foo: 'bar' },
    })
  })
})

test('bindRoutineCreators should return an object of bound action creators', () => {
  const routineName = 'MY_ROUTINE'
  const myRoutine = createRoutine(routineName)
  const boundRoutine = bindRoutineCreators({ myRoutine }, f => f)
  actionTypes.forEach((actionType) => {
    const actionName = `${routineName}_${actionType}`
    const actionCreatorName = camelCase(actionType)
    expect(boundRoutine['myRoutine'][actionCreatorName]({ foo: 'bar' })).toEqual({
      type: actionName,
      payload: { foo: 'bar' },
    })
  })
})

test('bindRoutineCreators should return an empty object if not passed any routines', () => {
  expect(bindRoutineCreators({}, f => f)).toEqual({})
})

test('bindRoutineCreators should throw an error if passed incorrect routines parameter', () => {
  expect(() => {
    bindRoutineCreators('fail', f => f)
  }).toThrowError(/routines must be an object/)
})

test('bindRoutineCreators should throw an error if passed incorrect dispatch parameter', () => {
  expect(() => {
    bindRoutineCreators({})
  }).toThrowError(/dispatch must be a function/)

  expect(() => {
    bindRoutineCreators({}, 'fail')
  }).toThrowError(/dispatch must be a function/)
})
