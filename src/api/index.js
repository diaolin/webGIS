
import axios from 'axios';
 
// axios.defaults.headers.post['Accept-Encoding'] = 'compress';
const instance = axios.create({
  timeout: 10000,
  // transformRequest: [function (data) {
  //   //依自己的需求对请求数据进行处理
  //   return JSON.stringify(data)
  // }],
  // transformResponse: [function (data) {
  //   let reader = new FileReader();
  //   reader.readAsText(data, 'GBK');
  //   reader.onload = function (e) {
  //   console.log(reader.result);
  // }
  //   return data;
  // }],
  // //  method:'GET',
  //  responseType: 'blob',
  // baseURL:"https://scsdhc.oicp.vip",
   headers: {
    // 'Accept-Encoding': 'utf-8',
    'Content-Type': "application/json;charset=UTF-8",
  },
 
});

const instanceget = axios.create({
  timeout: 10000,
   method:'GET',
   responseType: 'blob',
  // baseURL:"https://scsdhc.oicp.vip",
   headers: {
    'Content-Type': "application/zip;charset=utf-8"
  }
});
 
export default {
  userLogin ( data ) {
    return instance.post('/api/user/login', data);
  },
  allUser () {
    return instance.post('/api/user');
  },
  allProduct () {
   return instance.post('/api/product')
  },
  upload (data) {
    return instance.get('/api/geoserver/ows?service=WPS&version=1.0.0/intersection',data,{timeout:1000000})
  },
  regist (data){
    return instance.post('/api/geoserver/ows?service=WPS&version=1.0.0/intersection',data,{timeout:1000000})
  },
  download (data) {
    return instanceget.post('/api/geoserver/ows?service=WPS&version=1.0.0/intersection',data,{timeout:1000000})
  },
  exportShp (obj) {
    return instanceget.post(`/api/geoserver/Webgis92/wfs?service=wfs&request=GetFeature&version=1.1.0&outputFormat=application/json&TYPENAME=Webgis92:dltb&propertyName=${obj}`,'',{timeout:1000000})
  },
 
  // },
  // delete (data){
  //   return instance.delete('/api/values/delete',{params:data})
  // }
  
}