<template>
  <div>
    <div class="about">基于c/s架构的一体机管理系统。</div>
    <h3>前端技术栈:</h3>
    <ul>
      <li>html/css/js</li>
      <li>vue/vuex/vue router</li>
      <li>electron</li>
    </ul>
    <h3>后端技术栈:</h3>
    <ul>
      <li>nodejs</li>
      <li>express</li>
      <li>websocket</li>
      <li>mysql</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activities: [
        {
          content: "支持使用图标",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          icon: "el-icon-more"
        },
        {
          content: "支持自定义颜色",
          timestamp: "2018-04-03 20:46",
          color: "#0bbd87"
        },
        {
          content: "支持自定义尺寸",
          timestamp: "2018-04-03 20:46",
          size: "large"
        },
        {
          content: "默认样式的节点",
          timestamp: "2018-04-03 20:46"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>