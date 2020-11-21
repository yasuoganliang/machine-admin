<template>
  <div class="officerEdit">
    <div>
      <span>编辑幻灯片信息</span>
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
          <el-form-item label="照片上传"  prop="avatar">
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
          <el-form-item label="原照片">
            <img
              :src="originUrl"
              style="border-radius: 5%"
              alt="原照片"
              width="146px"
              height="146px"
              fit="cover"
            />
          </el-form-item>
          <br />
          <br />
          <el-form-item label="排序值" prop="sort">
            <el-input v-model="form.sort"></el-input>
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
            <el-button type="primary" @click="onSubmit('form')">修改</el-button>
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
    this.uploadUrl = `${this.$global_msg.host}/common/update-pic?token=${sessionStorage.getItem("token")}`;
    console.log("this.$route.params.id: ", this.$route.params);
    if (this.$route.params.id != null) {
      let url = `${this.$global_msg.host}/banner/get-by-id?banner_id=${this.$route.params.id}`
      let headers = {
        headers: {
          token: sessionStorage.getItem("token")
        }
      }
      axios
        .get(url, headers)
        .then(resp => {
          console.log("resp: ", resp)
          this.form = resp.data.bannerInfo;
          // this.form.birth = new Date(this.form.birth);
          // this.form.enlist = new Date(`${this.form.enlist_year}-${this.form.enlist_month}`)
          this.originUrl = resp.data.bannerInfo.pic_url
          // this.form.gender = this.form.gender == "男" ?  1 : 0;
          console.log(this.form);
        });
    }
  },
  data() {
    return {
      isEnable: true,
      originUrl: "",
      applyMonth:"",
      applyDate:"",
      defaultVal:"",
      defaultValYear:"",
      defaultValMon:"",
      dialogVisible: false,
      dialogImageUrl: "",
      dialogVisible_2: false,
      oldImg: false,
      disabled: false,
      fileList: [],
      uploadUrl: "",
      ruleForm: {},
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      upload: "",
      form: {
        name: "",
        label_name: "",
        work_time: "",
        label_id: "",
        work_start_time: "",
        work_end_time: "",
        pic_url: null
      },
      rules: {
        name: [
          { required: true, message: "请输姓名", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        label_name: [
          { required: true, message: "请选择标签名", trigger: "blur" }
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
    },
    reset(form) {
      this.$refs[form].resetFields();
    },
    onSubmit(form) {
      console.log("submit!");
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.isEnable) {
            this.form.is_enable = 1
          } else {
            this.form.is_enable = 0
          }
          
          this.form.banner_id = this.form.id;
          axios
            .request({
              method: "put",
              url: this.$global_msg.host + "/banner/update",
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
                  this.$router.push("/banner");
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
    handleChange(file, fileList) {
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
    handleRemove(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible_2 = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    handleClose(tag) {
      this.delLabel(tag.id);
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