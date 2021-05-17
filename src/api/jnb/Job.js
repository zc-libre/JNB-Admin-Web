import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/api/jnb/admin/job/publish',
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: '/api/jnb/admin/job/list',
    method: 'post',
    data
  })
}

export function batchDel(data) {
  return request({
    url: '/api/jnb/admin/job/delete',
    method: 'delete',
    data
  })
}
export function detail(id) {
  return request({
    url: '/api/jnb/admin/job/detail/' + id,
    method: 'get'
  })
}
