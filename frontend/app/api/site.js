import { post } from 'utils/request'
import { v1 } from './versions'


export default class Site {
  static contact(payload) {
    return post(v1('/contact-submissions'), payload)
  }
}
