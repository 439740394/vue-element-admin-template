import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

const tokenExpireCode = 401

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

const service = axios.create({
  timeout: 5000
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // }
})

service.interceptors.request.use(
  config => {
    const data = config.data
    const params = config.params
    // 携带token
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    if (config.method === 'post' && data) {
      config.data = qs.stringify(data)
    }
    if (config.method === 'get') {
      if (params) {
        config.params.t = Date.now()
      } else {
        config.params = {
          t: Date.now()
        }
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    // 操作失败
    if (res.status !== 200 && res.status !== tokenExpireCode) {
      Message({
        message: res.msg || '操作失败',
        type: 'error',
        duration: 5 * 1000
      })

      // token过期
      if (res.status === tokenExpireCode) {
        // to re-login
        MessageBox.confirm('登录已过期，请重新登录！', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  response => {
    if (response && response.status) {
      const errorText = codeMessage[response.status] || response.statusText
      const { status, url } = response
      Notification({
        title: errorText,
        message: `请求错误 ${status}: ${url}`,
        type: 'error'
      })
    } else if (!response) {
      Notification({
        title: '网络错误',
        description: '您的网络异常，无法连接到服务器',
        type: 'error'
      })
    }
    return Promise.reject(response)
  }
)

export default service
