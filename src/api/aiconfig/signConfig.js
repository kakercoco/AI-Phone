import request from '@/utils/request'
import $ from 'jquery'

/**
 * 查询签名列表
 * @param data
 */
export function listSignature(data) {
  return request({
    url: '/signature/listSignature',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 修改签名
 * @param data
 */
export function updateSignature(data) {
  return request({
    url: '/signature/updateSignature',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 新增签名
 * @param data
 */
export function insertSignature(data) {
  return request({
    url: '/signature/insertSignature',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 根据ID删除签名
 * @param data id
 */
export function deleteSignature(data) {
  return request({
    url: '/signature/deleteSignature',
    method: 'post',
    data: $.param(data)
  })
}
/**
 * 提交审核
 * @param data id
 */
export function updateSignatureStatus(data) {
  return request({
    url: '/signature/updateSignatureStatus',
    method: 'post',
    data: $.param(data)
  })
}
export { Signature }

class Signature {
  constructor(id, signName) {
    this.id = id
    this.signName = signName
    this.signStatus = {}
  }
}
