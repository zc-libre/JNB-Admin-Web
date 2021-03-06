import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/api/jnb/admin/news/submit',
    method: 'post',
    data
  })
}
export function list(data) {
  return request({
    url: '/api/jnb/admin/news/list',
    method: 'post',
    data
  })
}

export function typeList() {
  return request({
    url: '/api/jnb/admin/news/type/list',
    method: 'get'
  })
}

export function detail(id) {
  return request({
    url: '/api/jnb/admin/news/detail/' + id,
    method: 'get'
  })
}

export function batchDel(data) {
  return request({
    url: '/api/jnb/admin/news/delete',
    method: 'delete',
    data
  })
}
