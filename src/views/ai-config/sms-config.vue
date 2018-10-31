<template>
  <div class="home">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="模板管理" name="template">
        <el-input placeholder="请输入模板名称" class="message-template-searchbox">
          <el-button slot="append" icon="el-icon-search" @click="listMessageTemplate">搜索</el-button>
        </el-input>
        <el-button type="primary" icon="el-icon-plus" @click="editMessageTemplate(null)">新增</el-button>
        <el-table :data="smsTemplateList" stripe style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="messageTemplate-table-expand">
                <el-form-item label="模板名称">
                  <span>{{ scope.row.templateName }}</span>
                </el-form-item>
                <el-form-item label="签名">
                  <span>【{{ scope.row.signName }}】</span>
                </el-form-item>
                <el-form-item label="模板类型">
                  <span>{{ scope.row.templateType.title }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ scope.row.createAt }}</span>
                </el-form-item>
                <el-form-item label="审核状态">
                  <span>{{ scope.row.templateStatus.title }}</span>
                </el-form-item>
                <el-form-item label="模板内容" class="long-text-form-item">
                  <el-input type="textarea" :rows="2" v-model="scope.row.templateContent" :readonly="true" resize="none">
                  </el-input>
                </el-form-item>
                <el-form-item label="申请说明" class="long-text-form-item">
                  <el-input type="textarea" :rows="2" v-model="scope.row.templateDescription" :readonly="true" resize="none">
                  </el-input>
                </el-form-item>
                <el-form-item label="失败理由" class="long-text-form-item">
                  <el-input type="textarea" :rows="1" v-model="scope.row.reason" :readonly="true" resize="none">
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="templateName" label="模板名称">
          </el-table-column>
          <el-table-column label="签名">
            <template slot-scope="scope">
              【{{scope.row.signName}}】
            </template>
          </el-table-column>
          <el-table-column prop="templateType.title" label="模板类型">
          </el-table-column>
          <el-table-column prop="createAt" label="创建时间">
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              {{scope.row.templateStatus.title}}
              <el-tooltip class="item" effect="dark" :content="'未通过原因：'+scope.row.reason" placement="bottom" v-if="scope.row.templateStatus.code === 3">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button-group  v-if="scope.row.templateStatus.code>2">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="editMessageTemplate(scope.row)">编辑</el-button>
                <el-button size="mini" type="info" icon="el-icon-view" @click="updateMessageTemplateStatus(scope.row.id)">提交</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteMessageTemplate(scope.row.id)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="签名管理" name="sign">
        <el-button type="primary" icon="el-icon-plus" @click="editSignature(null)">新增</el-button>
        <el-table :data="signList" stripe style="width: 100%">
          <el-table-column prop="signName" label="签名">
          </el-table-column>
          <el-table-column prop="createAt" label="创建时间">
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              {{scope.row.signStatus.title}}
              <el-tooltip class="item" effect="dark" :content="'未通过原因：'+scope.row.reason" placement="bottom" v-if="scope.row.signStatus.code === 3">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button-group v-if="scope.row.signStatus.code>2">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="editSignature(scope.row)">编辑</el-button>
                <el-button size="mini" type="info" icon="el-icon-view" @click="updateSignatureStatus(scope.row.id)">提交</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteSignature(scope.row.id)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--模板新增/修改对话框-->
    <el-dialog title="模板设置" :visible.sync="smsTemplateDialogVisible" width="30%"
               :before-close="handleSmsTemplateDialogClose">
      <el-form ref="form" :model="messageTemplate" label-width="80px">
        <el-form-item label="模板名称">
          <el-input v-model="messageTemplate.templateName"></el-input>
        </el-form-item>
        <el-form-item label="签名">
          <el-select v-model="messageTemplate.signId" placeholder="请选择签名">
            <el-option v-for="(item) in signList" :key="item.id" :label="item.signName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版类型">
          <el-radio-group v-model="messageTemplate.templateType.code">
            <el-radio :label="1">验证码</el-radio>
            <el-radio :label="2">短信通知</el-radio>
            <el-radio :label="3">推广短信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板内容">
          <el-input type="textarea" v-model="messageTemplate.templateContent"></el-input>
        </el-form-item>
        <el-form-item label="申请说明">
          <el-input type="textarea" v-model="messageTemplate.templateDescription"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="smsTemplateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMessageTemplate">保 存</el-button>
      </span>
    </el-dialog>
    <!--签名新增修改对话框-->
    <el-dialog title="签名设置" :visible.sync="signatureDialogVisible" width="30%"
               :before-close="handleSignatureDialogClose">
      <el-form ref="form" :model="signature" label-width="80px">
        <el-form-item label="模板名称">
          <el-input v-model="signature.signName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="signatureDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSignature">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    deleteMessageTemplate,
    insertMessageTemplate,
    listMessageTemplate,
    MessageTemplate,
    updateMessageTemplate, updateMessageTemplateStatus
  } from '../../api/aiconfig/smsConfig'
  import {
    deleteSignature,
    insertSignature,
    listSignature,
    Signature,
    updateSignature, updateSignatureStatus
  } from '../../api/aiconfig/signConfig'

  export default {
    name: 'sms-template',
    data() {
      return {
        activeName: 'template',
        smsTemplateList: [],
        signList: [],
        messageTemplate: new MessageTemplate(),
        signature: new Signature(),
        smsTemplateDialogVisible: false,
        signatureDialogVisible: false,
        smsTemplateSearchParam: {
          templateName: null
        },
        signSearchParam: {
          templateName: null
        }
      }
    },
    methods: {
      handleClick() {
        return
      },
      handleSmsTemplateDialogClose() {
        this.smsTemplateDialogVisible = false
      },
      editMessageTemplate(messageTemplate) {
        if (messageTemplate == null) {
          messageTemplate = new MessageTemplate()
        }
        this.messageTemplate = JSON.parse(JSON.stringify(messageTemplate))
        this.smsTemplateDialogVisible = true
      },
      handleSignatureDialogClose() {
        this.smsTemplateDialogVisible = false
      },
      editSignature(signature) {
        if (signature == null) {
          signature = new Signature()
        }
        this.signature = JSON.parse(JSON.stringify(signature))
        this.signatureDialogVisible = true
      },
      updateMessageTemplateStatus(id) {
        this.$confirm('确定要提交审核?', '提示', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateMessageTemplateStatus({ id: id }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.listMessageTemplate()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      listMessageTemplate() {
        listMessageTemplate(this.smsTemplateSearchParam).then(res => {
          this.smsTemplateList = res.data.result
        })
      },
      saveMessageTemplate() {
        const data = JSON.parse(JSON.stringify(this.messageTemplate))
        data.templateType = this.messageTemplate.templateType.code
        if (this.messageTemplate.id == null) {
          insertMessageTemplate(data).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.smsTemplateDialogVisible = false
            this.listMessageTemplate()
          })
        } else {
          updateMessageTemplate(data).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.smsTemplateDialogVisible = false
            this.listMessageTemplate()
          })
        }
      },
      deleteMessageTemplate(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMessageTemplate({ id: id }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.listMessageTemplate()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      updateSignatureStatus(id) {
        this.$confirm('确定要提交审核?', '提示', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateSignatureStatus({ id: id }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.listSignature()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      listSignature() {
        listSignature(this.signSearchParam).then(res => {
          this.signList = res.data.result
        })
      },
      saveSignature() {
        if (this.signature.id == null) {
          insertSignature(this.signature).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.signatureDialogVisible = false
            this.listSignature()
          })
        } else {
          updateSignature(this.signature).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.signatureDialogVisible = false
            this.listSignature()
          })
        }
      },
      deleteSignature(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSignature({ id: id }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.listSignature()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    watch: {},
    mounted() {
      this.listMessageTemplate()
      this.listSignature()
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .home {
    padding: 0 10px;
  }
  .message-template-searchbox {
    width: 40%;
  }
  .messageTemplate-table-expand {
    font-size: 0;
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 30%;
    }
    label {
      width: 20%;
      color: #99a9bf;
    }
    .long-text-form-item {
      width: 100%;
      height: 60px;
      line-height: 60px;
      & /deep/ >div {
        width: 65%;
      }
    }
  }
</style>
