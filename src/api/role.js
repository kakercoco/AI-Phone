import request from '@/utils/request'
import $ from 'jquery'

export function listRole(data) {
  // 查询角色列表
  return request({
    url: '/role/listRole',
    method: 'post',
    data: $.param(data)
  })
}

export function insertRoleUseGeneratedKeys(data) {
  // 新增Role使用自动生成主键
  return request({
    url: '/role/insertRoleUseGeneratedKeys',
    method: 'post',
    data: $.param(data)
  })
}

export function updateRoleByPrimaryKeySelective(data) {
  // 根据ID修改角色的非空信息
  return request({
    url: '/role/updateRoleByPrimaryKeySelective',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteRoleByPrimaryKey(data) {
  // 删除角色
  return request({
    url: '/role/deleteRoleByPrimaryKey',
    method: 'post',
    data: $.param(data)
  })
}

export function listRolePermission(data) {
  // 查询角色权限
  return request({
    url: '/role/listRolePermission',
    method: 'post',
    data: $.param(data)
  })
}

export function assignPermissionToRole(data) {
  // 为角色分配权限
  return request({
    url: '/role/assignPermissionToRole',
    method: 'post',
    data: $.param(data, true)
  })
}
