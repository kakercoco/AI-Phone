import request from '@/utils/request'
import $ from 'jquery'

export function listCallDetail(data) {
  // 查询统计信息表格
  return request({
    url: '/statistics/listCallDetail',
    method: 'post',
    data: $.param(data)
  })
}

export function selectCallLengthOption(data) {
  // 查询通话时长统计图
  return request({
    url: '/statistics/selectCallLengthOption',
    method: 'post',
    data: $.param(data)
  })
}

export function selectCallNumberOption(data) {
  // 查询通话数量统计图
  return request({
    url: '/statistics/selectCallNumberOption',
    method: 'post',
    data: $.param(data)
  })
}
