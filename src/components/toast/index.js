import Toast from "@/components/toast/toast";

const obj = {};

obj.install = function (Vue){
  // 1.创建组件构造器
  const toastConstructor = Vue.extend(Toast);

  // 2.new的方式，根据组件构造器，可以创建出来一个组件对象
  const toast = new toastConstructor();

  // 3.将组件对象，手动挂载到一个元素上
  toast.$mount(document.createElement("div"))

  // 4.toast.$el对应的就是div
  document.body.appendChild(toast.$el);

  // 5.Vue中全局挂载
  Vue.prototype.$toast = toast;

}

export default obj;
