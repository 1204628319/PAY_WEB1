<template>
  <div class="login">
    <div class="login-right">
      <div class="login-right-form">
        <h4>绿呗支付</h4>
        <div v-show="loginType === 'account'" class="login-form">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form-content">
            <el-form-item prop="username">
              <el-input v-model.trim="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon" style="width: 13px;margin-left: 2px;" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model.trim="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix" icon-class="password" class="el-input__icon" style="width: 13px;margin-left: 2px;" />
              </el-input>
            </el-form-item>
            <div class="pwd-block" />
            <el-form-item style="width:100%;">
              <el-button :loading="loading" class="login-button" @click.native.prevent="handleLogin">
                <span v-if="!loading">{{ '登 录' }}</span>
                <span v-else>{{ '登 录 中...' }}</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data() {
    return {
      loginType: 'account',
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        imageCode: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      redirect: undefined,
      showValidCode: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.loginByAccount()
  },
  methods: {
    loginByAccount() {
      this.getCookie()
    },
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = 'data:image/gif;base64,' + res.imageCodeBase64
        this.loginForm.uuid = res.uuid
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        imageCode: ''
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          //  判断是否有code,如有code则为微信绑定账号
          let params = this.loginForm
          this.$store.dispatch('user/login', params)
            .then(() => {
              this.$router.push('/')
            })
            .catch((err) => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    animation: backImgChange 90s linear 0s infinite normal;
    &::after{
      content: '';
      background: url("../../assets/images/cat.jpg");
      background-size: 100% 100%;
    }
    &-left{
      width: 73%;
      height: 100%;
      // background: rgb(44, 59, 77);
      display: flex;
      align-items: center;
      &-img{
        width: 100%;
        img{
          width: 394px;
          height: 358px;
          display: block;
          margin: 0 auto;
        }
      }
    }
    &-right{
      width: 40%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      &-form{
        position: relative;
        h4{
          text-align: center;
          width: 100%;
          color: #fff;
          font-size: 20Px;
          font-weight: normal;
        }
      }
    }
  }
  .title {
    margin: 80px auto 60px auto;
    font-size: 19px;
    text-align: center;
    color: #253040;
  }

  .login-form {
    width: 380px;
    padding: 45px 25px 0 25px;
    .wx-tip{
      color: #fff;
    }
    .el-input {
      height: 38Px;
      input {
        height: 38Px;
        background: transparent;
        border-width: 0 0 1px 0;
        color: #fff;
        font-size: 12Px;
        border-color: #fff;
        border-radius: 0;
      }
      .el-input__prefix{
        color: #fff;
        font-size: 18Px;
        line-height: 38Px;
      }
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    float: right;
    img{
      cursor: pointer;
      vertical-align:middle;
      width: 100%;
    }
  }
  .pwd-block{
    position: relative;
    .forget-pwd{
      position: absolute;
      right: 0;
      top: 0;
      padding: 0;
    }
  }
  .login-button{
    width:100%;
    height:50px;
    font-size: 17px;
    border-radius: 8px;
    background: #fff;
    color: #333;
    margin-top: 40px;
  }
  .company-tips{
    position: absolute;
    bottom: 40px;
    color: #fff;
    font-size: 12Px;
    margin: 0 auto;
    left: 0;
    right: 0;
    text-align: center;
  }

  @keyframes backImgChange
    {
      0%   { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      33%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      34%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      67%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      68%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      100% { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
    }

  @-moz-keyframes backImgChange
    {
      0%   { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      33%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      34%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      67%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      68%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      100% { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
    }

  @-webkit-keyframes backImgChange
    {
      0%   { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      33%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      34%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      67%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      68%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      100% { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
    }
  @-o-keyframes backImgChange
  {
      0%   { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      33%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      34%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      67%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      68%  { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
      100% { background: url('../../assets/images/cat.jpg') no-repeat; background-size: 100% 100%; }
  }

  .qr-code{
    padding: 0;
    text-align: right;
    display: block;
    img{
      width: 35px;
      height: 35px;
      &:hover{
        cursor: pointer;
      }
    }
  }
  .qr-login{
    padding-top: 0;
    height: 320px;
  }
  .qr-content{
    background: #fff;
    border-radius: 10px;
    height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    .iframe-content{
      width: 100%;
      height: 100%;
      iframe{
        border-radius: 10px;
        padding: 10px 10px 25px 10px;
      }
    }
  }
  .qr-loading{
    background: red;
  }
</style>
