import request from '@/utils/request'
import $ from 'jquery'

export function login(userForm) {
  return request({
    url: '/user/login',
    method: 'post',
    data: $.param(userForm)
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getCode() {
  // 获取图片验证码
  return request({
    url: '/kaptcha/secode',
    method: 'get'
  })
}

export function changePSD(data) {
  // 修改密码
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data: $.param(data)
  })
}

export function loginUserName() {
  // 获取登录用户名
  return request({
    url: '/user/selectLoginUserName',
    method: 'post'
  })
}

export function listUserPermission() {
  // 获取登录用户权限列表
  return request({
    url: '/user/listUserPermission',
    method: 'post'
  })
}

export function loginOA() {
  // 获取oa
  return request({
    url: '/user/loginOA',
    method: 'post'
  })
}

export function checkScanStatus() {
  // 检查扫码状态
  return request({
    url: '/weixin/checkScanStatus',
    method: 'get'
  })
}

export function bindAccount(data) {
  // 绑定账号
  return request({
    url: '/weixin/bindAccount',
    method: 'post',
    params: data
  })
}
