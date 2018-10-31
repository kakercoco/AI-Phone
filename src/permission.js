import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { loginUserName } from '@/api/login' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  loginUserName().then(res => {
    if (res.data.resultCode === 200) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      } else {
        if (store.state.user.roles.length <= 0) {
          store.dispatch('GetUserRole').then(res => {
            const roles = res.data.result
            store.dispatch('GetRole', roles).then(res => { // 拉取用户路由表
              router.addRoutes(store.state.user.addRouters) // 动态添加可访问路由表
              router.options.routes = router.options.routes.concat(store.state.user.addRouters)
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          }).catch((err) => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
        } else {
          next()
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next('/login')
        NProgress.done()
      }
    }
  })
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
