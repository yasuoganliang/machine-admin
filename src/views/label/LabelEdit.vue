<template>
  <div class="ipaddrEdit">
    <div>
      <span>编辑主官标签名称</span>
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
          <el-form-item label="主官标签名称" prop="label_name">
            <el-input v-model="form.label_name"></el-input>
          </el-form-item>
          <br />
          <el-form-item class="el-submit">
            <el-button type="primary" @click="onSubmit('form')">立即修改</el-button>
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
    if (this.$route.params.id != null) {
          let url = `${this.$global_msg.host}/label/get-by-id?label_id=${this.$route.params.id}`
          let headers = {
            headers: {
              token: sessionStorage.getItem("token")
            }
          }
          axios
            .get(url, headers)
            .then(resp => {
              console.log("resp: ", resp)
              this.form = resp.data.labelInfo;
            });
        }
  },
  data() {
    return {
      form: {
        label_name: ''
      },
      rules: {
        label_name: [
          { required: true, message: "请输入主官标签名称", trigger: "blur" },
        ],
        
      },
    };
  },
  methods: {
    reset(form) {
      this.$refs[form].resetFields();
    },
    onSubmit(form) {
      console.log("submit!");
      this.$refs[form].validate(valid => {
        if (valid) {
          this.form.label_id = this.form.id;
          axios
            .request({
              method: "put",
              url: this.$global_msg.host + "/label/update",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })

            .then(
              resp => {
                console.log(resp);
                if (resp.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                  this.$router.push("/label");
                } else {
                  this.$notify.error({
                    title: "失败",
                    message: resp.message
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
    },
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
  .el-submit {
    margin-left: 200px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>