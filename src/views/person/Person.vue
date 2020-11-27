<template>
  <div id="personList">
    <div class="box-header">
      <div>
        <span style="margin-right: 10px">官兵列表</span>
        <el-select v-model="sys_id" placeholder="选择分队" size="mini" @change="selectSuccess" v-if="this.isSuper">
          <el-option
            v-for="(troop, index) in troops"
            :label="troop.name"
            :value="troop.id"
            :key="index"
          ></el-option>
        </el-select>
      </div>
      
      <div class="searchBar">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="search()" icon="el-icon-search"></el-button>
        </el-form-item>
        <el-form-item label="入伍年份">
          <el-input v-model="formInline.enlist_year" placeholder="入伍年份"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="search()" icon="el-icon-search"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="personList">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
      <div>
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="jumpTo()">添加</el-button>
      </div>
    </div>
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
      <el-table-column prop="avatar" label="照片">
        <template   slot-scope="scope">
          <img :src="scope.row.avatar"  min-width="220" height="70" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="gender" label="性别" width="105"></el-table-column>
      <el-table-column prop="profession" label="部职别"></el-table-column>
      <el-table-column prop="political_status" label="政治面貌"></el-table-column>
      <el-table-column prop="birth" label="出生日期"></el-table-column>
      <el-table-column prop="enlist" label="入伍时间"></el-table-column>
      <el-table-column prop="domicile" label="家庭地址"></el-table-column>
      <el-table-column prop="detail" label="奖励表彰"></el-table-column>
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
      troops: [],
      sys_id: null,
      tableData: [],
      current: 1, //当前页面
      size: 10, //每页显示条数
      total: 0,
      loading: false,
      formLabelWidth: "120px",
      formInline: {
        enlist_year: "",
        name: ""
      }
    };
  },
  created() {
    // 声命周期钩子函数
    this.troopList();
    this.personList();
  },
  methods: {
    troopList() {
      let headers = {
        headers: {
          token: sessionStorage.getItem("token")
        }
      }

      axios.get(this.$global_msg.host + `/troop/list`, headers).then(resp => {
        console.log("resp: ", resp);
        this.troops = resp.data.troopList;
      });
    },
    selectSuccess() {
      console.log("sys_id: ", this.sys_id);
      this.personList();
    },
    // 分页查询
    personList() {
      let sysId = sessionStorage.getItem("sys_id");
      if (!!this.sys_id) {
        sysId = this.sys_id;
      }
      axios
        .get(this.$global_msg.host + `/person/list?troop_id=${sysId}`, {
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
          this.formInline.name = null;
          this.formInline.enlist_year = null;
          this.tableData = resp.data.personList.map((item => {
            return {
              id: item.id,
              avatar: item.avatar,
              name: item.name,
              gender: item.gender,
              profession: item.profession,
              political_status: item.political_status,
              birth: item.birth,
              enlist: `${item.enlist_year}-${item.enlist_month < 10 ? '0' + item.enlist_month : item.enlist_month }`,
              domicile: item.domicile,
              detail: item.detail,
            }
          }));
          this.current = resp.data.current;
          this.size = resp.data.size;
          this.total = resp.data.total;
        });
    },
    jumpTo() {
      this.$router.push({ path: "/personAdd" });
    },
    //操作栏处理函数
    handleClick(i, row) {
      console.log("handleClick: ", row);
      if (i == 1) {
        const that = this;
        axios
        .delete(this.$global_msg.host + "/person/del?person_id=" + row.id, {
          headers: {
            token: sessionStorage.getItem("token")
          }
        })
        .then(resp => {
          that.reload();
        });
      }
      if (i == 2) {
        this.$router.push({ name: "personEdit", params: { id: row.id } });
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
    search() {
      let sysId = sessionStorage.getItem("sys_id");
      if (!!this.sys_id) {
        sysId = this.sys_id;
      }
      axios
        .get(this.$global_msg.host + `/person/search`, {
          params: {
            sys_id: sysId,
            current: this.current,
            size: this.size,
            name: this.formInline.name,
            year: this.formInline.enlist_year
          }
        })
        .then(resp => {
          console.log("resp.data: ", resp.data);
          this.tableData = resp.data.search;
          this.current = resp.data.current;
          this.size = resp.data.size;
          this.total = resp.data.total;
        });
    }
  }
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
