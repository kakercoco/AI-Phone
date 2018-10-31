/*
 * @Author: kaker.xutianxing
 * @Date: 2018-05-14 14:31:32
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-07-25 16:55:05
 */
<template>
  <div class="client-manager">
    <div class="top">
      <el-row>
        <el-col :span="5">
          <el-input v-model="searchParam.name" placeholder="请输入客户名称" clearable></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="searchParam.contact" placeholder="请输入联系方式" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" @click="listCustomer" :disabled="hasPerm('customer:listCustomer')">搜索</el-button>
        </el-col>
        <el-col :span="10">
          <el-button-group class="fr">
            <el-button type="primary" icon="el-icon-plus" @click="editCustomer" :disabled="hasPerm('customer:insertCustomer')">新建客户</el-button>
            <el-button type="primary" icon="el-icon-phone" @click="addCallTask" :disabled="hasPerm('customer:insertToCallTask')">加入外呼</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCustomers" :disabled="hasPerm('customer:deleteCustomer')">删除</el-button>
            <el-button type="info" icon="el-icon-upload2" @click="outExport" :disabled="hasPerm('customer:downloadCustomer')">导出</el-button>
            <el-button type="primary" icon="el-icon-download" @click="openExport" :disabled="hasPerm('customer:importCustomer')">导入</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-dialog title="设置客户信息" :visible.sync="dialogVisible" width="500px" class="customerinfo-dialog">
        <el-form :model="customer" ref="customer" label-width="100px">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="customer.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="customer.contact"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="customer.companyName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveCustomer">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog title="AI外呼" :visible.sync="chooseTaskDialogVisible" width="500px">
        <el-form :model="customer" ref="customerChoose" label-width="100px">
          <el-form-item label="选择任务" prop="select">
            <el-select v-model="choosedTaskId" placeholder="请选择任务" filterable>
              <el-option :label="item.taskName" :value="item.taskId" v-for="(item,index) in selectTaskOption" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="chooseTaskDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="insertToCallTask">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog title="提示" :visible.sync="unexport" width="500px" :before-close="exportClose" class="call-dialog">
        <p>
          第一步：下载导入模板文件
          <a href="https://aibell.dongchali.net/resource/template/客户模板.xlsx" class="downloadT">下载模板</a>
        </p>
        <p class="upload">
          <i class="fl" style="margin-right:5px;">第二步：上传文件</i>
          <el-upload class="upload-demo fl" ref="upload" :http-request="myRequest" :action="action" :on-success="mySuccess" :limit="1" :show-file-list="true" :with-credentials='true' :auto-upload="false" :file-list="fileList">
            <el-button size="mini" plain @click="clearFile">点击上传</el-button>
          </el-upload>
        </p>
        <p style="clear:both;">
          <i class="fl">提 示：</i>
          <span class="tip">文件格式必须是.xls或.xlsx扩展名</span>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportClose">取 消</el-button>
          <el-button type="primary" @click="uploadExcel">确 定</el-button>
        </span>
       </el-dialog>
    </div>
    <div class="table">
      <el-table v-loading="searchParam.loading" :data="customerList" class="mytable" @selection-change="handleSelectionChange" height="100%">
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="name" label="客户名称">
        </el-table-column>
        <el-table-column prop="contact" label="联系方式">
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称">
        </el-table-column>
        <el-table-column prop="responsible" label="负责人">
        </el-table-column>
        <el-table-column prop="lastCallTask" label="最近AI外呼任务">
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间">
        </el-table-column>
         <el-table-column label="操作" class-name="do" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCustomer(scope.row)" :disabled="hasPerm('customer:updateCustomer')"></el-button>
              <!--<el-button size="mini" type="primary" icon="el-icon-view" :disabled="hasPerm('customer:deleteCustomer')" @click="customerDetailSlideVisible=true"></el-button>-->
              <el-button size="mini" type="primary" icon="el-icon-delete" @click="deleteCustomer(scope.row.id)" :disabled="hasPerm('customer:deleteCustomer')"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParam.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="searchParam.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParam.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { listCustomer, deleteCustomer, insertCustomer, insertToCallTask, selectAiCallTaskName, downloadCustomer, updateCustomer, Customer } from '@/api/customer'
import axios from 'axios'

