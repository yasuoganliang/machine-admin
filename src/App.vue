<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide (){
     return {
       reload:this.reload
     }
  },
  data(){
    return {
       isRouterAlive:true
    }
  },
  methods:{
    reload (){
       this.isRouterAlive = false
       this.$nextTick(function(){
          this.isRouterAlive = true
       })
    }
  },
  components:{
  },
};
</script>

<style >
  .el-upload-list--picture-card .el-upload-list__item{
    border:none !important;
  }
  .el-upload-list__item-thumbnail{
    height: auto !important;
  }
.el-form-item__content img{
    height: auto !important;
  }
</style>