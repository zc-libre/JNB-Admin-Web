import request from '@/utils/request'

export function count() {
  return request({
    url: '/api/jnb/admin/index/count/',
    method: 'get'
  })
}

