import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

//请求地址白名单，在白名单中的地址可以直接发起请求，我们不会判断它
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist







//1、当路由发生改变前会调用beforeEach方法
router.beforeEach(async (to, from, next) => {



  // start progress bar
  //显示顶部加载进度条
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken() //getToken()可以取出cookie中的token

  //if是登录(只要通过login判断就会返回token，但是这个时候还没有用户信息和菜单栏，所以页面上不会有变化)，else是未登录(未登录不会有token)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      //如果去的路由是/login,也就是登录界面，那就执行下面的代码

      /*l if is logged in,redirect to the home page(如果已经登录，那就重定向到首页，然后router中的index.js中就可以看到访问/会被重定向
      到/dashboard)*/
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      //确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0  //store.getters.roles为vuex 父模块向子模块取值的方式
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          ////获取用户信息，返回的是一个Promise，访问/admin/acl/index/info，下一次我们在访问就有roles了，但是
          //下次访问可不是访问菜单，获取菜单在下面accessRoutes中进行

          const { roles } = await store.dispatch('GetInfo') //获取用户角色

          // generate accessible routes map based on roles
          ///执行generateRoutes()方法，看store-》 modules-》 permission.js中的该方法，这个方法中可以获取侧边栏上的菜单，或者说是用户的权限

          const accessRoutes = await store.dispatch('permission/generateRoutes', roles) //获取拼接好的路由

          // dynamically add accessible routes
          /*
            把创造的动态路由放入到已经有的路由中，这样动态路由和普通路由使用起来就没有区别了
            当我们登录之后，我们就具有了token，如果我们直接在地址栏中输入地址点击回车之后，这也是改变了路由，自然
          也会执行上面的beforeEach方法，但是我们只有使用this.$route.push()发送的路由才能用store仓库中的信息，所以
          hasRoles /null，因此我们会先获取去远程数据库获取用户信息和菜单数据，然后进行动态路由拼接，之后执行next({ ...to，replace: true })
          去拼接好的路由中找vue文件，如果没有对应的vue文件那就返回空白
            由于我们的路由信息是从后台拼接回来的，所以如果你只有课程路由而没有讲师路由，相等于你的router的
          index.js中是没有课程路由信息的，那你是无法找到对应的.vue文件的，这就真正实现了授权，所以通过后端的数据库数据进行了前端授权，
          进行权限限制
          */

          /*
          在addRoutes()之后第一次访问被添加的路由会白屏，这是因为刚刚addRoutes()就立刻访问被添加的路由，
          然而此时addRoutes()没有执行结束，因而找不到刚刚被添加的路由导致白屏。
          */
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true }) //使用next({ ...to, replace: true })来确保addRoutes()时动态添加的路由已经被完全加载上去
          /*按照来时的路由发起请求，例如/ dashboard和/login不匹配，来到这里执行了上面获取角色信息和拼接路由的方
法，这个地方会再次访问/dashboard路由*/

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('FedLogOut')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      //next(`/login?redirect=${to.path}`)
      next('/login') //登录首页路径地址
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
