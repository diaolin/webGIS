<template>
    <div>
        <div class="container">
            <div class="selcounty">
                <span class="county">请选择所在区县：</span>
                <el-cascader
                    placeholder="可输入关键词搜索"
                    :options="optionscounty"
                    filterable v-model="countyValue" @change="clickvalue"></el-cascader>
                <span class="type">请选择数据类型：</span>
                <el-cascader
                    placeholder="可输入关键词搜索"
                    :options="optionsdatatype"
                    filterable v-model="dataValue" @change="clickdata"></el-cascader>
                <span class="selyear">请选择年份：</span>
                <el-date-picker
                    v-model="value3"
                    type="year"
                    placeholder="选择年" @change="clickyear"></el-date-picker>
            </div>
            
        </div>
        <div class="upload">
            <div class="uploadFile">
                <!-- <el-upload
                    class="upload-demo"
                    ref="upload"
                    accept=".zip"
                    action=""
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
                </el-upload> -->
                <el-upload
                    class="upload-demo"
                    action=""
                    :file-list="value"
                    ref="uploadFile"
                    :on-preview="handlePreview"
                    name="classZip"
                    accept=".zip"
                    :on-remove="handleRemove"
                    :on-error="handleError"
                    :on-success="handleSuccess"
                    multiple 
                    :on-exceed="handleExceed"
                    :limit="1"
                    :on-change="handleChange"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary" >选择文件</el-button>
                    <el-button type="success" size="small"
                    @click="submitUpload" id="changeFileList" style="margin-left: 10px;">上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传.zip文件</div>
                    <!-- <span slot="tip" class="el-upload__tip" style="color: red;width:200px;">{{message}}</span> -->
                </el-upload>
                <el-progress v-if="loading" :percentage="percentage" :color="colors" class="progress" style="margin:0 30%;"></el-progress>
                <el-button class="download" size="small" type="primary" @click="downLoad">下载文件</el-button>
                <!-- <el-progress v-if="downloading" :percentage="downpercentage" :color="colors" class="progress" ref="progress"></el-progress> -->
                    <div><downpro/></div>
            </div>
        </div>
        
        </div>
</template>

<script>
// import county_select from './countySelect.vue'
// import JsZip from 'jszip'

import {axios} from "axios"
import {post} from '../api/post.js'
import {dataget} from '../api/get.js'
import {postaxios} from "../api/request.js"
import downpro from "./downprogress.vue"
import { eventBus } from '../main'
// import test from "../api/request.js"
// import {testaxios} from "axios.js"

let id = 1000;

