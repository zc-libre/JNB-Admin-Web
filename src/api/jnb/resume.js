import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/api/jnb/admin/resume/list',
    method: 'post',
    data
  })
}

export function batchDel(data) {
  return request({
    url: '/api/jnb/admin/resume/delete',
    method: 'delete',
    data
  })
}

export function status(data) {
  return request({
    url: '/api/jnb/admin/resume/status',
    method: 'post',
    data
  })
}
