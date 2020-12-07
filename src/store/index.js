import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //定义状态
  state: {
    // 存储token
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null,
    // 登录的用户
    adminName: sessionStorage.getItem('admin_name') ? sessionStorage.getItem('admin_name') : null,
    // 登录的用户id
    adminId: sessionStorage.getItem('admin_id') ? sessionStorage.getItem('admin_id') : null,
    // 登录的系统 id
    sysId: sessionStorage.getItem('sys_id') ? sessionStorage.getItem('sys_id') : null,
    // 是否是管理员
    isSuper: sessionStorage.getItem('isSuper') ? sessionStorage.getItem('isSuper') : false,
    avatar_url: sessionStorage.getItem('avatar') ? sessionStorage.getItem('avatar') : null,
    websock: sessionStorage.getItem('websock') ? sessionStorage.getItem('websock') : null,
    socket: null, //websocket对象
    serverHost: null
  },
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin(state, user) {
      // console.log(user);
      state.token = user.token;
      state.adminName = user.name;
      state.adminId = user.id;
      state.sysId = user.sys_id;
      state.isSuper = user.isSuper;
      state.avatar_url = user.avatar;
      sessionStorage.setItem('token', user.token);
      sessionStorage.setItem('admin_name', user.name);
      sessionStorage.setItem('admin_id', user.id);
      sessionStorage.setItem('sys_id', user.sys_id);
      sessionStorage.setItem('isSuper', user.isSuper);
      sessionStorage.setItem('avatar', user.avatar);
    },
    // 修改token，并将token存入localStorage
    // setWebsock(state, websock) {
    //   // console.log(websock);
    //   state.websock = websock;
    //   // sessionStorage.setItem('websock', websock);
    // },
    setSocket(state, data) {
      state.socket = data
    },
    // 修改token，并将token存入localStorage
    setServerHost(state, serverHost) {
      // console.log(websock);
      state.serverHost = serverHost;
      localStorage.setItem('serverHost', serverHost);
    }
  },
  actions: {
  },
  modules: {
  }
})
