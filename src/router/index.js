import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }

]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/clientManager',
    component: Layout,
    redirect: '/clientManager/index',
    meta: { title: 'CRM', icon: 'peoples', roles: ['/clientManager/index'] },
    name: 'CRM',
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'clientManager',
        component: () => import('@/views/client-manager/index'),
        meta: { title: '客户管理', roles: ['/clientManager/index'] }
      },
      {
        path: 'blacklist',
        name: 'blacklist',
        component: () => import('@/views/client-manager/blacklist'),
        meta: { title: '黑名单', roles: ['/clientManager/blacklist'] }
      }
    ]
  },

  {
    path: '/taskManger',
    component: Layout,
    redirect: '/taskManger/index',
    name: '任务管理',
    alwaysShow: true,
    meta: { title: '任务管理', icon: 'theme', roles: ['/taskManger/index', '/taskManger/detail', '/taskManger/more', '/taskManger/export', '/manage/count'] },
    children: [
      {
        path: 'callTask',
        name: 'callTask',
        component: () => import('@/views/task-manager/callTask'),
        meta: { title: '外呼任务' }
      },
      {
        path: 'detail',
        name: 'callDetail',
        component: () => import('@/views/task-manager/callDetail'),
        meta: { title: '通话记录', roles: ['/taskManger/detail'] }
      },
      {
        path: 'export',
        name: 'export',
        component: () => import('@/views/task-manager/export'),
        meta: { title: '导入导出记录' }
      },
      {
        path: 'count',
        component: () => import('@/views/manage/count'),
        name: 'manage',
        meta: { title: '统计分析', roles: ['/manage/count'] }
      }
    ]
  },

  {
    path: '/AiConfig',
    component: Layout,
    redirect: '/AiConfig/index',
    name: 'AI配置',
    meta: { title: 'AI配置', icon: 'dashboard', roles: ['/AiConfig/index', '/AiConfig/sms-template'] },
    alwaysShow: true,
    children: [
      {
        path: 'home',
        name: 'Aihome',
        component: () => import('@/views/ai-config/index'),
        meta: { title: '话术配置' },
        hidden: false
      },
      {
        path: 'sms-config',
        name: '短信模板',
        component: () => import('@/views/ai-config/sms-config'),
        meta: { title: '短信配置' },
        hidden: false
      }

    ]
  },

  {
    path: '/setting',
    component: Layout,
    meta: { title: '设置', icon: 'setting', roles: ['/setting/enterpriseInfo'] },
    name: '设置',
    alwaysShow: true,
    children: [{
      path: 'enterpriseInfo',
      component: () => import('@/views/setting/enterpriseInfo'),
      name: 'enterpriseInfo',
      meta: { title: '企业信息', roles: ['/setting/enterpriseInfo'] }
    }]
  },
  {
    path: '/form',
    component: Layout,
    hidden: true,
    meta: {
      // roles: ['/form/index']
    },
    children: [
      {
        path: 'index',
        name: '修改密码',
        component: () => import('@/views/form/index'),
        meta: { title: '修改密码', icon: 'form' }
      }
    ]
  },
  {
    path: '/department',
    component: Layout,
    redirect: '/department/staff',
    meta: { title: '组织管理', icon: 'manage', roles: ['/department/staff', '/department/role'] },
    name: '组织管理',
    alwaysShow: true,
    children: [
      {
        path: 'staff',
        component: () => import('@/views/department/staff'),
        name: 'department',
        meta: { title: '员工管理', roles: ['/department/staff'] }
      },
      {
        path: 'role',
        component: () => import('@/views/department/role'),
        name: 'role',
        meta: { title: '角色管理', roles: ['/department/role'] }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