export default {
  name: 'clientManager',
  data() {
    return {
      action: process.env.BASE_API + '/customer/importCustomer',
      customerIdList: [],
      dialogVisible: false,
      chooseTaskDialogVisible: false,
      customerDetailSlideVisible: false,
      unexport: false,
      fileList: [],
      searchParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: '',
        contact: '',
        loading: false
      },
      customer: new Customer(),
      choosedTaskId: null,
      selectTaskOption: [],
      customerList: []
    }
  },
  methods: {
    openExport() {
      this.unexport = true
    },
    outExport() {
      downloadCustomer(this.searchParam)
        .then(res => {
          if (res.data.resultCode === 200) {
            window.location.href = res.data.result
          }
        })
    },
    handleSizeChange(val) {
      this.searchParam.pageSize = val
      this.listCustomer()
    },
    handleCurrentChange(val) {
      this.searchParam.pageNum = val
      this.listCustomer()
    },
    editCustomer(row) {
      this.dialogVisible = true
      this.customer = new Customer()
      if (row != null) {
        this.customer = JSON.parse(JSON.stringify(row))
      }
    },
    saveCustomer(formName) {
      this.dialogVisible = false
      this.chooseTaskDialogVisible = false
      if (this.customer.id == null) {
        insertCustomer(this.customer).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.listCustomer()
        })
      } else {
        updateCustomer(this.customer).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.listCustomer()
          this.customer = new Customer()
        })
      }
    },
    exportClose() {
      this.unexport = false
      this.$refs.upload.clearFiles()
    },
    mySuccess(res, file) {
    },
    clearFile() {
      this.$refs.upload.clearFiles()
    },
    myRequest(content) {
      const file = content.file
      const isLt2M = file.size / 1024 / 1024 < 20
      const param = new FormData() // 创建form对象
      param.append('excelFile', file) // 通过append向form对象添加数据
      param.append('callTaskId', this.$route.query.callTaskId) // 通过append向form对象添加数据
      if (file.name.indexOf('.xls') === -1) {
        this.$message.error('上传文件格式错误!!!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        return false
      }
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      } // 添加请求头
      axios
        .post(
          `${process.env.BASE_API}/customer/importCustomer`,
          param,
          config
        )
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.listCustomer()
        })
    },
    uploadExcel() {
      this.unexport = false
      this.$refs.upload.submit()
      this.$refs.upload.clearFiles()
    },
    listCustomer() {
      this.searchParam.loading = true
      listCustomer(this.searchParam).then(res => {
        this.customerList = res.data.result.list
        this.searchParam.total = res.data.result.total
        this.searchParam.loading = false
      })
    },
    handleSelectionChange(val) {
      this.customerIdList = []
      for (let i = 0; i < val.length; i++) {
        this.customerIdList.push(val[i].id)
      }
    },
    deleteCustomer(val) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          deleteIds: val
        }
        deleteCustomer(data)
          .then(res => {
            this.listCustomer()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      }).catch(() => {})
    },
    deleteCustomers() {
      if (this.customerIdList.length > 0) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {
            deleteIds: this.customerIdList
          }
          deleteCustomer(data)
            .then(res => {
              this.listCustomer()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
        }).catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的客户'
        })
      }
    },
    addCallTask() {
      if (this.customerIdList.length > 0) {
        this.chooseTaskDialogVisible = true
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要添加任务的客户'
        })
      }
    },
    insertToCallTask() {
      const data = {
        customerIdList: this.customerIdList,
        taskId: this.choosedTaskId
      }
      insertToCallTask(data)
        .then(res => {
          this.chooseTaskDialogVisible = false
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.listCustomer()
        })
    },
    selectAiCallTaskName() {
      selectAiCallTaskName()
        .then(res => {
          this.selectTaskOption = res.data.result
        })
    }
  },
  mounted() {
    this.listCustomer()
    this.selectAiCallTaskName()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
  .customer-detail-slide {
    position: fixed;
    top: 0;
    right: 0;
    width: 500px;
    height: 100%;
    z-index: 10;
    background-color: #fafafa;
    border-left: 1px solid #ccc;
    & /deep/ .el-input {
      width: 300px;
    }
    .h3 {
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #eee;
      i {
        font-weight: bold;
        float: left;
        height: 100%;
        line-height: 40px;
        width: 40px;
        text-align: center;
        background-color: #409eff;
        color: #fff;
        cursor: pointer;
      }
      span {
        float: left;
        line-height: 40px;
        margin-left: 20px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s;
  }
  .slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(800px);
  }
.client-manager {
  height: 100%;
  overflow-y: hidden;
  padding: 15px 10px;
  .top {
    /*.search-input{*/
      /*width: 100px;*/
    /*}*/
    span {
      margin-left: 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .upload {
      margin-top: 20px;
    }
  }
  .customerinfo-dialog {
    .el-input {
      width: 360px;
    }
  }
  .table {
    margin-top: 20px;
    height: calc(100% - 110px);
    .mytable {
      width: 100%;
      border: 1px solid #e6e6e6;
      border-bottom: none;
    }
    .btn {
      margin-bottom: 20px;
      & /deep/ .el-input {
        width: 300px;
      }
    }
    .do {
      i {
        font-size: 20px;
        cursor: pointer;
        &:last-child {
          margin-left: 5px;
        }
      }
    }
    .page {
      text-align: center;
      margin-top: 20px;
    }
  }
  .downloadT{
    padding: 7px 15px;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    font-size: 12px;
    &:hover{
      border-color: #409EFF;
      color: #409EFF;
    }
  }
}
</style>
