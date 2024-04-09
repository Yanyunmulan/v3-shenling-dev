import permission from './modules/permission'

export default {
  install(app) {
    app.directive('permission', permission)
  },
}
