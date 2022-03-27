import request from "@/api/request";

export function getGoodsDetailApi(id) {
  return request({
    url: "/detail",
    params: {
      iid: id
    }
  })
}

export function getRecommendApi(){
  return request({
    url: '/recommend'
  })
}

/**
 * 封装商品的复杂数据并初始化
 */
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.discount = itemInfo.discount;
    this.cloumns = columns;
    this.services = services;
    this.realPrice = itemInfo.lowNowPrice
  }
}

/**
 * 店铺信息
 */
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}

/**
 * 商品参数信息
 *
 */
export class GoodsParam {
  constructor(info, rule) {
    this.image = info.iamges ? info.iamges[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}

