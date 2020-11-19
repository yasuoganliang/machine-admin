<template>
  <div id="storyList">
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
      <el-table-column prop="id" label="ID" width="65"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <!-- <el-table-column prop="ip" label="IP网段" width="105"></el-table-column> -->
      <el-table-column prop="pic_url" label="图片">
        <template   slot-scope="scope">
          <img :src="scope.row.pic_url"  min-width="220" height="70" />
        </template>
      </el-table-column>
      <el-table-column prop="brief" label="简介"></el-table-column>
      <el-table-column prop="details" label="详情"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
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
        .get(this.$global_msg.host + "story/list", {
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
          this.tableData = resp.data.storyList;
        });
    },
    //操作栏处理函数
    handleClick(i, row) {
      if (i == 1) {
        const that = this;
        axios
        .delete(this.$global_msg.host + "story/del?story_id=" + row.id, {
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
        this.$router.push({ name: "storyEdit", params: { id: row.id } });
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
