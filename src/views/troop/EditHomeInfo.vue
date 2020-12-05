<template>
  <div class="troopEdit">
    <div>
      <span>编辑分队主页信息</span>
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
          <!-- <el-form-item label="分队" prop="troop">
            <el-select v-model="form.id" placeholder="选择分队">
              <el-option
                v-for="(troop, index) in troops"
                :label="troop.name"
                :value="troop.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="IP 地址段" prop="ip">
            <el-input v-model="form.ip"></el-input>
          </el-form-item> -->
          <br />
          <el-form-item label="首页链接" prop="home_url">
            <el-input v-model="form.home_url"></el-input>
          </el-form-item>
          <el-form-item label="待机时长（秒）" prop="standby_time">
            <el-input v-model="form.standby_time"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="图片幻灯片播放时长（秒）" prop="banner_interval">
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
          <el-form-item label="原背景图片">
            <img
              :src="originUrl"
              style="border-radius: 5%"
              alt="原背景图片"
              width="146px"
              height="146px"
              fit="cover"
            />
          </el-form-item>
          <br />
          <el-form-item style="margin-left: 200px">
            <el-button type="primary" @click="onSubmit('form')">确认修改</el-button>
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
    this.uploadUrl = `${this.$global_msg.host}/common/update-pic?token=${sessionStorage.getItem("token")}`
    let headers = {
      headers: {
        token: sessionStorage.getItem("token")
      }
    }

    
    let url = `${this.$global_msg.host}/troop/get-info-by-id?sys_id=${sessionStorage.getItem("sys_id")}`
    axios
      .get(url, headers)
      .then(resp => {
        // console.log(resp);
        this.form = resp.data.troopInfo;
        this.upload = resp.data.troopInfo.background_url
        this.originUrl = resp.data.troopInfo.background_url
        // console.log(this.form);
      });
  },
  data() {
    return {
      originUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [],
      uploadUrl: '',
      ruleForm: {},
      upload: "",
      troops: [],
      form: {
        name: "",
        ip: "",
        sys_id: "",
        home_url: "",
        standby_time: 0,
        banner_interval: 0,
        background_url: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入分队名称", trigger: "blur" },
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
      this.$refs[form].validate(valid => {
        if (valid) {
          this.form.sys_id = this.form.id;
          axios
            .request({
              method: "put",
              url: this.$global_msg.host + "/troop/update",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                // console.log(resp);
                if (resp.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "更新成功",
                    type: "success"
                  });
                  // this.$router.push("/troop");
                } else {
                  this.$notify.error({
                    title: "失败",
                    message: "更新失败"
                  });
                }
              },
              error => {
                this.$notify.error({
                  title: "失败",
                  message: "更新失败"
                });
              }
            );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // console.log(this.form);
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
      this.form.background_url = res.data.data[0].pic_url;
    },
    handleRemove(file) {
      console.log(file);
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },

    handlePictureCardPreview(file) {
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
  .avator {
    margin-left: 30px;
  }
}
</style>