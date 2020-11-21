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
      <el-table-column prop="id" label="支队ID" width="65"></el-table-column>
      <el-table-column prop="name" label="支队名称"></el-table-column>
      <!-- <el-table-column prop="ip" label="IP网段" width="105"></el-table-column> -->
      <el-table-column prop="home_url" label="首页链接"></el-table-column>
      <el-table-column prop="background_url" label="背景图片">
        <template   slot-scope="scope">
          <img :src="scope.row.background_url"  min-width="220" height="70" />
        </template>
      </el-table-column>
      <el-table-column prop="standby_time" label="待机时长（秒）"></el-table-column>
      <el-table-column prop="banner_interval" label="图片幻灯片播放时长（秒）"></el-table-column>
      <el-table-column prop="is_enable" label="是否启用"  width="75">
        <template slot-scope="scope">{{ scope.row.is_enable == 1 ? '是': '否' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
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
        .get(this.$global_msg.host + "/troop/list", {
          headers: {
            token: sessionStorage.getItem("token")
          },
          params: {
            current: this.current,
            size: this.size
          }
        })
        .then(resp => {
          console.log("resp: ", resp.data);
          this.tableData = resp.data.troopList;
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
        .delete(this.$global_msg.host + "/troop/del?sys_id=" + row.id, {
          headers: {
            token: sessionStorage.getItem("token")
          }
        })
        .then(resp => {
          that.reload();
        });
      }
      if (i == 2) {
        // console.log("row.id: ", row.id);
        this.$router.push({ name: "troopEdit", params: { id: row.id } });
      }
    },
    handleSelectionChange() {},
    filterTag() {},
    //点击每个表格栏
    click(row, column, cell, event) {
      // alert("ddd");
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
