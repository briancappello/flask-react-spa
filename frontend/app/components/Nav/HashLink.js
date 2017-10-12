/**
 * ScrollIntoView and HashLink components
 *
 * Ideally these would be split into two files, but alas, JavaScript
 *
 * code adapted from:
 *
 * https://github.com/rafrex/react-router-hash-link/blob/c424f2e590088526330b5d409f80501e74e1eeb7/src/index.js
 *
 * and
 *
 * https://stackoverflow.com/questions/40217585/in-react-router-v4-how-does-one-link-to-a-fragment-identifier#answer-40815624
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'

import { CONTENT_TOP } from 'constants.js'


// file-level "global" variables, necessitated by MutationObserver's Api :(
let hashFragment = ''
let observer = null
let asyncTimerId = null

function reset() {
  hashFragment = ''
  if (observer !== null) observer.disconnect()
  if (asyncTimerId !== null) {
    window.clearTimeout(asyncTimerId)
    asyncTimerId = null
  }
}

function getElAndScroll() {
  const element = document.getElementById(hashFragment)
  if (element !== null) {
    element.scrollIntoView()
    window.scrollBy(0, -CONTENT_TOP) // offset to account for fixed navbar height
    reset()
    return true
  }
  return false
}

function scroll() {
  // Push onto callback queue so it runs after the DOM is updated
  window.setTimeout(() => {
    if (getElAndScroll() === false) {
      if (observer === null) {
        observer = new MutationObserver(getElAndScroll)
      }
      observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
      })
      // if the element doesn't show up in 10 seconds, stop checking
      asyncTimerId = window.setTimeout(() => {
        reset()
      }, 10000)
    }
  }, 0)
}


/**
 * ScrollIntoView
 *
 * Content wrapper to automatically scroll to an element id on page-load
 */
export class ScrollIntoView extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
  }

  constructor(props) {
    super(props)
    hashFragment = props.id
  }

  componentDidMount() {
    scroll()
  }

  componentDidUpdate() {
    scroll()
  }

  render() {
    return this.props.children || null
  }
}


/**
 * HashLink component for linking to anchor tag hash links
 *
 * Handles correctly scrolling to the element id on click
 */
export class HashLink extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        hash: PropTypes.string,
        state: PropTypes.object,
      }),
    ]),
  }

  handleClick = () => {
    reset()

    const { to } = this.props
    if (isString(to)) {
      hashFragment = to.split('#').slice(1)[0]
    } else if (isObject(to) && isString(to.hash)) {
      hashFragment = to.hash.slice(1)
    }

    if (hashFragment) {
      scroll()
    }
  }

  render() {
    const { children, ...props} = this.props
    return (
      <Link {...props} onClick={this.handleClick}>
        {children}
      </Link>
    )
  }
}

export default HashLink
