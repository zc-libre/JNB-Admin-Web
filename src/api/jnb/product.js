import request from '@/utils/request'

export function submit(data) {
  return request({
    url: '/api/jnb/admin/product/submit',
    method: 'post',
    data
  })
}
export function detail(type) {
  return request({
    url: '/api/jnb/admin/product/detail/' + type,
    method: 'get'
  })
}
