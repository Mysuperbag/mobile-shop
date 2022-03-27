import Vue from 'vue';
import VueRouter from 'vue-router';


//1.安装路由插件
Vue.use(VueRouter);


const routes = [
  //路由重定向
  {
    path: '/',
    redirect: '/home'
  },
  //路由跳转
  {
    path: "/home",
    component: () => import('@/views/modules/home/home')
  },
  {
    path: "/category",
    component: () => import('@/views/modules/cate/cate'),
  },
  {
    path: "/cart",
    component: () => import('@/views/modules/cart/cart')
  },
  {
    path: "/profile",
    component: () => import('@/views/modules/profile/profile')
  },
  //路由跳转并且带参数
  {
    path: "/goods/:id",
    component: () => import('@/views/modules/goods/goods-detail')
  },
  //通配符，配置路由没有找到后跳转的页面
  {
    path: "*" ,
    component: () => import('@/views/page/404')
  }
];


//2.创建路由对象
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//3. 解决重复点击路由报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

//4.导出路由
export default router;
