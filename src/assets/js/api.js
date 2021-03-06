import axios from 'axios';
// 测试
let baseApi = process.env.API_ROOT;
export {baseApi};
// 线上测试
// let baseApi = 'http://carbid.zertone2.com/app';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

const trans = params => {
    // Do whatever you want to transform the data
    let ret = ''
    for (let it in params) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
    }
    return ret ;
}
// get 请求
export const getReq = (api,params)=>{
    params.t = '4';
	params = trans(params);
	return axios.get(`${baseApi}${api}?${params}`).then(res=>res.data);
}
// post请求
export const postReq = (api,params)=>{
    params.t = '4';
	params = trans(params);
	return axios.post(`${baseApi}${api}`,params).then(res=>res.data);
}