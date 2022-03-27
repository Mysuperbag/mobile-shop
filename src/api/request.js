import axios from "axios";

export default function request(option) {
  return new Promise((resolve, reject) => {

    //1. 初始化 axios 实例
    const http = axios.create({
      baseURL: 'http://152.136.185.210:7878/api/hy66',
      timeout: 5000
    })

    //2. 配置 axios 请求
    http.interceptors.request.use(config => {
      return config;
    }, error => {
      return error;
    })

    //3. 配置 axios 拦截
    http.interceptors.response.use(res => {
      return res.data;
    }, error => {
      return error
    })

    //4. 封装 axios 网络请求
    http(option).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err)
    })
  })

}
