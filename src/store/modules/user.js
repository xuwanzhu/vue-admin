import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: { //类似于 data(){}
    token: getToken(),  /*使用getToken()获取到的就是存在cookie中的token，而用commit( 'SET_TOKEN'，?; data.token)也
    会操作SET_TOKEN()方法来把获取的cookie存在该token属性中，既然在Login异步方法中已经设置过了，
    这个地方设置的目的是保证store仓库中存储的token和cookie中的token保持一致，
    
    两个token在utils中的request.js中都有使用，（作判断）
    你看if (store .getters.token){config.headers[ ' token' ] = getToken()}，其中store.getterss .token取出store中的token，
    getToken( )取出cookie中的token*/

    name: '',
    avatar: '',
    buttons: [],
    roles: []
  },

  mutations: { //类似于 methods:{}
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => { //从语法上讲，Promise 是一个对象，它可以获取异步操作的消息,并且传入两个参数：resolve和reject，分别表示异步执行成功后的回调函数和异步执行失败后的回调函数；

        //成功，发起登录请求，请看src下api的login方法
        login(username, userInfo.password).then(response => {
          //debugger
          //获取后端传来的token
          const data = response.data
          //1将token存进cookie
          setToken(data.token)

          //2执行SET_TOKEN()方法，把token值放在上面store的state中的token属性中
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          //失败
          reject(error)
        })
      })
    },
    // Login({ commit }) {
    //   debugger
    //   const data = {
    //     'token': 'helen'
    //   }
    //   setToken(data.token)// 将token存储在cookie中
    //   commit('SET_TOKEN', data.token)
    // },

    // 获取用户信息
    async GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {  // return new Promise 做一些异步操作
        getInfo(state.token).then(response => {
          // debugger
          //response会返回name. avatar. roles. permissionValueList

          //debugger
          const data = response.data
          //debugger
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles) //把用户的角色存在state中的roles属性中
          } else {
            reject('getInfo: roles must be a non-null array !')//如果没有角色或报错
          }

          const buttonAuthList = [] ///把所有权限值都放在buttonAuthList数组中
          data.permissionValueList.forEach(button => {
            buttonAuthList.push(button)
          })

          //把用户名称、头像、权限数组都放在state中，这样我们就可以随处调用了
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_BUTTONS', buttonAuthList)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // GetInfo({ commit }) {
    //   debugger
    //   const data = {
    //     'roles': [
    //       'admin'
    //     ],
    //     'name': 'helen',
    //     'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-5670helen3b4acafe.gif'
    //   }
    //   if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //     commit('SET_ROLES', data.roles)
    //   }
    //   commit('SET_NAME', data.name)
    //   commit('SET_AVATAR', data.avatar)
    // },

    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          //debugger
          commit('SET_TOKEN', '')// 清空前端vuex store仓库中存储的token
          commit('SET_ROLES', [])// 清空前端vuex store仓库中存储的roles
          commit('SET_BUTTONS', [])  //清空前端vuex store仓库中存储的权限值列表
          removeToken()// 把token从cookie中清除
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        //debugger
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
