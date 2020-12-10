<template>
  <div>
    <el-menu
      :default-openeds="['1']"
      background-color="#F5F5F7"
      text-color="#5C5C5C"
      active-text-color="#000000"
    >
      <el-menu-item index="1" @click="openPage(9)">
        <i class="el-icon-eleme iconfont icon-panel"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2" v-if="this.isSuper">
        <template slot="title">
          <i class="el-icon-user iconfont icon-bumen"></i>分队管理
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1" @click="openPage(11)">分队列表</el-menu-item>
          <el-menu-item index="2-2" @click="openPage(12)">增加分队</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3" v-if="this.isSuper">
        <template slot="title">
          <i class="el-icon-tickets iconfont icon-zengjiayonghu"></i>分队管理员
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1" @click="openPage(13)">管理员列表</el-menu-item>
          <el-menu-item index="3-1" @click="openPage(14)">增加管理员</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-user iconfont icon-shezhi"></i>系统管理</template>
        <el-menu-item-group>
          <el-menu-item index="4-1" @click="openPage(7)">编辑系统信息</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="4-2" @click="openPage(21)">幻灯片</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="4-3" @click="openPage(10)">IP 地址</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="4-4" @click="openPage(23)">主官标签</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-setting iconfont icon-yuangongliebiao"></i>红色家谱</template>
        <el-menu-item-group>
          <el-menu-item index="5-1" @click="openPage(15)">官兵列表</el-menu-item>
          <el-menu-item index="5-1" @click="openPage(16)">主官列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-setting iconfont icon-zuidahua"></i>功勋卓著</template>
        <el-menu-item-group>
          <el-menu-item index="6-1" @click="openPage(17)">功勋列表</el-menu-item>
          <el-menu-item index="6-2" @click="openPage(18)">增加功勋</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="7">
        <template slot="title">
          <i class="el-icon-setting iconfont icon-yuangongguanli"></i>强军风采</template>
        <el-menu-item-group>
          <el-menu-item index="7-1" @click="openPage(19)">个人事迹列表</el-menu-item>
          <el-menu-item index="7-2" @click="openPage(20)">增加个人事迹</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="8">
        <template slot="title">
          <i class="el-icon-user iconfont icon-wode"></i>个人信息</template>
        <el-menu-item-group>
          <el-menu-item index="8-1" @click="openPage(8)">修改个人信息</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  computed: mapState(["adminId", "isSuper"]), //得到vuex 里面的用户信息
  methods: {
    openPage(i) {
      switch (i) {
        case 3:
          this.$router.push("/about");
          break;
        case 5:
          this.$router.push("/troopEdit");
          break;
        case 6:
          this.$router.push("/person");
          break;
        case 7:
          this.$router.push("/editHomeInfo");
          break;
        case 8:
          this.$router.push({ name: "editMe", params: { id: this.adminId } });
          break;
        case 9:
          this.$router.push("/welcome");
          break;
        case 10:
          this.$router.push("/ipaddr");
          break;
        case 11:
          this.$router.push("/troop");
          break;
        case 12:
          this.$router.push("/troopAdd");
          break;
        case 13:
          this.$router.push("/role");
          break;
        case 14:
          this.$router.push("/roleAdd");
          break;
        case 15:
          this.$router.push("/person");
          break;
        case 16:
          this.$router.push("/officer");
          break;
        case 17:
          this.$router.push("/video");
          break;
        case 18:
          this.$router.push("/videoAdd");
          break;
        case 19:
          this.$router.push("/story");
          break;
        case 20:
          this.$router.push("/storyAdd");
          break;
        case 21:
          this.$router.push("/banner");
          break;
        case 22:
          this.$router.push("/bannerAdd");
          break;
        case 23:
          this.$router.push("/label");
          break;
        case 24:
          this.$router.push("/labelAdd");
          break;
      }
    },
  },
};
</script>

<style scoped>
</style>