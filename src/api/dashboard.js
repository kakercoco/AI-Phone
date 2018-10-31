import request from '@/utils/request'

export function selectHomepageStatistics() {
  return request({
    url: '/homepage/selectHomepageStatistics',
    method: 'post'
  })
}
export function selectHomepageOption() {
  return request({
    url: '/homepage/selectHomepageOption',
    method: 'post'
  })
}
export function listHomepageCallHistory() {
  return request({
    url: '/homepage/listHomepageCallHistory',
    method: 'post'
  })
}
export function listHomepageKnowledgeLearn() {
  return request({
    url: '/homepage/listHomepageKnowledgeLearn',
    method: 'post'
  })
}
