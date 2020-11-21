<template>
  <div class="userEdit">
    <div>
      <span>编辑个人信息</span>
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
         <el-form-item prop="name" label="管理员名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <br />
          <el-form-item prop="passwd" label="管理员密码">
            <el-input v-model="form.passwd" show-password></el-input>
          </el-form-item>
          <br />
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">立即修改</el-button>
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
import { mapMutations, mapState } from "vuex";

export default {
  computed: mapState(["adminId", "isSuper"]), //得到vuex 里面的用户信息
  created() {
    let headers = {
      headers: {
        token: sessionStorage.getItem("token")
      }
    }
     // 获取用户信息
    console.log("this.$route.params.id: ", this.$route.params);
    if (this.$route.params.id != null) {
      let url = `${this.$global_msg.host}/role/get-info-by-id?role_id=${this.$route.params.id}`
      axios
        .get(url, headers)
        .then(resp => {
          // console.log(resp);
          this.form = resp.data.roleInfo;
          // console.log(this.form);
        });
    }
  },
  data() {
    return {
      isSuperAdmin: false,
      isAdmin: true,
      isEnable: true,
      troops: [],
      dialogVisible: false,
      dialogImageUrl: "",
      dialogVisible_2: false,
      oldImg: false,
      disabled: false,
      fileList: [],
      uploadUrl: "",
      ruleForm: {},
      upload: "",
      form: {
        name: "",
        avatar: "",
        passwd: "",
        role_id: null,
        is_super_admin: 0,
        is_admin: 1,
        is_enable: 1,
        sys_id: null,
      },
      rules: {
        name: [
          { required: true, message: "请输入支队名称", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        passwd: [
          { required: true, message: "请输入管理员密码", trigger: "blur" }
        ],
        sys_id: [
          { required: true, message: "请选择支队", trigger: "blur" }
        ]
      },
      fits: ["fill"],
    };
  },
  methods: {
    onSubmit(form) {
      console.log("submit!");
      this.$refs[form].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "put",
              url: this.$global_msg.host + "/admin/modify",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                console.log("/admin/modify: ", resp);
                if (resp.status == 200 && resp.data.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
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
          console.log("error submit!!");
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
  .el-button {
    margin-left: 200px;
  }
}
</style>