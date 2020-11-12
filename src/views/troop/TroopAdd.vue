<template>
  <div class="troopEdit">
    <div>
      <span>新增支队</span>
      <el-divider></el-divider>
    </div>

    <!-- 编辑表单 -->
    <div class="box">
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="200px"
          size="mini"
          :inline="true"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="IP 地址段" prop="ip">
            <el-input v-model="form.ip"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="首页链接" prop="home_url">
            <el-input v-model="form.home_url"></el-input>
          </el-form-item>
          <el-form-item label="待机时长" prop="standby_time">
            <el-input v-model="form.standby_time"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="图片幻灯片播放时长" prop="banner_interval">
            <el-input v-model="form.banner_interval"></el-input>
          </el-form-item>
          <el-form-item label="背景图片上传">
            <el-upload  class="avator"
              action="http://localhost:10010/goods/addGoods"
                list-type="picture-card"
                :on-success="handleAvatarSuccess"
                ref="upload"
                :auto-upload="false"
                :limit="1"
                :data="ruleForm"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
            <el-button @click="reset('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <br />
    <br />
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    axios.get(this.$global_msg.host + "troop/edit-info", {
      headers: {
        token: sessionStorage.getItem("token")
      }
    }).then(resp => {
      console.log("troop/edit-info: ", resp);
      this.form = resp.data.data.troopEditInfo;
      this.upload = resp.data.data.troopEditInfo.background_url
    });
  },
  data() {
    return {
      ruleForm: {},
      upload: "",
      form: {
        name: "",
        ip: "",
        home_url: "",
        standby_time: 0,
        banner_interval: 0,
        background_url: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入支队名称", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        ip: [
          { required: true, message: "请输入 IP 地址段", trigger: "blur" }
        ],
        home_url: [
          { required: true, message: "请输入主页链接", trigger: "blur" }
        ],
        banner_interval: [
          { required: true, message: "请输入轮播图播放时长，时间为秒", trigger: "blur" }
        ],
        standby_time: [
          { required: true, message: "请输入待机时长，时间为秒", trigger: "blur" }
        ]
      },
      fits: ["fill"],
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      console.info(res.data);
      this.$message.success("添加成功");
      this.ruleForm = {};
      this.$router.push("/troop");
    },
    reset(form) {
      this.$refs[form].resetFields();
    },
    onSubmit(form) {
      console.log("submit!");
      this.$refs[form].validate(valid => {
        if (valid) {
          axios
            .request({
              headers: {
                token: sessionStorage.getItem("token")
              },
              method: "post",
              url: this.$global_msg.host + "troop/add",
              data: this.form,
              headers: {
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                console.log(resp);
                if (resp.data.code == 200) {
                  this.$notify({
                    title: "成功",
                    message: "插入成功了",
                    type: "success"
                  });
                } else {
                  this.$notify.error({
                    title: "失败",
                    message: resp.data.message
                  });
                }
              },
              error => {
                this.$notify.error({
                  title: "失败",
                  message: "连接服务器失败"
                });
              }
            );
        } else {
          this.$notify.error({
            title: "失败",
            message: "请检查表单数据是否正确"
          });
          return false;
        }
      });
      console.log(this.form);
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: space-between;
  .avator {
    margin-left: 30px;
  }
}
</style>