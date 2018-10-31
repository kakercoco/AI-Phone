import { login, logout, getInfo, listUserPermission, checkScanStatus, bindAccount } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRouterMap, constantRouterMap } from '@/router'

/**
* 通过meta.role判断是否与当前用户权限匹配
* @param roles
* @param route
*/
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}
/**
* 递归过滤异步路由表，返回符合用户角色权限的路由表
* @param asyncRouterMap
* @param roles
*/
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    isLogin: true,
    routers: constantRouterMap,
    addRouters: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    CHANGE_LOGIN: (state) => {
      state.isLogin = !state.isLogin
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },

  actions: {
    // 微信登录
    WxLogin({ commit }) {
      return new Promise((resolve, reject) => {
        checkScanStatus().then(res => {
          if (res.data.result === 2) {
            setToken('admin')
            commit('SET_TOKEN', 'admin')
          }
          resolve(res.data.result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 绑定二维码之后登录
    BindLogin({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        bindAccount(userInfo).then(response => {
          setToken('admin')
          commit('SET_TOKEN', 'admin')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Login({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          setToken('admin')
          commit('SET_TOKEN', 'admin')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取权限信息
    GetRole({ commit }, data) {
      return new Promise(resolve => {
        const roles = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    // 获取用户信息角色
    GetUserRole({ commit, state }) {
      return new Promise((resolve, reject) => {
        listUserPermission().then(response => {
          const data = response.data.result
          if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    changeLogin({ commit }) {
      return new Promise(resolve => {
        commit('CHANGE_LOGIN')
      })
    }
  }
}

export default user
