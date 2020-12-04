import axios from "axios"
axios.defaults.withCredentials=true;
// const ConfigBaseURL = 'http://127.0.0.1:8080/'
const ConfigBaseURL = 'http://192.168.100.115:8080/';
// const ConfigBaseURL = 'http://192.168.100.115:8080/';

export function dataget(url, params){
    let reurl = ConfigBaseURL+url;
    return new Promise((resolve, reject) =>{
        axios.get(reurl, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)
    })
});}