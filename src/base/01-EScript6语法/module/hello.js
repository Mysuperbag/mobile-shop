// 这个导出不能重命名
// export const  util = {
//     sum(a, b) {
//         return a + b;
//     }
// }
// export {util}

//导出后可以重命名
export default {
    sum(a,b){
        return a + b;
    }
}


//`export`不仅可以导出对象，一切JS变量都可以导出。比如：基本类型变量、函数、数组、对象。
