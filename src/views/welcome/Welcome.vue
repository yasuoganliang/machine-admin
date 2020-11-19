<template>
  <div>
    welcome!
    <b>{{ form.name }}</b>
    <div class="content">
      <!-- 数据栏 -->
      <div class="panel-group">
        <div class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper el-icon-connection"></div>
            <div class="card-panel-description">
              <div class="card-panel-text">当前在线主机</div>
              <!-- <span class="card-panel-num">{{ this.numbers.employee }}</span> -->
              <span class="card-panel-num">{{ 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="screen-monitor">
      <img 
          class="screenshot" 
          :src="screenshot"
          :style="screenshotStyle"
          @mousedown="handleMouseEvent"
          @mousemove="handleMouseEvent" 
          @mouseup="handleMouseEvent"
          @click="handleMouseEvent"
          @dblclick="handleMouseEvent" 
      />
    </div> -->
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import axios from "axios";
export default {
  //计算属性，监测vuex 数据
  computed: mapState(["adminId", "isSuper"]), //得到vuex 里面的用户信息
  created() {
    // 声命周期钩子函数, 用于获取部门，工作，学历列表
    if (this.adminId != null) {
      let headers = {
        headers: {
          token: sessionStorage.getItem("token")
        }
      }
       let url = `${this.$global_msg.host}role/get-info-by-id?role_id=${this.adminId}`
      axios
        .get(url, headers)
        .then(resp => {
          // console.log("welcome: ", resp);
          this.form = resp.data.roleInfo;
        });
    }
  },
  data() {
    return {
      form: {
        address: "",
        authority: 0,
        birthday: "",
        department: null,
        eduLevel: null,
        email: "",
        job: "",
        name: "",
        remark: "",
        sex: null,
        spcialty: "",
        tel: "",
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
}
.panel-group {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
}
.card-panel-col {
  margin-bottom: 6px;
  margin-right: 10px;
  width: 33%;
  .card-panel {
    &:hover {
      background-color: #f8f8f8;
    }
    height: 108px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    color: #666;
    background: #fff;
    -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    .card-panel-icon-wrapper {
      font-size: 50px;
      margin: 14px 0 0 14px;
      padding: 16px;
      -webkit-transition: all 0.38s ease-out;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .el-icon-user-solid {
      color: #40c9c6;
    }
    .card-panel-description {
      font-weight: 700;
      margin: 26px;
      margin-left: 0;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

.charts-table {
  display: flex;
  // flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .t1 {
    width: 50%;
  }
  .t2 {
    width: 50%;
  }
}
.screen-monitor .screenshot {
    width: 100%;
    height: auto;
    background: #ccc;
  }
</style>