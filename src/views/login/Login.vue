// 登录页面
<template>
  <div class="box">
    <div class="left">
      <div class="form">
        <div>
          <h2>登录</h2>
        </div>
        <div class="field">
          <input
            type="text"
            placeholder="登录名"
            v-model="form.username"
            v-on:keyup.enter="submit"
          />
        </div>
        <div class="field">
          <el-input
            type="password"
            placeholder="用户密码"
            v-model="form.password"
            v-on:keyup.enter="submit"
            show-password
          ></el-input>
        </div>
        <div class="field">
          <input type="button" @click="submit" value="确认" />
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right-header">
        <div class="shut" @click="close">
          <span class="el-icon-close"></span>
        </div>
      </div>
      <div class="right-body">
        <div class="right-body-content">
          <h1>一体机管理系统</h1>
        </div>
        <div style="-webkit-app-region: no-drag">
          <!-- <h2>扫码登录</h2>
          <img src="../../assets/images/ecode.png" v-if="ecode" />
          <div v-else>
            <span>加载二维码中....</span>
            <el-button
              icon="el-icon-search"
              circle
              @click="initWebSocket"
            ></el-button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "axios";
const { ipcRenderer } = require("electron");
export default {
  created() {
    // this.initWebSocket();
  },
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      websock: null,
      ecode: false,
    };
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      console.log("初始化websocket");
      const wsuri = this.$global_msg.socket_host + "websocket/admin/login"; //这个地址由后端童鞋提供
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      this.setWebsock(this.websock);
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      console.log("建立连接成功");
      this.websocketsend("hello");
      this.ecode = true;
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
      this.error = false;
    },
    websocketonmessage(e) {
      //数据接送
      console.log("onmessage: ", e);
      let data = JSON.parse(e.data);
      if (data != null && data.type == "login") {
        console.log(data);
        let user = {
          token: data.message.token,
          id: data.message.userId,
          super: data.message.isSuper,
          avatar_url: data.message.avatar_url,
        };
        this.changeLogin(user);
        console.log("aaa");
        this.$router.push("/");
      } else if (data.type == "error") {
        this.$message.error(data.message);
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭连接
      console.log("断开连接", e);
      // this.initWebSocket();
    },
    close() {
      console.log("close");
      ipcRenderer.send("close");
    },
    ...mapMutations(["changeLogin", "setWebsock"]),
    submit() {
      // var regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
      if (this.form.username == "") {
        this.$message("登录名不能为空");
        // } else if (!regex.test(this.form.username)) {
        //   this.$message.warning("请输入正确的邮箱");
      } else if (this.form.password == "") {
        this.$message.warning("密码不能为空");
      } else {
        let _this = this;
        let params = new URLSearchParams();
        params.append("username", this.form.username);
        params.append("password", this.form.password);
        //踩坑了， axios 的post请求默认 提交的是 application/json, 而 springmvc 得接收post请求是 x-www-form-urlencoded
        axios({
          method: "POST",
          url: this.$global_msg.host + "admin/login",
          data: params,
        })
          .then((res) => {
            console.log("res: ", res);
            console.log("login data: ", res.statusCode);
            if (res.statusCode == 1) {
              let user = {
                token: res.data.token,
                name: res.data.adminInfo.name,
                id: res.data.adminInfo.id,
                sys_id: res.data.adminInfo.sys_id,
                isSuper: res.data.adminInfo.isSuper,
                avatar_url: res.data.adminInfo.avatar || null,
              };
              // console.log("user: ", user);
              _this.changeLogin(user);
              // console.log("success login");
              _this.$router.push("/");
            } else if (res.status == 404) {
              this.$message.error("status 404: ", res.message);
            } else {
              this.$message.error(`status ${res.status}: `,res.message
              );
            }
          })
          .catch((err) => {
            console.error("err: ", err);
            this.$message.error("请检查网络");
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.field {
  margin: 0em 0em 1.2em;
  width: 100%;
  input[type="text"],
  input[type="password"],
  input[type="button"] {
    box-sizing: border-box;
    width: 100%;
    padding-top: 9px;
    padding-bottom: 9px;
    line-height: 15px;
    font-size: 15px;
    padding: 9px 1em;
    box-shadow: none;
    border-radius: 3px;
    border: 1px solid #dfe3e9;
  }
  input[type="button"] {
    font-size: 17px;
    line-height: 22px;
    padding: 8px 26px;
    font-weight: 500;
    color: #fff;
    background: #fe7300;
  }
}
.box {
  display: flex;
  background-color: transparent;
  height: 100%;
  width: 100%;
  // 可以拖动
  -webkit-app-region: drag;
}
.left {
  height: 100%;
  width: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.form {
  //   background-color: #3c589a;
  width: 270px;
  padding: 64px 75px 48px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  -webkit-app-region: no-drag;
}
.right {
  width: 50%;
  background-color: #58687f;
  background-image: url("../../assets/images/right-1.png");
  display: flex;
  flex-wrap: wrap;
}
.right-header {
  width: 100%;
  height: 30px;
  .shut {
    padding: 10px;
    float: right;
    padding-top: 1px;
    font-size: 20px;
    padding-right: 5px;
    -webkit-app-region: no-drag;
    background-color: #58687f;
  }
}
.shut:hover {
  background-color: #4d5a6b;
}
.right-body {
  height: 100%;
  width: 100%;
  padding-bottom: 100px;
  display: flex;
  // justify-content: center;
  align-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  .right-body-content {
    margin-top: 20px;
  }
}
</style>