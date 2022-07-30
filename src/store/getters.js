const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  buttons: state => state.user.buttons,
  roles: state => state.user.roles, //获取所有用户角色  //state.user.roles为vuex 父模块向子模块取值的方式
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters
