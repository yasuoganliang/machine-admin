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
          <!-- <el-form-item label="IP 地址段" prop="ip">
            <el-input v-model="form.ip"></el-input>
          </el-form-item>
          <br /> -->
          <el-form-item label="首页链接" prop="home_url">
            <el-input v-model="form.home_url"></el-input>
          </el-form-item>
          <el-form-item label="待机时长" prop="standby_time">
            <el-input v-model="form.standby_time"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="幻灯片播放时长" prop="banner_interval">
            <el-input v-model="form.banner_interval"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="背景图片上传"  prop="background_url">
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
  },
  inject:['reload'],
  data() {
    return {
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
        ip: "",
        home_url: "",
        standby_time: 600,
        banner_interval: 60,
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
              method: "post",
              url: this.$global_msg.host + "troop/add",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                console.log("troop/add: ", resp);
                if (resp.status == 200 && resp.data.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success"
                  });
                  this.$router.push({ name: "troop" });
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
      this.form.background_url = res.data.data[0].pic_url; //我添加
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