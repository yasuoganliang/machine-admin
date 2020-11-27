import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue'),
    // 默认跳转的子路由
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import(/* webpackChunkName: "about" */ '../views/welcome/Welcome')
      },
      {
        // 分队信息列表
        path: '/troop',
        name: 'troop',
        component: () => import('../views/troop/Troop')
      },
      {
        path: '/troopAdd',
        name: 'troopAdd',
        component: () => import('../views/troop/TroopAdd.vue')
      },
      {
        path: '/troopEdit',
        name: 'troopEdit',
        component: () => import('../views/troop/TroopEdit.vue')
      },
      {
        path: '/troopInfo',
        name: 'troopInfo',
        component: () => import('../views/troop/TroopInfo.vue')
      },
      {
        path: '/editHomeInfo',
        name: 'editHomeInfo',
        component: () => import('../views/troop/EditHomeInfo.vue')
      },
      {
        // 管理员角色列表
        path: '/role',
        name: 'role',
        component: () => import('../views/role/Role')
      },
      {
        path: '/roleAdd',
        name: 'roleAdd',
        component: () => import('../views/role/RoleAdd.vue')
      },
      {
        path: '/roleEdit/:id',
        name: 'roleEdit',
        component: () => import('../views/role/RoleEdit.vue')
      },
      {
        path: '/roleInfo',
        name: 'roleInfo',
        component: () => import('../views/role/RoleInfo.vue')
      },
      {
        // 管理员角色列表
        path: '/label',
        name: 'label',
        component: () => import('../views/label/label')
      },
      {
        path: '/labelAdd',
        name: 'labelAdd',
        component: () => import('../views/label/LabelAdd.vue')
      },
      {
        path: '/labelEdit/:id',
        name: 'labelEdit',
        component: () => import('../views/label/LabelEdit.vue')
      },
      {
        // 官兵信息列表
        path: '/person',
        name: 'person',
        component: () => import('../views/person/Person')
      },
      {
        path: '/personAdd',
        name: 'personAdd',
        component: () => import('../views/person/PersonAdd.vue')
      },
      {
        path: '/personEdit/:id',
        name: 'personEdit',
        component: () => import('../views/person/PersonEdit.vue')
      },
      {
        path: '/personInfo',
        name: 'personInfo',
        component: () => import('../views/person/PersonInfo.vue')
      },
      {
        // 官兵信息列表
        path: '/officer',
        name: 'officer',
        component: () => import('../views/officer/Officer')
      },
      {
        path: '/officerAdd',
        name: 'officerAdd',
        component: () => import('../views/officer/OfficerAdd.vue')
      },
      {
        path: '/officerEdit/:id',
        name: 'officerEdit',
        component: () => import('../views/officer/OfficerEdit.vue')
      },
      {
        // 视频列表
        path: '/video',
        name: 'video',
        component: () => import('../views/video/Video')
      },
      {
        path: '/videoAdd',
        name: 'videoAdd',
        component: () => import('../views/video/VideoAdd.vue')
      },
      {
        path: '/videoEdit/:id',
        name: 'videoEdit',
        component: () => import('../views/video/VideoEdit.vue')
      },
      {
        path: '/videoInfo',
        name: 'videoInfo',
        component: () => import('../views/video/VideoInfo.vue')
      },
      {
        // 个人事迹列表
        path: '/story',
        name: 'story',
        component: () => import('../views/story/Story')
      },
      {
        path: '/storyAdd',
        name: 'storyAdd',
        component: () => import('../views/story/StoryAdd.vue')
      },
      {
        path: '/storyEdit/:id',
        name: 'storyEdit',
        component: () => import('../views/story/StoryEdit.vue')
      },
      {
        path: '/storyInfo',
        name: 'storyInfo',
        component: () => import('../views/story/StoryInfo.vue')
      },
      {
        // 幻灯片列表
        path: '/banner',
        name: 'banner',
        component: () => import('../views/banner/Banner')
      },
      {
        path: '/bannerAdd',
        name: 'bannerAdd',
        component: () => import('../views/banner/BannerAdd.vue')
      },
      {
        path: '/bannerEdit/:id',
        name: 'bannerEdit',
        component: () => import('../views/banner/BannerEdit.vue')
      },
      {
        path: '/bannerInfo',
        name: 'bannerInfo',
        component: () => import('../views/banner/BannerInfo.vue')
      },
      {
        // 幻灯片列表
        path: '/ipaddr',
        name: 'ipaddr',
        component: () => import('../views/ipaddr/Ipaddr')
      },
      {
        path: '/ipaddrAdd',
        name: 'ipaddrAdd',
        component: () => import('../views/ipaddr/IpaddrAdd.vue')
      },
      {
        path: '/ipaddrEdit/:id',
        name: 'ipaddrEdit',
        component: () => import('../views/ipaddr/IpaddrEdit.vue')
      },
      {
        // 关于应用页面
        path: '/about',
        name: 'about',
        component: () => import('../views/about/About.vue')
      },
      {
        // 编辑个人基本信息页面
        path: '/editMe/:id',
        name: 'editMe',
        component: () => import('../views/personnel/UserEdit2.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue')
  }
]

const router = new VueRouter({
  routes
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  if (to.path == '/login') {
    // console.log("登录页面");
    next();
  } else {
    let token = sessionStorage.getItem('token');
    // console.log(token);
    // 这个 null 不是字符串 'null'
    if (token == null || token == '') {
      // console.log('跳转页面')
      // 如果没有token， 即没有登录， 则跳转登录页面
      next('/login');
      // next();
    } else {
      next();
    }
  }
});

export default router
