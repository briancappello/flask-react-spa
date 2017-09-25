import { url } from 'utils/request'


export function v1(uri, queryParams) {
  return url(`/api/v1${uri}`, queryParams)
}
