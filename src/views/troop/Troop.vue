<template>
  <div id="userList">
    <!-- <div class="searchBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item label="员工号">
          <el-input v-model="formInline.id" placeholder="员工号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="search(1)" icon="el-icon-search"></el-button>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="search(2)" icon="el-icon-search"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="troopList">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="troopList">辞退选中</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      border
      v-loading="loading"
      size="mini"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="支队ID" width="65"></el-table-column>
      <el-table-column prop="name" label="支队名称"></el-table-column>
      <el-table-column prop="ip" label="IP网段" width="105"></el-table-column>
      <el-table-column prop="home_url" label="首页链接"></el-table-column>
      <el-table-column prop="background_url" label="背景图片">
        <template   slot-scope="scope">
          <img :src="scope.row.background_url"  min-width="220" height="70" />
        </template>
      </el-table-column>
      <el-table-column prop="standby_time" label="待机时长（秒）"></el-table-column>
      <el-table-column prop="banner_interval" label="图片幻灯片播放时长"></el-table-column>
      <el-table-column prop="is_enable" label="是否启用"  width="75">
        <template slot-scope="scope">{{ scope.row.is_enable == 1 ? '是': '否' }}</template>
      </el-table-column>
      <!-- <div class="avator">
        <el-avatar shape="square" :size="200" :src="background_url"></el-avatar>
      </div> -->
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <el-button @click="handleClick(1, scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleClick(2, scope.row)">编辑</el-button>
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
        .get(this.$global_msg.host + "troop/list", {
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
          this.tableData = resp.data.data.troopList;
          this.current = resp.data.data.current;
          this.size = resp.data.data.size;
          this.total = resp.data.data.total;
        });
    },
    //操作栏处理函数
    handleClick(i, row) {
      console.log("handleClick: ", row);
      if (i == 1) {
        this.$router.push({ path: "/troopInfo", params: { id: row.id } });
      }
      if (i == 2) {
        this.$router.push({ path: "/troopEdit/:id", params: { id: row.id } });
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
