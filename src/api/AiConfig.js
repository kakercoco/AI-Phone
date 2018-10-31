import request from '@/utils/request'
import $ from 'jquery'

export function listScene(data) {
  // 查询场景列表
  return request({
    url: '/aiConfig/listScene',
    method: 'post',
    data: $.param(data)
  })
}

export function listSceneSelect() {
  // 调用场景选择下拉框
  return request({
    url: '/aiConfig/listSceneSelect',
    method: 'post'
  })
}

export function insertScene(data) {
  // 新增场景
  return request({
    url: '/aiConfig/insertScene',
    method: 'post',
    data: $.param(data)
  })
}

export function updateScene(data) {
  // 修改场景
  return request({
    url: '/aiConfig/updateScene',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteScene(data) {
  // 删除场景
  return request({
    url: '/aiConfig/deleteScene',
    method: 'post',
    data: $.param(data)
  })
}

export function copyScene(data) {
  // 复制场景
  return request({
    url: '/aiConfig/copyScene',
    method: 'post',
    data: $.param(data)
  })
}

export function listKnowledge(data) {
  // 查询知识点基本信息
  return request({
    url: '/aiConfig/listKnowledge',
    method: 'post',
    data: $.param(data)
  })
}

export function selectKnowledge(data) {
  // 查询知识点详细信息
  return request({
    url: '/aiConfig/selectKnowledge',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteKnowledge(data) {
  // 删除知识点
  return request({
    url: '/aiConfig/deleteKnowledge',
    method: 'post',
    data: $.param(data)
  })
}

export function insertKnowledge(data) {
  // 新增知识点
  return request({
    url: '/aiConfig/insertKnowledge',
    method: 'post',
    data: data
  })
}

export function updateKnowledge(data) {
  // 修改知识点
  return request({
    url: '/aiConfig/updateKnowledge',
    method: 'post',
    data: data
  })
}

export function insertSceneNode(data) {
  // 新增场景节点
  return request({
    url: '/aiConfig/insertSceneNode',
    method: 'post',
    data: $.param(data)
  })
}

export function selectScene(data) {
  // 查询场景详情
  return request({
    url: '/aiConfig/selectScene',
    method: 'post',
    data: $.param(data)
  })
}

export function updateSceneNode(data) {
  // 修改场景节点
  return request({
    url: '/aiConfig/updateSceneNode',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteSceneNode(data) {
  // 删除场景节点
  return request({
    url: '/aiConfig/deleteSceneNode',
    method: 'post',
    data: $.param(data)
  })
}

export function insertSceneNodeProcessor(data) {
  // 添加场景节点流程
  return request({
    url: '/aiConfig/insertSceneNodeProcessor',
    method: 'post',
    data: $.param(data)
  })
}

export function updateSceneNodeProcessor(data) {
  // 修改场景节点流程
  return request({
    url: '/aiConfig/updateSceneNodeProcessor',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteSceneNodeProcessor(data) {
  // 删除场景节点流程
  return request({
    url: '/aiConfig/deleteSceneNodeProcessor',
    method: 'post',
    data: $.param(data)
  })
}

export function listResponseTags() {
  // 查询流程响应标签
  return request({
    url: '/constants/listResponseTags',
    method: 'get'
  })
}

export function listSceneNode(data) {
  // 查询场景节点列表
  return request({
    url: '/aiConfig/listSceneNode',
    method: 'post',
    data: $.param(data)
  })
}

export function listSceneNodeProcessor(data) {
  // 查询场景节点流程详情
  return request({
    url: '/aiConfig/listSceneNodeProcessor',
    method: 'post',
    data: $.param(data)
  })
}

export function publishScene(data) {
  // 发布场景
  return request({
    url: '/aiConfig/publishScene',
    method: 'post',
    data: $.param(data)
  })
}

export function selectSceneStatus(data) {
  // 获取发布场景信息
  return request({
    url: '/aiConfig/selectSceneStatus',
    method: 'post',
    data: $.param(data)
  })
}

export function listIntentState() {
  // 获取发布场景信息
  return request({
    url: 'constants/listIntentState',
    method: 'get'
  })
}

export function updateSceneNodeProcessorList(data) {
  // 修改场景节点流程集合
  return request({
    url: '/aiConfig/updateSceneNodeProcessorList',
    method: 'post',
    data: data
  })
}

export function listKnowledgeLearn(data) {
  // 查询学习列表
  return request({
    url: '/knowledgelearn/listKnowledgeLearn',
    method: 'post',
    data: $.param(data)
  })
}

export function knowledgeLearnIgnore(data) {
  // 忽略学习
  return request({
    url: '/knowledgelearn/knowledgeLearnIgnore',
    method: 'post',
    data: $.param(data)
  })
}

export function insertKnowledgeLearn(data) {
  // 学习新知识点
  return request({
    url: '/knowledgelearn/insertKnowledgeForLearn',
    method: 'post',
    data: data
  })
}

export function updateKnowledgeForLearn(data) {
  // 添加已有知识点
  return request({
    url: '/knowledgelearn/updateKnowledgeForLearn',
    method: 'post',
    data: data
  })
}

export function listKnowledgeClassify(data) {
  // 查询知识分类列表
  return request({
    url: '/knowledgeclassify/listKnowledgeClassify',
    method: 'post',
    data: $.param(data)
  })
}

export function insertKnowledgeClassify(data) {
  // 新增知识分类
  return request({
    url: '/knowledgeclassify/insertKnowledgeClassify',
    method: 'post',
    data: $.param(data)
  })
}

export function updateKnowledgeClassify(data) {
  // 根据ID修改知识分类
  return request({
    url: '/knowledgeclassify/updateKnowledgeClassify',
    method: 'post',
    data: $.param(data)
  })
}

export function deleteKnowledgeClassify(data) {
  // 删除知识分类
  return request({
    url: '/knowledgeclassify/deleteKnowledgeClassify',
    method: 'post',
    data: $.param(data)
  })
}

