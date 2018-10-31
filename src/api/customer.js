import request from '@/utils/request'
import $ from 'jquery'

export function listCustomer(data) {
  // 查询客户列表
  return request({
    url: '/customer/listCustomer',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteCustomer(data) {
  // 删除客户信息
  return request({
    url: '/customer/deleteCustomer',
    method: 'post',
    data: $.param(data, true)
  })
}

export function insertCustomer(data) {
  // 新增客户
  return request({
    url: '/customer/insertCustomer',
    method: 'post',
    data: $.param(data, true)
  })
}

export function updateCustomer(data) {
  // 编辑客户
  return request({
    url: '/customer/updateCustomer',
    method: 'post',
    data: $.param(data, true)
  })
}

export function insertToCallTask(data) {
  // 添加到Ai外呼任务
  return request({
    url: '/customer/insertToCallTask',
    method: 'post',
    data: $.param(data, true)
  })
}

export function selectAiCallTaskName() {
  // 下拉框获取所有ai外呼任务
  return request({
    url: '/callTask/selectAiCallTaskName',
    method: 'post'
  })
}

export function downloadCustomer(data) {
  // 导出客户信息
  return request({
    url: '/customer/downloadCustomer',
    method: 'post',
    data: $.param(data)
  })
}
export function selectCustomer(data) {
  // 查询客户详情，包括跟进记录
  return request({
    url: '/customer/selectCustomer',
    method: 'post',
    data: $.param(data)
  })
}
class Customer {
  constructor() {
    this.id = null
    this.companyName = null
    this.contact = null
    this.createAt = null
    this.createBy = null
    this.customerIntent = null
    this.customerSource = null
    this.email = null
    this.followedNote = null
    this.followedPeriod = null
    this.lastCallTask = null
    this.lastContactStatus = null
    this.lastContactTime = null
    this.name = null
    this.note = null
    this.qq = null
    this.responsible = null
    this.wechat = null
  }
}
export { Customer }
