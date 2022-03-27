import http from '@/api/request';

export function getHomeDataApi() {
  return http({
    url: '/home/multidata'
  })
}


export function getHomeGoodsApi(type, page) {
  return http({
    url: '/home/data',
    params: {
      type, page
    }
  })
}
