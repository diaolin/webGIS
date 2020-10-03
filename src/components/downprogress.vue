<template>
    <div>
        <el-progress v-if="downloading" :percentage="percentage" :color="colors" class="progress"  style="margin:0 30%;"></el-progress>
    </div>
</template>

<script>
    import axios from "axios"
    import {
        eventBus
    } from '../main'
    export default {
        components: {

        },
        created() {
            eventBus.$off("getpro");
            eventBus.$on('getpro', (message) => {
                this.data1 = message;
                this.postaxios();
                console.log("message", message);
                this.percentage = 0;
                console.log("this.downloading",this.downloading);
                // this.downloading = false;
                // this.fromBrother = message
            })
        },
        data() {
            return {
                percentage: 0,
                downloading: false,
                colors: [{
                        color: '#FEEA53',
                        percentage: 20
                    },
                    {
                        color: '#FCB852',
                        percentage: 40
                    },
                    {
                        color: '#52A1FC',
                        percentage: 60
                    },
                    {
                        color: '#50EDFC',
                        percentage: 80
                    },
                    {
                        color: '#5FFC77',
                        percentage: 100
                    }
                ],
                data1: ''
            }
        },
        mounted() {
        
        },
        methods: {
            postaxios() {
                this.downloading = false;
                this.percentage = 0;
                let url = 'dataManage/download.do';
                let formdata = this.data1;
                let that = this;
                // console.log("test",test.props);
                let ConfigBaseURL = 'http://192.168.100.115:8080/';
                // console.log("config",config);
                let reurl = ConfigBaseURL + url;
                this.downloading = true;
                axios({
                    // config,
                    method: 'POST',
                    url: reurl,
                    params: formdata,
                    responseType: 'blob',
                    onDownloadProgress: function (progress) {
                        console.log("progress", progress);
                        let num1 = progress.loaded;
                        let num2 = progress.currentTarget;
                        let num = progress.loaded / progress.total * 100;
                        console.log("num1", num1);
                        console.log("num2", progress.srcElement.getResponseHeader('content-length'));
                        console.log();
                        let num3 = (progress.loaded / progress.total * 100).toFixed(1) || 0;
                        that.percentage = Number(num3);
                    }
                }).then(response => {
                    console.log("response",response);
                    let blob = new Blob([response.data], {
                        type: 'application/zip'
                    });
                    let fileName1 = response.headers["content-disposition"] ? response.headers[
                        "content-disposition"].split(';')[1].split('=')[1] : "不存在";
                    let fileName = decodeURI(fileName1) //解码
                    if (window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(blob, fileName)
                    } else {
                        let link = document.createElement('a')
                        link.href = window.URL.createObjectURL(blob)
                        link.download = fileName
                        link.click()
                        //释放内存
                        window.URL.revokeObjectURL(link.href)
                    }
                     this.downloading = false;
                     this.percentage = 0;
                }).catch(error => console.log("fail"))
            }
        }
    }
</script>

<style>

</style>