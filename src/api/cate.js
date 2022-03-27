import request from "@/api/request";


export function getCategoriesApi() {
  return request({
    url: '/category'
  })
}

export function getSubCategoriesApi(maitKey) {
  return request({
    url: '/subcategory',
    params: {
      maitKey
    }
  })
}

export function getCategoryDetailApi(miniWallkey, type) {
  return request({
    url: '/subcategory/detail',
    params: {
      miniWallkey,
      type
    }
  })
}
