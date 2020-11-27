<template>
  <div id="troopList">
    <el-table
      ref="singleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      border
      v-loading="loading"
      size="mini"
    >
      <el-table-column prop="id" label="管理员ID" width="75"></el-table-column>
      <el-table-column prop="name" label="管理员名称"></el-table-column>
      <!-- <el-table-column prop="avatar" label="头像">
        <template   slot-scope="scope">
          <img :src="scope.row.avatar"  min-width="220" height="70" />
        </template>
      </el-table-column> -->
      <el-table-column prop="troop_name" label="所属分队"></el-table-column>
      <el-table-column prop="is_super_admin" label="超级管理员">
        <template slot-scope="scope">{{ scope.row.is_super_admin == 1 ? '是': '否' }}</template>
      </el-table-column>
      <el-table-column prop="is_super_admin" label="管理员">
        <template slot-scope="scope">{{ scope.row.is_super_admin == 1 ? '是': '否' }}</template>
      </el-table-column>
      <el-table-column prop="is_enable" label="是否启用">
        <template slot-scope="scope">{{ scope.row.is_enable == 1 ? '是': '否' }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" prop="id">
          <el-button type="text" size="small" @click="handleClick(2, scope.row)">编辑</el-button>
          <el-button @click="handleClick(1, scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page="current"
      :hide-on-single-page="true"
      @current-change="currentChange"
      class="pagination"
    ></el-pagination>
  </div>
</template>


<script>
import axios from "axios";
import { mapMutations, mapState } from "vuex";
export default {
  computed: mapState(["isSuper"]),
  inject:['reload'],
  data() {
    return {
      belongTroop: "",
      tableData: [],
      current: 1, //当前页面
      size: 10, //每页显示条数
      total: 0,
      loading: false,
      formLabelWidth: "120px",
      formInline: {
        id: "",
        name: ""
      }
    };
  },
  created() {
    // 声命周期钩子函数
    this.troopList();
  },
  methods: {
    // 分页查询
    troopList() {
      axios
        .get(this.$global_msg.host + "/role/list", {
          headers: {
            token: sessionStorage.getItem("token")
          },
          params: {
            current: this.current,
            size: this.size
          }
        })
        .then(resp => {
          console.log("resp: ", resp);
          this.tableData = resp.data.roleList;
          this.current = resp.data.current;
          this.size = resp.data.size;
          this.total = resp.data.total;
        });
    },
    //操作栏处理函数
    handleClick(i, row) {
      if (i == 1) {
        const that = this;
        axios
        .delete(this.$global_msg.host + "/role/del?role_id=" + row.id, {
          headers: {
            token: sessionStorage.getItem("token")
          }
        }).then(resp => {
          that.reload();
        });
      }
      if (i == 2) {
        // console.log("row.id: ", row.id);
        this.$router.push({ name: "roleEdit", params: { id: row.id } });
      }
    },
    handleSelectionChange() {},
    filterTag() {},
    //点击每个表格栏
    click(row, column, cell, event) {
      console.log(row);
    },
    currentChange(current) {
      //跳转指定页面
      this.current = current;
      console.log(current);
      this.troopList();
    },
  }
};
</script>

<style scoped lang='scss'>
.pagination {
  margin-top: 20px;
}
.btn-color {
  background-color: #c62f2f;
}
</style>
