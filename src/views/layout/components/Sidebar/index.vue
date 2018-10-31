<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#0e1a35"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <div class="sliebar-logo" :class="{padding2:isCollapse}">
        <svg-icon icon-class="Ai" class="logo"></svg-icon>
        <transition-group name="fade">
          <span v-show="!isCollapse" :key="1">智能贝尔</span>
          <i v-show="!isCollapse" :key="2">v1.2</i>
        </transition-group>
      </div>
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
.sliebar-logo{
  width: 100%;
  height: 70px;
  background-color: #0e1a35;
  padding: 20px;
  position: relative;
  overflow: hidden;
  &.padding2{
    padding: 20px 5px;
  }
  .logo{
    width: 30px;
    height: 30px;
    margin-right: 10px!important;
  }
  span{
    font-size: 16px;
    color: #fff;
    line-height: 30px;
    float: right;
    margin-right: 10px;
  }
  i{
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 12px;
    color: #fff;
    font-style: normal;
    background-color: #ff9900;
    border-radius: 18px;
    height: 18px;
    padding: 0 5px;
    line-height: 18px;
  }
}
</style>
