<template>
  <div class="troopEdit">
    <div>
      <span>新增管理员角色</span>
      <el-divider></el-divider>
    </div>

    <!-- 编辑表单 -->
    <div class="box">
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="300px"
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
          <!-- <el-form-item label="头像上传"  prop="avatar">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-change="handleChange"
              ref="upload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <br /> -->
          <el-form-item label="选择管理支队" prop="troop">
            <el-select v-model="form.sys_id" placeholder="选择支队">
              <el-option
                v-for="(troop, index) in troops"
                :label="troop.name"
                :value="troop.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item prop="is_super_admin" label="超级管理员">
            <el-switch
              v-model="isSuperAdmin"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <br />
          <el-form-item prop="is_admin" label="管理员">
            <el-switch
              v-model="isAdmin"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <br />
          <el-form-item prop="is_enable" label="是否启用">
            <el-switch
              v-model="isEnable"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            <!-- <el-input v-model="form.standby_time"></el-input> -->
          </el-form-item>
          <br />
          <el-form-item class="el-submit">
            <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
            <el-button @click="reset('form')">重置</el-button>
          </el-form-item>
          <br />
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
    this.uploadUrl = `${this.$global_msg.host}common/update-pic?token=${sessionStorage.getItem("token")}`
    let headers = {
      headers: {
        token: sessionStorage.getItem("token")
      }
    }
    axios.get(this.$global_msg.host + "troop/list", headers).then(resp => {
      console.log("resp: ", resp);
      this.troops = resp.data.data.troopList;
    });
  },
  inject:['reload'],
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
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.isSuperAdmin) {
            this.form.is_super_admin = 1
          } else {
            this.form.is_super_admin = 0
          }
          if (this.isAdmin) {
            this.form.is_admin = 1
          } else {
            this.form.is_admin = 0
          }
          if (this.isEnable) {
            this.form.is_enable = 1
          } else {
            this.form.is_enable = 0
          }
          axios
            .request({
              method: "post",
              url: this.$global_msg.host + "role/add",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                console.log("role/add: ", resp);
                if (resp.status == 200 && resp.data.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success"
                  });
                  this.$router.push({ name: "role" });
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
    },
    handleChange(file, fileList) {
      console.log("handleChange: ", file);
      this.imageFile = file.raw;
      if (file.status === "success") {
        console.log("OK");
      }
    },
    handleError(err, file, fileList) {
      console.log("错误", err);
      this.$message.warning("上传图片失败请重试！");
    },

    handleSuccess(res) {
      console.log("handleSuccess: ", res);
      this.$message.success("图片上传成功");
      this.form.avatar = res.data.data[0].pic_url; //我添加
    },
    handleRemove(file, fileList) {;
      console.log("handleRemove: ", file);
    },

    handleExceed(files, fileList) {
      console.log("handleExceed: ", files, fileList);
      this.$message.warning(`当前限制选择 1 个文件`);
    },

    handlePictureCardPreview(file) {
      console.log("handlePictureCardPreview: ", file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: space-between;
  text-align: left;
  .avator {
    margin-left: 30px;
  };
  .el-submit {
    margin-left: 200px;
  }
}
</style>