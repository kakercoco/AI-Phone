<template>
  <div class="login-container">
    <div class="layer bg" id="login"></div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
             label-position="left">
      <el-card>
        <h3 class="title">智能贝尔后台管理系统</h3>
        <el-form-item prop="username">
          <el-col :span="2">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user"></svg-icon>
            </span>
          </el-col>
          <el-col :span="16">
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" maxlength="20"></el-input>
          </el-col>
          <el-col :span="4" class="fr">
            <el-tooltip class="item" effect="dark" content="点击扫码登录，仅适用于管理员账号" placement="bottom">
              <span @click="showWxCode" class="svg-qrcode">
                <svg-icon icon-class="QRCode"></svg-icon>
              </span>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item prop="password">
          <el-col :span="2">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
          </el-col>
          <el-col :span="16">
            <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on"
                      placeholder="密码" maxlength="20"></el-input>
          </el-col>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
        </el-form-item>
        <el-form-item prop="kaptcha">
          <el-col :span="16">
            <el-input v-model="loginForm.kaptcha" @keyup.enter.native="handleLogin" placeholder="验证码" maxlength="4"></el-input>
          </el-col>
          <el-col :span="6" class="fr">
            <img :src="codeSrc" @click="getCode" alt="" class="code fl">
          </el-col>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" class="login-rememberme">记住我</el-checkbox>
        <el-checkbox :true-label="1" :false-label="2" v-model="loginForm.type" @keyup.enter.native="handleLogin" class="login-type">管理员</el-checkbox>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <el-dialog title="微信登录" :visible.sync="dialogVisible" width="450px" :before-close="closeWxLogin">
          <p v-if="!wxCodeShow" class="wx-login-tip">二维码失效，请<a @click="reloadCode">重新获取</a></p>
          <img :src="wxCode" alt="" v-if="wxCodeShow" class="wx-login-img">
        </el-dialog>
      </el-card>
    </el-form>
    <el-dialog title="绑定账户" :visible.sync="dialogFormVisible" class="binding-from" width="450px">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBind">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  require('particles.js')
  import config from './config/nasa'

  export default {
    name: 'login',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          kaptcha: '',
          rememberMe: true,
          type: 2
        },
        dialogVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '80px',
        form: {
          username: '',
          password: ''
        },
        codeSrc: process.env.BASE_API + '/kaptcha/secode',
        wxCode: '',
        wxCodeShow: false,
        time: '',
        loginRules: {
          username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }],
          kaptcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
        },
        loading: false,
        pwdType: 'password'
      }
    },
    methods: {
      closeWxLogin() {
        this.dialogVisible = false
        this.wxCode = ''
        clearInterval(this.time)
      },
      showWxCode() {
        this.wxCodeShow = true
        this.dialogVisible = true
        this.wxCode = process.env.BASE_API + '/kaptcha/wxLoginQrCode?' + Math.random()
        var time = setInterval(() => {
          this.$store.dispatch('WxLogin').then((res) => {
            if (res === 2) {
              // 正常跳转首页
              clearInterval(time)
              this.$router.push({ path: '/' })
            } else if (res === 1) {
              // 绑定账户
              clearInterval(time)
              this.dialogFormVisible = true
            } else if (res === -1) {
              // 二维码超时 重新获取二维码
              this.wxCodeShow = false
              clearInterval(time)
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }, 300)
        this.time = time
      },
      reloadCode() {
        this.showWxCode()
      },
      sureBind() {
        this.$store.dispatch('BindLogin', this.form).then(() => {
          this.loading = false
          this.$router.push({ path: '/' })
        }).catch(() => {
          this.loading = false
        })
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      getCode() {
        this.codeSrc = process.env.BASE_API + '/kaptcha/secode?' + Math.random()
      }
    },
    mounted() {
      // eslint-disable-next-line
      particlesJS('login', config)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .layer {
      position: absolute;
      height: 100%;
      width: 100%;
      &.flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
    }
    // 背景
    .bg {
      canvas {
        display: block;
        margin: 0;
        padding: 0;
      }
    }
    .login-form {
      .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
          background: transparent;
          border: 0;
          -webkit-appearance: none;
          border-radius: 0;
          padding: 12px 5px 12px 15px;
          color: #2d3a4b;
          height: 47px;
          &:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px #e5e5e5 inset !important;
            -webkit-text-fill-color: #2d3a4b !important;
          }
        }
      }
      .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
      }
      .login-rememberme {
        margin-left: 2px;
        margin-bottom: 15px;
      }
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    // position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .code {
      width: 100px;
      cursor: pointer;
      margin-top: 5px;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .svg-qrcode{
      font-size: 40px;
      position: relative;
      right: -20px;
      top: 5px;
      cursor: pointer;
    }
    .title {
      font-size: 26px;
      color: #2d3a4b;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .login-type {
      color: #409EFF;
      float: right;
      font-size: 14px;
    }
    .wx-login-img {
      width: 400px;
      height: 400px;
      display: block;
      margin: 0 auto;
    }
    .wx-login-tip {
      width: 100%;
      height: 400px;
      text-align: center;
      line-height: 400px;
      font-size: 20px;
      a {
        color: #409EFF;
      }
    }
    .binding-from {
      .el-input {
        width: 300px;
      }
    }
  }
</style>
