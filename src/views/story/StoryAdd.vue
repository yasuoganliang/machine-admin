<template>
  <div class="storyEdit">
    <div>
      <span>添加个人事迹</span>
      <el-divider></el-divider>
    </div>

    <!-- 编辑表单 -->
    <div class="box">
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="medium"
          :inline="true"
          label-width="200px"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="简介" prop="brief">
            <el-input type="textarea"  v-model="form.brief" style="width: 500px;"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="详情" prop="details">
            <el-input type="textarea" v-model="form.details" style="width: 500px;"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="备注" prop="remark">
            <el-input  type="textarea" v-model="form.remark" ></el-input>
          </el-form-item>
          <br />
          <el-form-item label="图片上传"  prop="pic_url">
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
        name: '',
        brief: '',
        details: '',
        remark: '',
        pic_url: '',
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        brief: [
          { required: true, message: "请输入个人事迹简介", trigger: "blur" }
        ],
        details: [
          { required: true, message: "请输入个人事迹详情", trigger: "blur" }
        ],
      },
      fits: ["fill"],
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      console.info(res.data);
      this.$message.success("添加成功");
      this.ruleForm = {};
      this.$router.push("/story");
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
              url: this.$global_msg.host + "story/add",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                console.log("story/add: ", resp);
                if (resp.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success"
                  });
                  this.$router.push({ name: "story" });
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
      this.form.pic_url = res.data.data[0].pic_url;
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
  .el-submit {
    margin-left: 200px;
  }
}

</style>