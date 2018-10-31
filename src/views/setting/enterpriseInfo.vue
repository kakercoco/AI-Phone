/*
* @Author: kaker.xutianxing
* @Date: 2018-05-18 14:03:10
* @Last Modified by: kaker.xutianxing
* @Last Modified time: 2018-06-28 15:00:41
*/
<template>
  <div class="main-container">
    <div class="enterprise-info-form" v-loading="enterpriseInfoLoading">
    <el-form ref="enterpriseInfo" :model="enterpriseInfo" label-width="20%">
      <el-form-item label="企业名称">
        <el-input v-model="enterpriseInfo.enterpriseName"></el-input>
      </el-form-item>
      <el-form-item label="统一社会信用代码">
        <el-input v-model="enterpriseInfo.socialCreditCode"></el-input>
      </el-form-item>
      <el-form-item label="营业执照地址">
        <el-input v-model="enterpriseInfo.businessAddress"></el-input>
      </el-form-item>
      <el-form-item label="法人名称">
        <el-input v-model="enterpriseInfo.legalName"></el-input>
      </el-form-item>
      <el-form-item label="法人证件号码">
        <el-input v-model="enterpriseInfo.legalNumber"></el-input>
      </el-form-item>
      <el-form-item label="三证合一">
        <el-switch v-model="enterpriseInfo.threeCard" :active-value="1" :inactive-value="2">
        </el-switch>
      </el-form-item>
      <el-form-item label="企业证明文件">
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleThreeCardSyncreticSuccess"
          :before-upload="beforeAvatarUpload" v-if="enterpriseInfo.threeCard === 1">
          <img v-if="enterpriseInfo.threeCardSyncretic" :src="baseUrl+enterpriseInfo.threeCardSyncretic" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
          <div class="el-upload__tip" slot="tip">三证合一</div>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleBusinessLicenseSuccess"
          :before-upload="beforeAvatarUpload" v-if="enterpriseInfo.threeCard !== 1">
          <img v-if="enterpriseInfo.businessLicense" :src="baseUrl+enterpriseInfo.businessLicense" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
          <div class="el-upload__tip" slot="tip">工商营业执照</div>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleRegistrationCertificateSuccess"
          :before-upload="beforeAvatarUpload"  v-if="enterpriseInfo.threeCard !== 1">
          <img v-if="enterpriseInfo.registrationCertificate" :src="baseUrl+enterpriseInfo.registrationCertificate" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">税务登记证</div>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleOrganizationCodeCertificateSuccess"
          :before-upload="beforeAvatarUpload"  v-if="enterpriseInfo.threeCard !== 1">
          <img v-if="enterpriseInfo.organizationCodeCertificate" :src="baseUrl+enterpriseInfo.organizationCodeCertificate" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">组织机构代码证</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="管理员姓名">
        <el-input v-model="enterpriseInfo.adminName"></el-input>
      </el-form-item>
      <el-form-item label="管理员身份证号">
        <el-input v-model="enterpriseInfo.adminNumber"></el-input>
      </el-form-item>
      <el-form-item label="管理员联系方式">
        <el-input v-model="enterpriseInfo.adminTelephone" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="管理员证件">
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleFacadeCardSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="enterpriseInfo.facadeCard" :src="baseUrl+enterpriseInfo.facadeCard" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">身份证正面照</div>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleBackCardSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="enterpriseInfo.backCard" :src="baseUrl+enterpriseInfo.backCard" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">身份证背面照</div>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleHandheldCardSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="enterpriseInfo.handheldCard" :src="baseUrl+enterpriseInfo.handheldCard" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">手持身份证照</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="入网证明">
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleOnlinePromiseSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="enterpriseInfo.onlinePromise" :src="baseUrl+enterpriseInfo.onlinePromise" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">入网承诺书</div>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/enterpriseinfo/uploadPicToUrl'"
          :withCredentials="true"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :on-success="handleNumberApplicationSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="enterpriseInfo.numberApplication" :src="baseUrl+enterpriseInfo.numberApplication" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">入网申请公函</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="申请说明">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 5}"
          placeholder="请输入申请说明"
          v-model="enterpriseInfo.description">
        </el-input>
      </el-form-item>
      <el-form-item>
        <p style="color: red;">注意：只支持jpg、png、gif格式的图片，每张图片不大于2M</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateEnterpriseInfo">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script>
  import { EnterpriseInfo, selectEnterpriseInfo, updateEnterpriseInfo } from '../../api/setting/enterpriseInfo'

  export default {
    name: 'enterpriseInfo',
    data() {
      return {
        baseUrl: `${process.env.BASE_API}`,
        imageUrl: '',
        enterpriseInfo: new EnterpriseInfo(),
        enterpriseInfoLoading: true
      }
    },
    methods: {
      // 三证合一
      handleThreeCardSyncreticSuccess(res, file) {
        this.enterpriseInfo.threeCardSyncretic = res.result
      },
      // 工商营业执照
      handleBusinessLicenseSuccess(res, file) {
        this.enterpriseInfo.businessLicense = res.result
      },
      // 税务登记证
      handleRegistrationCertificateSuccess(res, file) {
        this.enterpriseInfo.registrationCertificate = res.result
      },
      // 组织机构代码证
      handleOrganizationCodeCertificateSuccess(res, file) {
        this.enterpriseInfo.organizationCodeCertificate = res.result
      },
      // 管理员身份证正面照
      handleFacadeCardSuccess(res, file) {
        this.enterpriseInfo.facadeCard = res.result
      },
      // 管理员身份证背面照
      handleBackCardSuccess(res, file) {
        this.enterpriseInfo.backCard = res.result
      },
      // 管理员手持身份证照
      handleHandheldCardSuccess(res, file) {
        this.enterpriseInfo.handheldCard = res.result
      },
      // 入网承诺书
      handleOnlinePromiseSuccess(res, file) {
        this.enterpriseInfo.onlinePromise = res.result
      },
      // 入网申请公函
      handleNumberApplicationSuccess(res, file) {
        this.enterpriseInfo.numberApplication = res.result
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg png gif 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      updateEnterpriseInfo() {
        this.$confirm('确定保存信息吗?', '提示', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.enterpriseInfoLoading = true
          updateEnterpriseInfo(this.enterpriseInfo).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.selectEnterpriseInfo()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      selectEnterpriseInfo() {
        selectEnterpriseInfo({}).then(res => {
          this.enterpriseInfo = res.data.result
          this.enterpriseInfoLoading = false
        })
      }
    },
    mounted() {
      this.selectEnterpriseInfo()
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  body {
    margin: 0;
  }
  .main-container{
    overflow-y: auto;
    height: 100%;
  }
  .enterprise-info-form {
    width: 60%;
    padding: 20px;
    .avatar-uploader {
      float: left;
      margin-right: 20px;
      & /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-upload:hover {
        border-color: #409EFF;
      }
      & /deep/ .el-upload__tip {
        margin-top: -10px;
        text-align: center;
      }
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }


</style>
