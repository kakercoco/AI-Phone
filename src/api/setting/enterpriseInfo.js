import request from '@/utils/request'
import $ from 'jquery'

/**
 * 查询企业信息
 * @param data
 */
export function selectEnterpriseInfo(data) {
  return request({
    url: '/enterpriseinfo/selectEnterpriseInfo',
    method: 'post',
    data: $.param(data)
  })
}

/**
 * 根据ID修改企业信息
 * @param data
 */
export function updateEnterpriseInfo(data) {
  return request({
    url: '/enterpriseinfo/updateEnterpriseInfo',
    method: 'post',
    data: $.param(data)
  })
}

class EnterpriseInfo {
  constructor() {
    this.adminName = null
    this.adminNumber = null
    this.adminTelephone = null
    this.auditStatus = null
    this.backCard = null
    this.businessAddress = null
    this.businessLicense = null
    this.createAt = null
    this.createBy = null
    this.description = null
    this.enterpriseName = null
    this.facadeCard = null
    this.handheldCard = null
    this.legalName = null
    this.legalNumber = null
    this.modifyAt = null
    this.modifyBy = null
    this.numberApplication = null
    this.onlinePromise = null
    this.organizationCodeCertificate = null
    this.registrationCertificate = null
    this.socialCreditCode = null
    this.threeCard = null
    this.threeCardSyncretic = null
  }
}
export { EnterpriseInfo }
