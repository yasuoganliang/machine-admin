<template>
  <div class="personEdit">
    <div>
      <span>编辑官兵信息</span>
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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <br />
          <el-form-item label="部职别" prop="profession">
            <el-input v-model="form.profession"></el-input>
          </el-form-item>
          <el-form-item label="政治面貌" prop="political_status">
            <el-input v-model="form.political_status"></el-input>
          </el-form-item>
          <br />
          <!-- <el-form-item label="出生日期" prop="birth">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择出生日期" v-model="form.birth"></el-date-picker>
            </el-col>
          </el-form-item> -->、
          <el-form-item label="出生年月" prop="birth">
            <el-date-picker v-model="form.birth" type="month" placeholder="选择出生年月"></el-date-picker>
          </el-form-item>
          <el-form-item label="入伍时间" prop="enlist">
            <el-date-picker v-model="form.enlist" type="month" placeholder="选择入伍时间"></el-date-picker>
          </el-form-item>
          <br />
          <el-form-item label="家庭地址" prop="domicile">
            <el-input type="textarea" v-model="form.domicile"></el-input>
          </el-form-item>
          <el-form-item label="奖励表彰" prop="detail">
            <el-input type="textarea" v-model="form.detail"></el-input>
          </el-form-item>
          <br />
          <el-form-item class="el-submit">
            <el-button type="primary" @click="onSubmit('form')">立即修改</el-button>
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
    this.uploadUrl = `${this.$global_msg.host}/common/update-pic?token=${sessionStorage.getItem("token")}`
    console.log("this.$route.params.id: ", this.$route.params);
    if (this.$route.params.id != null) {
      let url = `${this.$global_msg.host}/person/get-by-id?person_id=${this.$route.params.id}`
      let headers = {
        headers: {
          token: sessionStorage.getItem("token")
        }
      }
      axios
        .get(url, headers)
        .then(resp => {
          this.form = resp.data.personInfo;
          this.form.birth = new Date(this.form.birth);
          this.form.enlist = new Date(`${this.form.enlist_year}-${this.form.enlist_month}`)
          this.originUrl = resp.data.personInfo.avatar
          this.form.gender = this.form.gender == "男" ?  1 : 0;
          console.log(this.form);
        });
    }
  },
  inject:['reload'],
  data() {
    return {
      originUrl: "",
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
        person_id: null,
        name: "",
        gender: "",
        profession: "",
        political_status: "",
        birth: "",
        enlist: "",
        enlist_year: null,
        enlist_month: null,
        domicile: "",
        detail: ""
      },
      rules: {
        name: [
          { required: true, message: "请输姓名", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "请输入性别", trigger: "blur" }
        ],
        profession: [
          { required: true, message: "请输入部职别", trigger: "blur" }
        ],
        birth: [
          { required: true, message: "请输入出生年月", trigger: "blur" }
        ],
        enlist: [
          { required: true, message: "请输入入伍时间", trigger: "blur" }
        ],
        domicile: [
          { required: true, message: "请输入家庭住址", trigger: "blur" }
        ],
        political_status: [
          { required: true, message: "请输入政治面貌", trigger: "blur" }
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
      console.log("submit!", this.form);
      this.$refs[form].validate(valid => {
        if (valid) {
          let birth = this.form.birth;
          let month = birth.getMonth() + 1;
          this.form.birth = `${birth.getFullYear()}-${month > 9 ? month : '0' + month}`;
          this.form.enlist_year = this.form.enlist.getFullYear();
          this.form.enlist_month = this.form.enlist.getMonth() + 1;
          let gender = this.form.gender;
          this.form.gender = gender == 0 ?  "女" : "男";
          this.form.person_id = this.form.id;
          axios
            .request({
              method: "put",
              url: this.$global_msg.host + "/person/update",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                console.log("person/update: ", resp);
                if (resp.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                  this.$router.push({ name: "person" });
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
      this.form.avatar = res.data.data[0].pic_url;
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