import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()

  // 设置title
  document.title = getPageTitle(to.meta.title)

  // 获取token
  const hasToken = getToken()

  // token存在
  if (hasToken) {
    // 登录页直接跳到首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 不在登录页直接判断是否有异步路由表
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 根据token获取角色
          const roles = await store.dispatch('user/getInfo')

          // 根据角色筛选异步路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 添加异步路由信息
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || '出错了')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
