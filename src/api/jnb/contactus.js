import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/jnb/web/contact-us/submit',
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: '/api/jnb/admin/contact-us/list',
    method: 'post',
    data
  })
}

export function status(data) {
  return request({
    url: '/api/jnb/admin/contact-us/status',
    method: 'post',
    data
  })
}

export function count() {
  return request({
    url: '/api/jnb/admin/contact-us/count/',
    method: 'get'
  })
}

export function batchDel(data) {
  return request({
    url: '/api/jnb/admin/contact-us/delete',
    method: 'delete',
    data
  })
}
