import Cookies from 'js-cookie'
import request from './request'

const TokenKey = 'Admin-Token' //cookie中存储的token名称

//获取token中的token
export function getToken () {
  return Cookies.get(TokenKey)
}

//把token存进cookie
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

//从cookie中移除token
export function removeToken () {
  return Cookies.remove(TokenKey)
}

