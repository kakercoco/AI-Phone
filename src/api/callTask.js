import request from '@/utils/request'
import $ from 'jquery'

export function CallTaskList(data) {
  return request({
    url: '/callTask/listCallTask',
    method: 'post',
    data: $.param(data)
  })
}

export function selectTaskDetail(data) {
  return request({
    url: '/callTask/selectCallTaskDetail',
    method: 'post',
    data: $.param(data)
  })
}

export function listScene() {
  // 查询场景列表
  return request({
    url: '/aiConfig/listScene',
    method: 'post'
  })
}

export function listSceneSelect() {
  // 调用场景选择下拉框
  return request({
    url: '/aiConfig/listSceneSelect',
    method: 'post'
  })
}

export function selectTelephone() {
  // 外呼电话列表下拉框
  return request({
    url: '/telephone/selectTelephoneName',
    method: 'post'
  })
}

export function addTask(data) {
  // 新增呼叫任务
  return request({
    url: '/callTask/insertCallTask',
    method: 'post',
    data: $.param(data)
  })
}

export function updateTask(data) {
  // 修改呼叫任务
  return request({
    url: '/callTask/updateCallTask',
    method: 'post',
    data: $.param(data)
  })
}

export function insertContact(data) {
  // 为呼叫任务添加联系人
  return request({
    url: '/callTask/insertCallTaskContact',
    method: 'post',
    data: $.param(data)
  })
}

export function startAiCallTask(data) {
  // 手动启动ai呼叫任务
  return request({
    url: '/callTask/startAiCallTask',
    method: 'post',
    data: $.param(data)
  })
}

export function stopAiCallTask(data) {
  // 手动停止ai呼叫任务
  return request({
    url: '/callTask/stopAiCallTask',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteTaskContact(data) {
  // 删除呼叫任务中的联系人
  return request({
    url: '/callTask/deleteCallTaskContact',
    method: 'post',
    data: $.param(data)
  })
}

export function listTaskContact(data) {
  // 查询某个呼叫任务中的通话记录联系人列表
  return request({
    url: '/callTask/listCallTaskContact',
    method: 'post',
    data: $.param(data)
  })
}

export function phoneCalllDetail(data) {
  // 查询通话详情
  return request({
    url: '/callTask/selectPhoneCallDetail',
    method: 'post',
    data: $.param(data)
  })
}

export function selectCallDetailOption(data) {
  // 通话时长，通话轮次，意向等级统计图
  return request({
    url: '/callTask/selectCallDetailOption',
    method: 'post',
    data: $.param(data)
  })
}

export function selectConcernStatistics(data) {
  // 关注点列表
  return request({
    url: '/callTask/selectConcernStatistics',
    method: 'post',
    data: $.param(data)
  })
}

export function selectCallHistoryForConcern(data) {
  // 关注点查询通话记录
  return request({
    url: '/callTask/selectCallHistoryForConcern',
    method: 'post',
    data: $.param(data)
  })
}

export function importCustomer(data) {
  // 批量导入客户信息
  return request({
    url: '/callTask/importCallTaskCustomer',
    method: 'post',
    data: $.param(data)
  })
}

export function selectTaskStatistics(data) {
  // 查询某个呼叫任务中的通话记录的客户统计情况
  return request({
    url: '/callTask/selectCallTaskStatistics',
    method: 'post',
    data: $.param(data)
  })
}
export function selectHearingStatistics(data) {
  // 查询某个呼叫任务中的通话记录的客户统计情况
  return request({
    url: '/callTask/selectHearingStatistics',
    method: 'post',
    data: $.param(data)
  })
}

export function selectCallTaskDetailAndRate(data) {
  // 查询某个呼叫任务中的通话记录的客户统计情况
  return request({
    url: '/callTask/selectCallTaskDetailAndRate',
    method: 'post',
    data: $.param(data)
  })
}

export function callRecordsList(data) {
  // 通话记录列表
  return request({
    url: '/callhistory/callRecordsList',
    method: 'post',
    data: $.param(data)
  })
}

export function callHistoryDetail(data) {
  // 通话记录明细
  return request({
    url: '/callhistory/callHistoryDetail',
    method: 'post',
    data: $.param(data)
  })
}

export function listPhoneState() {
  // 查询通话状态常量
  return request({
    url: '/constants/listPhoneState',
    method: 'get'
  })
}

export function updateCustomerIntent(data) {
  // 更新意向等级
  return request({
    url: '/callhistory/updateCustomerIntent',
    method: 'post',
    data: $.param(data)
  })
}

export function updateFeedBack(data) {
  // 更新通话明细问题反馈
  return request({
    url: '/feedBack/insertFeedBack',
    method: 'post',
    data: $.param(data)
  })
}

export function downLoadCallHistory(data) {
  // 下载通话记录列表数据
  return request({
    url: '/callhistory/downLoadCallHistory',
    method: 'post',
    data: $.param(data)
  })
}

export function listCallState() {
  // 查询呼叫状态常量
  return request({
    url: '/constants/listCallState',
    method: 'get'
  })
}

export function listCallLength() {
  // 查询通话时长常量
  return request({
    url: '/constants/listCallLength',
    method: 'get'
  })
}

export function listDialogueAmount() {
  // 查询通话轮次常量
  return request({
    url: '/constants/listDialogueAmount',
    method: 'get'
  })
}

export function downLoadCallTaskHistory(data) {
  // 导出任务详情
  return request({
    url: '/callTask/downLoadCallTaskHistory',
    method: 'post',
    data: $.param(data, true)
  })
}
export function listExcelTask(data) {
  // 查询导入导出表
  return request({
    url: '/callTask/listExcelTask',
    method: 'post',
    data: $.param(data)
  })
}
