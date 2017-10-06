import React from 'react'
import format from 'date-fns/format'

export const Date = ({ value }) => (
  <span className="date">
    {format(value, 'M/D/YYYY')}
  </span>
)

export const LongDate = ({ value }) => (
  <span className="date">
    {format(value, 'MMMM Do, YYYY')}
  </span>
)

export const Time = ({ value }) => (
  <span className="time">
    {format(value, 'h:mm a')}
  </span>
)

export const DateTime = ({ value }) => (
  <span className="datetime">
    <Time value={value} />
    {' '}
    <Date value={value} />
  </span>
)

export const LongDateTime = ({ value }) => (
  <span className="datetime">
    <Time value={value} />
    {' '}
    <LongDate value={value} />
  </span>
)

export default Date
