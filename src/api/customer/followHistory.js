import request from '@/utils/request'
import $ from 'jquery'

class FollowHistory {
  constructor() {
    this.id = null
    this.createAt = null
    this.createBy = null
    this.customerId = null
    this.employeeId = null
    this.followDescription = null
    this.followEvent = null
    this.followMode = null
    this.followTime = null
    this.modifyAt = null
    this.modifyBy = null
  }
}
export { FollowHistory }

/**
 * 黑名单列表
 * @param data 传参
 */
export function insertFollowHistory(data) {
  return request({
    url: '/followhistory/insertFollowHistory',
    method: 'post',
    data: $.param(data)
  })
}
