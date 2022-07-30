import { constantRoutes } from '@/router'
import { getMenu } from '@/api/login'
import Layout from '@/views/layout/Layout'

///处理后端返回的菜单拼接而成的路由信息，生成动态路由，其中asyncRouterWap就是包含一级父路由的List列表
function filterAsyncRouter (asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  try {
    /*首次遍历iroute就是一级父路由，里面包含children，children放着二级菜单和三级按钮;等会遍历一级父路由中的二级菜单和三级按钮子路由的时候，
    route就是二级菜单和三级按钮子路由，另外二级菜单和三级按钮子路由没有children*/
    const accessedRouters = asyncRouterMap.filter(route => {
      if (route.component) { //l / route .component取出vue组件地址，例如/edu/teacher/save
        if (route.component === 'Layout') { // Layout组件特殊处理,这是一级父路由组件，比如权限管理、讲师管理等等
          route.component = Layout
        } else {
          ///一级父路由后面的component都是' Layout'，下面一般用于二级菜单和三级按钮子路由
          const component = route.component
          route.component = resolve => {
            require(['@/views' + component + '.vue'], resolve)
          }
        }
      }

      //ll filterAsyncRouter(route.children)用于遍历二级菜单和三级按钮子路由，并且二级菜单和三级按钮子路由中没有children
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    })
    /*无论是一级菜单父路由，还是二级菜单或者三级按钮子路由，上面的操作每个路由的component值，让component从字符串指向了真实的.vue文件，
    其他的path、name.meta中的title和icon还是使用后端传过来的数据就好*/
    return accessedRouters
    //经过上面的操作，就把例如课程路由拼出来了，相当于：router中的那些东西

  } catch (e) {
    console.log(e)
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

/*
// vue中store状态管理，通过actions调用 mutations 中封装的方法来实现对于state更改，
// 这里是vue-element-admin中动态路由的主要判断逻辑发生地方，首先判定用户角色是否包含admin（可能多角色），
是则将所有asyncRoutes 加入到constantRoutes，若用户角色没有包含admin，则调用filterAsyncRoutes函数，
递归地判定asyncRoutes.roles属性是否有该角色，即是否有权限，将有权限的router赋值accessedRoutes 后加入到constantRoutes；
*/
const actions = {
  async generateRoutes ({ commit }, roles) {
    // 取后台路由

    const asyncRouter = await getMenu()

    return new Promise(resolve => {
      /*ll permissionList中放着所有的一级父路由，一级父路由中有children，children中放着二级菜单和三级按钮变化的子路由，
      二级菜单和三级按钮变化的子路由中都没有children*/
      const tmp = asyncRouter.data.permissionList
      //对路由进行处理，生成动态路由
      const accessedRoutes = filterAsyncRouter(tmp)

      commit('SET_ROUTES', accessedRoutes) //将拼接好的路由放进store中
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
