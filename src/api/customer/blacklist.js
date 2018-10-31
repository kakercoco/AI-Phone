import request from '@/utils/request'
import $ from 'jquery'

/**
 * 黑名单列表
 * @param data 传参
 */
export function listBlacklist(data) {
  return request({
    url: '/blacklist/listBlacklist',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 新增黑名单
 * @param data 传参
 */
export function insertBlacklist(data) {
  return request({
    url: '/blacklist/insertBlacklist',
    method: 'post',
    data: $.param(data, true)
  })
}

/**
 * 根据主键删除黑名单
 * @param data
 */
export function deleteBlacklist(data) {
  return request({
    url: '/blacklist/deleteBlacklist',
    method: 'post',
    data: $.param(data, true)
  })
}
