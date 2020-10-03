import axios from "axios"
import test from "../components/data_manage.vue"
import  {eventBus}  from '../main'
//  axios.defaults.withCredentials=true;
 const ConfigBaseURL = 'http://192.168.100.115:8080/';

//  const ConfigBaseURL = 'http://192.168.100.115:8080/';
 export function postaxios(url,formdata,config){
  console.log("test",test.props);
    console.log("config",config);
    let reurl = ConfigBaseURL+url;
    axios({
        config,
        method: 'POST',
        url: reurl,
        params:formdata,
        responseType: 'blob',
        onDownloadProgress: function (progress) {
          // console.log("progress",progress);
          // let num1 = progress.loaded;
          // let num2 = progress.currentTarget;
          // let num =progress.loaded / progress.total * 100;
          // console.log("num1",num1);
          // console.log("num2",progress.srcElement.getResponseHeader('content-length'));
          // console.log();
          // let downpercentage = Math.round(progress.loaded / progress.total * 100) + '%';
          // eventBus.$emit("getpro",downpercentage);
          // return num1;
        }
    }).then(response => {
        console.log("response",response.data);
        console.log("response",response.data.size);
        let blob = new Blob([response.data], {type: 'application/zip'});
        // let url = window.URL.createObjectURL(blob);
        let fileName1 = response.headers["content-disposition"] ? response.headers["content-disposition"].split(';')[1].split('=')[1] : "不存在";
        let fileName = decodeURI(fileName1)//解码
        // const link = document.createElement('a'); // 创建a标签
        // link.href = url;
        // link.download = fileName; // 重命名文件
        // link.click();
        // URL.revokeObjectURL(url) ;// 释放内存
        // console.log("window.navigator.msSaveOrOpenBlob",window.navigator);
        // window.navigator.msSaveOrOpenBlob(blob, fileName);
        if (window.navigator.msSaveOrOpenBlob) {
            // console.log("dsjvgbdfh")
            navigator.msSaveBlob(blob, fileName)
          } else {
            // console.log(3)
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            //释放内存
            window.URL.revokeObjectURL(link.href)
          }
    }).catch(error => console.log("fail"))

    // return postaxios.axios;
}