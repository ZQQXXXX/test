//全局配置
import axios from 'axios';
import qs from 'qs';
import store from 'store2';

const apiURL='http://47.101.141.228:3000/';
const imgURL='http://47.101.141.228:3000/';

// const apiURL='http://47.101.141.228:3000/';
// const imgURL='http://47.101.141.228:3000/';

// const apiURL='http://122.112.235.125:3000';
// const imgURL='http://122.112.235.125:3000';

axios.defaults.baseURL=apiURL;
//解决cookie跨域
axios.defaults.withCredentials=true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest=function(data,header){
    return qs.stringify(data)
}

export default {
    install(Vue,options){
        Vue.prototype.apiURL=apiURL;
        Vue.prototype.imgURL=imgURL;
        Vue.prototype.axios=axios;
        Vue.prototype.store=store;
    }
}