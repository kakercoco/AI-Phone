<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <div  class="login-oa">
      <el-button type="primary" plain @click="loginOA" :disabled="hasPerm('user:loginOA')">进入信息化系统</el-button>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
        <span class="user-name">{{userName}}</span>
        <i class="el-icon-arrow-down"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/form/index">
          <el-dropdown-item>
            修改密码
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span  style="display:block;">登出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { logout, loginUserName, loginOA } from '@/api/login'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userName: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    getLoginUserName() {
      loginUserName()
        .then(res => {
          this.userName = res.data.result
        })
    },
    loginOA() {
      loginOA()
        .then(res => {
          window.location.href = res.data.result
        })
    },
    logout() {
      logout().then(res => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
        .catch(() => {
        })
      // this.$store.dispatch('LogOut').then(() => {
      //   location.reload() // 为了重新实例化vue-router对象 避免bug
      // })
    }
  },
  mounted() {
    this.getLoginUserName()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 70px;
  line-height: 70px;
  border-radius: 0px !important;
  overflow: hidden;
  .hamburger-container {
    line-height: 78px;
    height: 70px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .login-oa{
    position: absolute;
    right: 200px;
    height: 70px;
    line-height: 70px;
    top: 0;
  }
  .avatar-container {
    height: 70px;
    display: inline-block;
    position: absolute;
    right: 15px;
    .avatar-wrapper {
      .user-name{
        margin-left: 10px;
        margin-right: 10px;
      }
      cursor: pointer;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        float: left;
        margin-top: 15px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

