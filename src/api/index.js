import request from '@/utils/request'

export function login(userForm) {
  var data = 'username=admin&password=123456'
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}
export function get(userForm) {
  return request({
    url: '/callhistory/callRecordsList',
    method: 'post'
  })
}

