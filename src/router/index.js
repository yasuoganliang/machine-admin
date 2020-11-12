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
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: "about" */ '../views/employee/User')
      },
      {
        path: '/job',
        name: 'job',
        component: () => import(/* webpackChunkName: "about" */ '../views/job/job.vue')
      },
      {
        // 关于应用页面
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/about/About.vue')
      },
      {
        // 用户信息页面
        path: '/userInfo/:id',
        name: 'userInfo',
        component: () => import('../views/employee/UserInfo.vue')
      },
      {
        // 增加员工页面
        path: '/userAdd',
        name: 'userAdd',
        component: () => import('../views/employee/UserAdd.vue')
      },
      {
        // 编辑用户信息页面
        path: '/userEdit/:id',
        name: 'userEdit',
        component: () => import('../views/employee/UserEdit.vue')
      },
      {
        // 编辑个人基本信息页面
        path: '/editMe/:id',
        name: 'editMe',
        component: () => import('../views/employee/UserEdit2.vue')
      },
      {
        // 部门列表
        path: '/deptlist',
        name: 'deptlist',
        component: () => import('../views/department/Department.vue')
      },
      {
        // 添加部门
        path: '/addDept',
        name: 'addDept',
        component: () => import('../views/department/Add.vue')
      },
      {
        path: '/personnelList',
        name: 'personnelList',
        component: () => import('../views/personnel/List.vue')
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
  console.log(to);
  console.log(from);
  if (to.path == '/login') {
    console.log("登录页面");
    next();
  } else {
    let token = sessionStorage.getItem('token');
    console.log(token);
    // 这个 null 不是字符串 'null'
    if (token == null || token == '') {
      console.log('跳转页面')
      // 如果没有token， 即没有登录， 则跳转登录页面
      next('/login');
      // next();
    } else {
      next();
    }
  }
});

export default router
