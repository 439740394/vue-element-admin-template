import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const USERINFO = 'USERINFO'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  const userInfo = Cookies.get(USERINFO)
  return userInfo ? JSON.parse(userInfo) : userInfo
}

export function removeUserInfo() {
  return Cookies.remove(USERINFO)
}

export function setUserInfo(userInfo) {
  return Cookies.set(USERINFO, userInfo, { expires: 7 })
}
