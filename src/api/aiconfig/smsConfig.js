import request from '@/utils/request'
import $ from 'jquery'

/**
 * 查询短信模板列表
 * @param data templateName模板名称，pageNum ,pageSize
 */
export function listMessageTemplate(data) {
  return request({
    url: '/messagetemplate/listMessageTemplate',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 查询短信模板列表
 * @param data templateName模板名称，pageNum ,pageSize
 */
export function updateMessageTemplate(data) {
  return request({
    url: '/messagetemplate/updateMessageTemplate',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 新增短信模板
 * @param data
 */
export function insertMessageTemplate(data) {
  return request({
    url: '/messagetemplate/insertMessageTemplate',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 根据ID删除短信模板
 * @param data id
 */
export function deleteMessageTemplate(data) {
  return request({
    url: '/messagetemplate/deleteMessageTemplate',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 提交审核
 * @param data id
 */
export function updateMessageTemplateStatus(data) {
  return request({
    url: '/messagetemplate/updateMessageTemplateStatus',
    method: 'post',
    data: $.param(data)
  })
}
export { MessageTemplate }

class MessageTemplate {
  constructor(id, templateName, templateContent, templateDescription, signId) {
    this.id = id
    this.templateName = templateName
    this.templateContent = templateContent
    this.templateDescription = templateDescription
    this.signId = signId
    this.templateStatus = {}
    this.templateType = {}
  }
}
