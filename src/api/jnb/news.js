import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/app',
    method: 'post',
    data
  })
}
