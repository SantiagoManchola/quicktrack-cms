import get from 'lodash/get'
import store from 'store2'

export default (to) => {
  if (get(to, 'meta.requiresAuth') === true) {
    const superAdmin = store('superAdmin')
    if (superAdmin) {
      return
    }
    throw new Error('/auth')
  }
}