export default {
    components: {
        downpro
    },
    props:{
        
        value: {
            // type: Array,
            default () {
            return [];
            }
      },
    },
    watch: {
      visible(value) {
        if (value) {
            console.log("empty");
        } else {
          clearInterval(this.interval);
          this.loading = false;
        }
      }
    },
    data() {
        return {
            downloading:false,
            downpercentage:0,
            loading: false,
            percentage:0,
            interval:0,//加载的定时
            colors:[
                {color: '#FEEA53', percentage: 20},
                {color: '#FCB852', percentage: 40},
                {color: '#52A1FC', percentage: 60},
                {color: '#50EDFC', percentage: 80},
                {color: '#5FFC77', percentage: 100}
            ],
            sunmitShow:false,
            // helloTaskId:'',
            imgFlag: false,
            message:'',
            Wordmessage:'', //输入不能为空提示
            fileNmae:'',
            wordFlag:false,
            dataTree:[],
            optionscounty:[],
            optionsdatatype:[],
            uploadFile:'',
            countyValue:[],
            value3:'',
            yearValue:'',
            dataValue:'',
            defaultProps: {
            children: 'children',
            label: 'label',
            countyCode:'',
            tempArr:[],
            formData:'',
            // percent:'',
            // submitFlag:false,
            }
        }
    },
    mounted(){
        this.requestCounty();
        this.requestDataType();
    },
    methods:{
        clickvalue () {
            this.countyCode = this.countyValue[2];
            console.log("this.countyValue",this.countyValue)
        },
        clickdata(){
            console.log("this.dataValue",this.dataValue);
        },
        clickyear() {
            let str = String(this.value3);
            this.yearValue = str.substring(11,15);
        },
        requestDataType(){
            let that = this;
            dataget("dataManage/getTree.do",'').then(res=>{ 
                for(let i in res.data){
                    let arr2 = [];
                    let obj1 = {
                        // id:i,
                        label:res.data[i].data.name,
                        children:res.data[i].children
                    };
                    // console.log("obj1",obj1);
                    for(let j in obj1.children){
                        let arr3 = [];
                        let obj2 = {
                            // id:j,
                            label:obj1.children[j].data.name,
                            children:obj1.children[j].children
                        };
                        arr2.push(obj2);
                        // for(let k in obj2[j].children){
                        //     let obj3 = {
                        //         // id:i,
                        //         label:obj1.children[j].data.name,
                        //         children:obj1.children[j].children
                        //     };
                        //     arr3.push(obj3);
                        // }
                        // let obj22 = {
                        //     label:obj1.children[j].data.name,
                        //     children:arr3
                        // }
                        // arr2.push(obj22);
                    }
                    let obj12 = {
                        label:res.data[i].data.name,
                        children:arr2
                    }
                    that.optionsdatatype.push(obj12);
                }
            }).catch(err=>{
                console.log("失败");
            });
        },
        requestCounty() {
            let that = this;
            dataget("commom/getCityTree.do",'').then(res=>{  
            // console.log("dizhi",res);
                if(res.code === 0){
                    that.optionscounty = res.data;
                } else {
                    that.$router.push({//你需要接受路由的参数再跳转
                        path: '/login'
                    });
                }
            }).catch(err=>{
            console.log("失败");
            });
        },
        handleChange(file, fileList) {
            this.uploadFile = file.raw;
        },
      
        handleExceed(files,fileList){
            this.$message({
                showClose: true,
                message: '只允许上传一个文件',
                type: 'warning'
            });
        },
        handleError(err, file, fileList){
            this.message="上传失败";
        },
        handleSuccess(response, file, fileList){
            this.message="上传成功";
        },
        submitUpload() {
            let fileObject = this.uploadFile;
            console.log("fileObject",fileObject);
            console.log("this.countyCode",this.countyCode);
            console.log("this.yearValue",this.yearValue);
            this.formData = new FormData();
            this.formData.append("dm", this.countyCode);
            this.formData.append("year", this.yearValue);
            this.formData.append("typeId", 235);
            this.formData.append("file", fileObject);
            this.uploadingFile = fileObject;
            let config = {
                onUploadProgress: progressEvent => {
                    let num = (progressEvent.loaded / progressEvent.total * 100).toFixed(1) || 0;
                    this.percentage = Number(num);
                }
            }
            let that = this;
            if(this.countyCode !== '' && this.yearValue !== ''){
                this.loading = true;
                post('dataManage/upload.do', this.formData, config).then(res=>{  
                    if(res.code === 0){
                        this.$message({
                            type: 'success',
                            message: '上传解析成功',
                        });
                        this.uploadingFile.status = 'success';
                    } else if(res.code === 1){
                        console.log("res",res);
                        let msg = '';
                        for(let i in res.data){
                            msg += res.data[i]+'</br>';
                        }
                        this.$alert(msg, '缺少以下文件', {
                            confirmButtonText: '确定',
                            dangerouslyUseHTMLString:true,
                            callback: action => {
                                // this.$message({
                                // type: 'info',
                                // // message: `action: ${ msg }`
                                // });
                            }
                        });
                    }
                }).catch(err=>{
                    console.log("失败");
                });
            } else {
                this.$message({
                    showClose: true,
                    message: '请先选择区县和年份',
                    type: 'warning'
                });
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList,"删除");
            this.loading = false;
            this.percentage = 0;
        },
        handlePreview(file) {
            console.log(file,"已上传的文件时的钩子");
        },
        append(data) {
            const newChild = { id: id++, label: 'testtest', children: [] };
            if (!data.children) {
            this.$set(data, 'children', []);
            }
            data.children.push(newChild);
        },

        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },

        renderContent(h, { node, data, store }) {
            return (
            <span class="custom-tree-node">
                <span>{node.label}</span>
                <span>
                <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
                <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
                </span>
            </span>);
        },
        downLoad(){
            this.downpercentage = 0;
            const data ={
                dm: this.countyCode,
                year:this.yearValue,
                typeId:235
            }
            if(this.countyCode !== '' && this.yearValue !== ''){
                let that = this;
                // that.test(data);
                 eventBus.$emit("getpro",data);
                // eventBus.$emit("getpro",postaxios('dataManage/download.do', data, config));
                // postaxios('dataManage/download.do', data, config);
            } else {
                this.$message({
                    showClose: true,
                    message: '请先选择区县和年份',
                    type: 'warning'
                });
            }
        }
    }
}
</script>

<style>
    /* .type{
        margin-left: 5%;
    } */

    .uploadFile{
       margin-top: 3%;
       /* text-align: center; */
      
    }
    .upload-demo{
         
    }
    .container{
        margin-top: 5%;
    }
    .selcounty{
        text-align: center;
        width: 100%;
    }
   .type,.selyear{
       margin-left:2%;
   }
   .download{
       margin-top:10%;
   }
   .upload{
       /* text-align: center; */
   }
</style>