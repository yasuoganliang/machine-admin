<template>
  <div class="troopEdit">
    <div>
      <span>新增视频</span>
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
          <el-form-item label="视频标题" prop="ip">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="详情介绍" prop="content">
            <el-input  type="textarea" v-model="form.content"></el-input>
          </el-form-item>
          <br />
          <!-- <el-form-item label="排序值" prop="standby_time">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <br /> -->
          <el-form-item label="视频上传" prop="pic_url">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :data="uploadData"
              name="file"
              auto-upload: false
              :limit="1"
              :on-exceed="exceedhandle"
              :file-list="fileList"
              :on-success="successuploadhandle"
              accept="video"
              :before-upload="beforeUploadVideo"
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
          <el-form-item  class="el-submit">
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
    this.uploadUrl = `${this.$global_msg.host}/common/update-video?token=${sessionStorage.getItem("token")}`
  },
  data() {
    return {
      uploadData: {
        //这里面放额外携带的参数
      },
      //文件上传的路径
      dialogVisible: false,
      modlevidel: "",
      imgurl: "",
      dialogImageUrl: "",
      fileList: [],
      uploadUrl: "",
      ruleForm: {},
      upload: "",
      formLabelAlign: {
        video: ""
      },
      form: {
        title: "",
        pic_url: "",
        url: "",
        sort: 1,
        src: 0,
        is_enable: 1,
        content: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入视频标题", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ]
      },
      fits: ["fill"],
    };
  },
  methods: {
    getVideoBase64(url) {
        return new Promise(function (resolve, reject) {
            let dataURL = '';
            let video = document.createElement("video");
            video.crossOrigin = 'anonymous';
            video.src = url;
            video.width = 400;
            video.height = 240;
            video.currentTime = 1;
            // video.setAttribute('crossOrigin', 'anonymous');//处理跨域
            // video.setAttribute('src', url);
            // video.setAttribute('width', 400);
            // video.setAttribute('height', 240);
            video.addEventListener('loadeddata', function () {
                let canvas = document.createElement("canvas"),
                width = video.width, //canvas的尺寸和图片一样
                height = video.height;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
                dataURL = canvas.toDataURL('image/png'); //转换为base64
                resolve(dataURL);
            });
        })
    },
    beforeUploadVideo(file) {
      if ([ "video/mp4", "video/ogg", "video/flv", "video/avi", "video/wmv", "video/rmvb" ].indexOf(file.type) == -1) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
    },
    exceedhandle(files, fileList) {
      this.$message.error("只能上传一个视频额");
    },
    async successuploadhandle(response, file, fileList) {
      const videoCover = await this.getVideoBase64(response.data.data[0].video_url);
      this.imgurl = videoCover;
      this.upload = videoCover;
      this.form.pic_url = videoCover;
      this.imageFile = videoCover;
      this.form.url = response.data.data[0].video_url;
      let fd = new FormData();
      let blob = this.dataURItoBlob(videoCover);
      fd.append('image', blob);
      axios
        .request({
          method: "post",
          url: `${this.$global_msg.host}/common/update-pic`,
          data: fd,
          headers: {
            "token": sessionStorage.getItem("token"),
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
        .then(
          resp => {
            this.form.pic_url = resp.data.data[0].pic_url
            // console.log("resp: ", resp)
          },
          error => {
            console.error("error: ", error);
            this.$notify.error({
              title: "失败",
              message: "连接服务器失败"
            });
          }
        );
    },
    dataURItoBlob(dataURI) {
      let byteString = atob(dataURI.split(',')[1]);
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      // console.log(mimeString, ia)
      return new Blob([ab], {type: mimeString});
      // return new Blob([ab], ".png");
    },
    reset(form) {
      this.$refs[form].resetFields();
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          axios
            .request({
              method: "post",
              url: this.$global_msg.host + "/video/add",
              data: this.form,
              headers: {
                "token": sessionStorage.getItem("token"),
                "Content-Type": "application/json;charset=UTF-8"
              }
            })
            .then(
              resp => {
                console.log("resp: ", resp);
                if (resp.statusCode == 1) {
                  this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success"
                  });
                  this.$router.push({ name: "video" });
                } else {
                  this.$notify.error({
                    title: "失败",
                    message: resp.message
                  });
                }
              },
              error => {
                console.error("error: ", error);
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
      // console.log(this.form);
    },
    handleChange(file, fileList) {
      // console.log("handleChange: ", file);
      this.imageFile = file.raw;
      if (file.status === "success") {
        // console.log("OK");
      }
    },
    handleError(err, file, fileList) {
      console.log("错误", err);
      this.$message.warning("上传图片失败请重试！");
    },
    handleRemove(file, fileList) {;
      console.log("handleRemove: ", file);
    },
    handlePictureCardPreview(file) {
      console.log("handlePictureCardPreview: ", file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
</style>