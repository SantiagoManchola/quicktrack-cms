import get from 'lodash/get'
import store from 'store2'

export default (to) => {
  const superAdmin = store('superAdmin')
  if (get(to, 'meta.requiresAuth') === true) {
    if (!superAdmin) {
      throw new Error('/auth')
    }
    const Company = store('Company')
    const roles = Company?.roles || []
    if (to.meta.roles && !to.meta.roles.some((role) => roles.includes(role))) {
      throw new Error('/auth')
    }
  }
}
