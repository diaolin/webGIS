import axios from "axios"
axios.defaults.withCredentials=true;
// const ConfigBaseURL = 'http://127.0.0.1:8080/';
const ConfigBaseURL = 'http://192.168.100.115:8080/';
// const ConfigBaseURL = 'http://192.168.100.115:8080/';

export function post(url, params, config) {
    let reurl = ConfigBaseURL+url;
    console.log("reurl",reurl);
    return new Promise((resolve, reject) => {
         axios.post(reurl, params, config)
        .then(res => {
            resolve(res.data);
        })
        .catch(err =>{
            reject(err.data);
        })
    });
}

