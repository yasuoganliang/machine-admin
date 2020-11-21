<template>
  <div id="bannerList">
    <div class="box-header">
      <div>
        <span>当前在线主机列表</span>
      </div>
    </div>
    <el-table
      ref="singleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      v-loading="loading"
      size="mini"
    >
      <el-table-column prop="ip" label="ipv4 地址"></el-table-column>
      <el-table-column prop="mac" label="MAC 地址"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import axios from "axios";
export default {
  //计算属性，监测vuex 数据
  computed: mapState(["adminId", "isSuper"]), //得到vuex 里面的用户信息
  created() {
    // 声命周期钩子函数, 用于获取部门，工作，学历列表
    if (this.adminId != null) {
      this.form.name = sessionStorage.getItem('admin_name');
      this.getConnect();
    }
  },
  data() {
    return {
      tableData: [],
      loading: false,
      form: {
        name: "",
      },
    };
  },
  methods: {
    getConnect () {
      let socket = this.$store.state.websock;
      console.log("socket: ", `ws:admin:${sessionStorage.getItem('sys_id')}`, socket);
      if (!!socket) {
        socket.on(`ws:admin:${sessionStorage.getItem('sys_id')}`, data => {
          console.log("data: ", data);
          this.tableData = data.clientList;
        });
      }
    }
  },
  handleSelectionChange() {
    console.log("handleSelectionChange");
  },
};
</script>

<style scoped lang='scss'>
#personList {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.box-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.pagination {
  margin-top: 20px;
}
.btn-color {
  background-color: #c62f2f;
}
</style>