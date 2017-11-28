import fetch from 'isomorphic-fetch'
import * as Cookies from 'js-cookie'
import { stringify } from 'query-string'

import { SERVER_URL } from 'config'


export function url(uri, queryParams) {
  const baseUrl = `${SERVER_URL}${uri}`
  return queryParams
    ? `${baseUrl}?${stringify(queryParams)}`
    : baseUrl
}

export function get(url, kwargs = {}) {
  const { token, ...options } = kwargs
  const defaults = {
    credentials: 'include',
    headers: Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, token ? { 'Authentication-Token': token } : {}),
    method: 'GET',
  }
  return request(url, _mergeOptions(defaults, options))
}

export function post(url, data, kwargs = {}) {
  const { token, ...options } = kwargs
  const defaults = {
    credentials: 'include',
    headers: Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrf_token'),
    }, token ? { 'Authentication-Token': token } : {}),
    method: 'POST',
    body: JSON.stringify(data),
  }
  return request(url, _mergeOptions(defaults, options))
}

export function put(url, data, options = {}) {
  return post(url, data, _setMethod(options, 'PUT'))
}

export function patch(url, data, options = {}) {
  return post(url, data, _setMethod(options, 'PATCH'))
}

export function delete_(url, options = {}) {
  return get(url, _setMethod(options, 'DELETE'))
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export function request(url, options) {
  return fetch(url, options)
    .then(_checkStatusAndParseJSON)
    .catch((e) => {
      return new Promise((_, reject) => {
        if (e.response) {
          reject(e)
        } else {
          // should only end up here if the backend has gone away
          e.response = {
            status: -1,
            statusText: e.message,
            error: e.message,
          }
          reject(e)
        }
      })
    })
}

// private functions -----------------------------------------------------------

function _checkStatusAndParseJSON(response) {
  return new Promise((resolve, reject) => {
    response.json()
      // response with json body
      .then((json) => {
        if (_checkStatus(response)) {
          // success response with json body
          resolve(json)
        } else {
          // error response with json error message
          reject(_responseError(response, json))
        }
      })
      // response with no body (response.json() raises SyntaxError)
      .catch(() => {
        if (_checkStatus(response)) {
          // success response with no body (most likely HTTP 204: No Content)
          resolve(null)
        } else {
          // error response, create generic error message from HTTP status
          reject(_responseError(response, { error: response.statusText }))
        }
      })
  })
}

function _mergeOptions(defaults, options) {
  return Object.assign({}, defaults, {
    ...options,
    headers: {
      ...defaults.headers,
      ...options.headers,
    }
  })
}

function _setMethod(options, method) {
  return Object.assign({}, options, { method })
}

function _checkStatus(response) {
  return response.status >= 200 && response.status < 300
}

function _responseError(response, json) {
  const error = new Error(response.statusText)
  error.response = Object.assign({
    status: response.status,
    statusText: response.statusText,
  }, json)
  return error
}

export default request
