import request from '@/utils/request'
import $ from 'jquery'

export function listDepartment() {
  // 查询部门列表
  return request({
    url: '/department/listDepartment',
    method: 'post'
  })
}

export function selectDepartmentByPrimaryKey(data) {
  //  查询部门信息(下拉框)
  return request({
    url: '/department/selectDepartmentByPrimaryKey',
    method: 'post',
    data: $.param(data)
  })
}

export function insertDepartmentUseGeneratedKeys(data) {
  //  新增部门使用自动生成主键
  return request({
    url: '/department/insertDepartmentUseGeneratedKeys',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteDepartmentPrimaryKey(data) {
  //  删除department
  return request({
    url: '/department/deleteDepartmentPrimaryKey',
    method: 'post',
    data: $.param(data)
  })
}

export function updateDepartmentByPrimaryKeySelective(data) {
  //  根据ID修改部门的非空信息
  return request({
    url: '/department/updateDepartmentByPrimaryKeySelective',
    method: 'post',
    data: $.param(data)
  })
}

export function listEmployee(data) {
  //  查询员工列表
  return request({
    url: '/employee/listEmployee',
    method: 'post',
    data: $.param(data)
  })
}

export function insertEmployeeUseGeneratedKeys(data) {
  //  新增员工使用自动生成主键
  return request({
    url: '/employee/insertEmployeeUseGeneratedKeys',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteEmployeeByPrimaryKeyList(data) {
  //  删除员工
  return request({
    url: '/employee/deleteEmployeeByPrimaryKeyList',
    method: 'post',
    data: $.param(data)
  })
}

export function updateEmployeeByPrimaryKeySelective(data) {
  //  根据ID修改员工的非空信息
  return request({
    url: '/employee/updateEmployeeByPrimaryKeySelective',
    method: 'post',
    data: $.param(data)
  })
}

export function selectRoleOption() {
  //  查询角色（下拉框）
  return request({
    url: '/role/selectRoleOption',
    method: 'post'
  })
}

export function assignRoleToEmployee(data) {
  //  分配角色给员工
  return request({
    url: '/employee/assignRoleToEmployee',
    method: 'post',
    data: $.param(data)
  })
}

export function changeEmployeeStatus(data) {
  //  员工状态修改
  return request({
    url: '/employee/changeEmployeeStatus',
    method: 'post',
    data: $.param(data)
  })
}
