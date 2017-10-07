import { post } from 'utils/request'
import { v1 } from 'api'


export default class Site {
  /**
   * @param {string} name
   * @param {string} email
   * @param {string} message
   */
  static contact({ name, email, message }) {
    return post(v1('/contact-submissions'), { name, email, message })
  }
}
