<template>
  <div class="officerEdit">
    <div>
      <span>编辑主官信息</span>
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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="职务" prop="profession">
            <el-input v-model="form.profession"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="在任时间" prop="work_time">
            <el-col :span="8">
              <el-date-picker type="month" placeholder="任期开始时间" v-model="form.work_start_time" style="width: 100%;" prop="work_start_time"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="padding-left: 10px;">至</el-col>
            <el-col :span="11">
              <el-date-picker type="month" placeholder="到任时间（不填默认至今）" v-model="form.work_end_time" style="width: 100%;" prop="work_end_time"></el-date-picker>
            </el-col>
          </el-form-item>
          <br />
          <el-form-item label="选择标签" prop="label_name">
            <el-input v-model="form.label_name">{{form.label_name}}</el-input>
          </el-form-item>
          <br />
          <el-form-item label="标签" prop="label_id">
            <el-tag
              v-for="(tag, index) in dynamicTags"
              :value="tag.id"
              :label="tag.label_name"
              :key="index"
              closable
              :disable-transitions="false"
              @click="selectTag(tag)"
              @close="handleClose(tag)">
              {{tag.label_name}}
            </el-tag>
            <el-input class="input-new-tag" 
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
          </el-form-item>
          <br />
          <el-form-item class="el-submit">
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
    this.uploadUrl = `${this.$global_msg.host}/common/update-pic?token=${sessionStorage.getItem("token")}`;
    console.log("this.$route.params.id: ", this.$route.params);
    this.labelList();
    if (this.$route.params.id != null) {
      let url = `${this.$global_msg.host}/officer/get-by-id?officer_id=${this.$route.params.id}`
      let headers = {
        headers: {
          token: sessionStorage.getItem("token")
        }
      }
      axios
        .get(url, headers)
        .then(resp => {
          console.log("resp: ", resp)
          this.form = resp.data.officerInfo;
          // this.form.birth = new Date(this.form.birth);
          // this.form.enlist = new Date(`${this.form.enlist_year}-${this.form.enlist_month}`)
          this.originUrl = resp.data.officerInfo.avatar
          // this.form.gender = this.form.gender == "男" ?  1 : 0;
          console.log(this.form);
        });
    }
  },
  data() {
    return {
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
        profession: "",
        avatar: null
      },
      pickerOptions:{
        disabledDate(time) {
          if (vm.endDate != null && vm.endDate != "") {
              return time.getTime() > vm.endDate;
          } else {
              return false;
          }
        }
	    },
      rules: {
        name: [
          { required: true, message: "请输姓名", trigger: "blur" },
          { min: 1, max: 40, message: "长度在 1 到 40 个字符", trigger: "blur" }
        ],
        label_name: [
          { required: true, message: "请选择标签名", trigger: "blur" }
        ],
        profession: [
          { required: true, message: "请输入职务", trigger: "blur" }
        ],
      },
      fits: ["fill"],
    };
  },
  methods: {
    labelList() {
      axios
        .get(this.$global_msg.host + "/label/list", {
          headers: {
            token: sessionStorage.getItem("token")
          },
          params: {
            sys_id: sessionStorage.getItem("sys_id"),
            current: this.current,
            size: this.size
          }
        })
        .then(resp => {
          console.log("resp: ", resp);
          this.dynamicTags = resp.data.labelList.map(item => { return { label_name: item.label_name, id: item.id } });
        });
    },
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
          let startTime = new Date(this.form.work_start_time);
          let startYear = startTime.getFullYear();
          let startMonth = startTime.getMonth() + 1;
          let endTime = this.form.work_end_time;
          if (endTime == '至今') {
            this.form.work_start_time = `${startYear}-${startMonth > 9 ? startMonth : '0' + startMonth}`;
            this.form.work_end_time = '至今';
          } else {
            endTime = new Date(endTime);
            if (this.form.work_start_time && this.form.work_end_time) {
              if (startTime.getTime() - endTime.getTime() > 0) {
                return this.$notify.error({
                  title: "失败",
                  message: "请选择正确的时间段"
                });
              }
              let endYear = startTime.getFullYear();
              let endMonth = startTime.getMonth() + 1;
              let now = new Date();
              if (now.getMonth() + 1 == endMonth) {
                this.form.work_start_time = `${startYear}.${startMonth > 9 ? startMonth : '0' + startMonth}`;
                this.form.work_end_time = '至今';
              } else {
                this.form.work_start_time = `${startYear}.${startMonth > 9 ? startMonth : '0' + startMonth}`;
                this.form.work_end_time = `${endYear}.${endMonth > 9 ? endMonth : '0' + endMonth}`;
              }
            }
            
            if (!endTime) {
              this.form.work_start_time = `${startYear}.${startMonth > 9 ? startMonth : '0' + startMonth}`;
              this.form.work_end_time = '至今';
            } else {
              this.form.work_start_time = `${startYear}.${startMonth > 9 ? startMonth : '0' + startMonth}`;
              this.form.work_end_time = `${endYear}.${endMonth > 9 ? endMonth : '0' + endMonth}`;
            }
          }
          
          this.form.officer_id = this.form.id;
          axios
            .request({
              method: "put",
              url: this.$global_msg.host + "/officer/update",
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
                  this.$router.push("/officer");
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
      this.form.avatar = res.data.data[0].pic_url;
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
    delLabel(label_id) {
      axios
        .request({
          method: "delete",
          url: this.$global_msg.host + "/label/del",
          data: {
            "label_id": label_id
          },
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
                message: "删除成功",
                type: "success"
              });
              this.labelList();
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
    },
    addLabel(label_name) {
      axios
        .request({
          method: "post",
          url: this.$global_msg.host + "/label/add",
          data: {
            "label_name": label_name
          },
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
                message: "添加成功",
                type: "success"
              });
              this.labelList();
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
    },
    selectTag(tag) {
      console.log("tag: ", tag);
      this.form.label_name = tag.label_name;
      this.form.label_id = tag.id;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.addLabel(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
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