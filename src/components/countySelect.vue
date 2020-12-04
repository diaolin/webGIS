<template>
    <div class="block">
    <!-- <span class="county">请选择所在区县：</span> -->
    <!-- <el-cascader
        placeholder="可输入关键词搜索"
        :options="optionscounty"
        filterable></el-cascader>
    <span class="type">请选择数据类型：</span> -->
    <span class="iconfont icon-quxianguanliicon-" style="margin:10px;font-size:16px;"></span>
    <el-cascader
        v-if="options"
        placeholder="可输入关键词搜索"
        :options="options"
        class="qxinput"
        v-model ="countyValue" @change="clickvalue"></el-cascader>
    <!-- <el-button type="primary" plain id="search">查询</el-button> -->
    </div>
</template>

<script>
import {dataget} from '../api/get'
import {
    eventBus
  } from '../main'
  export default {
    data() {
      return {
        optionscounty:[],
        options: [],
        countyValue:[]
      };
    },
    mounted() {
      this.countyValue = ['51','5116','511681']
      this.requestData();
    },
    watch:{
      countyValue(){
        eventBus.$emit("countyValue", this.countyValue)
      }
    },
    methods:{
      requestData() {
        let that = this;
        dataget("commom/getCityTree.do",'').then(res=>{  
          console.log("dizhi",res);
          that.options = res.data;
        }).catch(err=>{
          this.$message.error('请求区县失败');
        });
      },
      clickvalue(value){
        // eventBus.$emit("countyValue", value)
      }
    }
  }
</script>

<style>
    .block{
      /* text-align: center; */
    }
    #search{
      margin:10px;
    }
    .type{
      margin-left:10px;
    }
    .qxinput .el-input__inner{
      background:#DBF1FD;
      border: 1px solid white;
    }
</style>