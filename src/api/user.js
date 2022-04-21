import request from '@/utils/request'

// 登录获取token
export function login(value) {
  return request({
    method: 'POST',
    url: '/api/back/user/login',
    data: value
  })
}

// 获取用户信息
export function getInfo(token) {

}

// 登出
export function logout() {
  return request({
    url: '/api/back/user/exit',
    method: 'POST'
  })
}
