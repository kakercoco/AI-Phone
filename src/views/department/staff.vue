/*
 * @Author: kaker.xutianxing 
 * @Date: 2018-06-25 17:39:09 
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-06-30 10:52:50
 */
<template>
  <div class="staff">
    <div class="header">
      <el-input placeholder="请输入员工名称" v-model="staffName"  class="fl">
      </el-input>
      <el-input placeholder="请输入员工手机号" v-model="staffPhone"  class="fl">
      </el-input>
      <el-button  type="primary" @click="getListEmployee" :disabled="hasPerm('employee:listEmployee')" class="fl">搜索</el-button>
      <el-button type="primary" @click="addStaffList" class="fl" :disabled="hasPerm('employee:insertEmployeeUseGeneratedKeys')">添加员工</el-button>
    </div>
    <el-dialog
      :title="staffFormTitle"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">
      <el-form ref="form" label-width="80px" class="staff-form">
        <el-col :span="24">
          <el-form-item label="手机号" required >
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="真实姓名" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="staff-tree-wrap">
          <el-form-item label="部门" required >
          <el-input v-model="form.staffBranch"></el-input>
          <el-button type="primary" size="small" @click="selectTree = true">选择</el-button>
          <div class="staff-tree" v-if="selectTree">
            <el-tree :data="treeData"  @node-click="handleNodeClick" ></el-tree>
          </div>
        </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="性别" required>
          <el-radio-group v-model="form.sex">
            <el-radio :label="1" >男</el-radio>
            <el-radio :label="2" >女</el-radio>
          </el-radio-group>
        </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="邮箱" required>
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="员工编号" required>
            <el-input v-model="form.staffID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="密码" required>
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="确认密码" required>
            <el-input v-model="form.password2" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureStaff">确 定</el-button>
      </span>
    </el-dialog>
    <div class="staff-left">
      <!-- <el-row class="title">
        <el-col :span="8">
          <h5>部门结构</h5>
        </el-col>
        <el-col :span="8">
          <a  @click="addRoot">新增根部门</a>
        </el-col>
        <el-col :span="8">
          <a class="fr" @click="lookAll">查看全部</a>
        </el-col>
      </el-row> -->
      <div class="title">
        <span class="fl">部门结构</span>
        <el-tooltip class="item" effect="dark" content="新增根部门" placement="top">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addRoot"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="查看全部" placement="top">
          <el-button type="primary" icon="el-icon-view" size="mini" @click="lookAll"></el-button>
        </el-tooltip>
      </div>
      <el-tree :data="treeData" :expand-on-click-node="false" @node-click="selectedNode" :default-expand-all="true">
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span >{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            :disabled="hasPerm('department:insertDepartmentUseGeneratedKeys')"
            @click.stop="() => append(data)">
            新增
          </el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="hasPerm('department:updateDepartmentByPrimaryKeySelective')"
            @click.stop="() => edit(node, data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="hasPerm('department:deleteDepartmentPrimaryKey')"
            @click.stop="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>
      <el-dialog :title="branchTitle" :visible.sync="dialogBranch" width="500px">
        <el-form :model="form"  class="dispatch-from">
          <el-form-item label="部门名称" :label-width="formLabelWidth">
            <el-input v-model="branchName" ></el-input>
          </el-form-item>
          <el-form-item label="部门code" :label-width="formLabelWidth">
            <el-input v-model="branchCode" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBranch = false">取 消</el-button>
          <el-button type="primary" @click="appendBranch">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="staff-right">
      <div class="staff-table">
        <el-table :data="tableData" style="width: 100%" class="mytable" border >
          <el-table-column prop="id" label="编号" sortable>
          </el-table-column>
          <el-table-column prop="employeeCode" label="员工编号" sortable>
          </el-table-column>
          <el-table-column prop="employeeName" label="真实姓名" sortable>
          </el-table-column>
          <el-table-column prop="employeeTelephone" label="手机号" sortable>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" sortable>
          </el-table-column>
          <el-table-column prop="employeeStatus" label="状态" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.employeeStatus.title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色" sortable>
          </el-table-column>
          <el-table-column prop="createAt" label="创建时间" sortable>
          </el-table-column>
          <el-table-column label="操作" class-name="do" align="center" width="200px">
            <template slot-scope="scope">
              <span @click="editStaff(scope.row)" v-if="!hasPerm('employee:updateEmployeeByPrimaryKeySelective')">修改</span>
              <span @click="dispatch(scope.row)" v-if="!hasPerm('employee:assignRoleToEmployee')">分配角色</span>
              <span @click="changeStatus(scope.row, 2)" v-if="scope.row.employeeStatus.code === 1">禁用</span>
              <span @click="changeStatus(scope.row, 1)" v-if="scope.row.employeeStatus.code === 2">启用</span>
              <span @click="changeStatus(scope.row, 3)" v-if="scope.row.employeeStatus.code !== 3">离职</span>
              <span @click="changeStatus(scope.row, 1)" v-if="scope.row.employeeStatus.code === 3">恢复</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="分配角色" :visible.sync="dispatchRole" width="500px">
        <el-form :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-select v-model="dispatchRoleId" placeholder="请选择角色分配">
              <el-option :label="item.roleName" :value="item.roleId" v-for="(item,index) in roleOption" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dispatchRole = false">取 消</el-button>
          <el-button type="primary" @click="sureDispatch">确 定</el-button>
        </div>
      </el-dialog>
        <div class="page">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listDepartment, insertDepartmentUseGeneratedKeys, deleteDepartmentPrimaryKey, updateDepartmentByPrimaryKeySelective, listEmployee, insertEmployeeUseGeneratedKeys, updateEmployeeByPrimaryKeySelective, selectRoleOption, assignRoleToEmployee, changeEmployeeStatus } from '@/api/staff'
export default {
  name: 'staff',
  data() {
    return {
      dialogVisible: false,
      dialogBranch: false,
      dispatchRole: false,
      selectTree: false, // 选择用的部门树
      formLabelWidth: '100px',
      roleOption: [],
      searchType: '',
      staffName: '',
      staffPhone: '',
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      branchTitle: '新增部门',
      staffFormTitle: '新增员工',
      branchName: '',
      branchCode: '',
      branchParentId: null,
      selectedStaffBranch: 0, // 选中用的部门树id
      staffId: 0, // 选中的用户中转id
      dispatchRoleId: '', // 选中的角色
      selectedDepartmentId: null, // 选中的部门id 查看列表用
      form: {
        phone: '',
        name: '',
        sex: '',
        email: '',
        staffID: '',
        staffBranch: '',
        password: '',
        password2: ''
      },
      treeData: [],
      root: false
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getListEmployee()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListEmployee()
    },
    append(data) {
      this.root = false
      this.branchTitle = '新增部门'
      this.dialogBranch = true
      this.branchParentId = data.departmentId
      this.branchName = ''
      this.branchCode = ''
    },
    edit(node, data) {
      this.dialogBranch = true
      this.branchTitle = '编辑部门'
      this.branchParentId = data.departmentId
      this.branchName = data.departmentName
      this.branchCode = data.departmentCode
    },
    addRoot() {
      this.root = true
      this.branchTitle = '新增部门'
      this.dialogBranch = true
      this.branchName = ''
      this.branchCode = ''
    },
    appendBranch() {
      if (this.branchTitle === '新增部门') {
        const data = {
          departmentName: this.branchName,
          parentId: this.branchParentId,
          departmentCode: this.branchCode
        }
        if (this.root) {
          data.parentId = ''
        }
        insertDepartmentUseGeneratedKeys(data)
          .then(res => {
            this.dialogBranch = false
            this.getListDepartment()
          })
      } else {
        const data = {
          departmentName: this.branchName,
          id: this.branchParentId,
          departmentCode: this.branchCode
        }
        updateDepartmentByPrimaryKeySelective(data)
          .then(res => {
            this.dialogBranch = false
            this.getListDepartment()
          })
      }
    },
    remove(node, data) {
      const params = {
        departmentId: data.departmentId
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartmentPrimaryKey(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.getListDepartment()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    selectedNode(data, node, self) {
      this.selectedDepartmentId = data.departmentId
      this.getListEmployee()
    },
    handleClose() {
      this.dialogVisible = false
    },
    getListDepartment() {
      listDepartment()
        .then(res => {
          this.treeData = res.data.result
        })
    },
    getListEmployee() {
      const data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        employeeName: this.staffName,
        employeeTelephone: this.staffPhone,
        departmentId: this.selectedDepartmentId
      }
      listEmployee(data)
        .then(res => {
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    },
    addStaff(data) {
      insertEmployeeUseGeneratedKeys(data)
        .then(res => {
          this.getListEmployee()
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.dialogVisible = false
        })
    },
    updateStaff(data) {
      updateEmployeeByPrimaryKeySelective(data)
        .then(res => {
          this.getListEmployee()
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.dialogVisible = false
        })
    },
    dispatch(row) {
      this.staffId = row.id
      this.dispatchRoleId = row.roleId
      this.dispatchRole = true
    },
    sureDispatch() {
      this.dispatchRole = false
      const data = {
        employeeId: this.staffId,
        employeeRoleId: this.dispatchRoleId
      }
      assignRoleToEmployee(data)
        .then(res => {
          this.getListEmployee()
        })
    },
    handleNodeClick(data) {
      this.selectTree = false
      this.form.staffBranch = data.departmentName
      this.selectedStaffBranch = data.departmentId
    },
    addStaffList() {
      this.staffFormTitle = '新增员工'
      this.dialogVisible = true
      this.form = {
        phone: '',
        name: '',
        sex: '',
        email: '',
        staffID: '',
        staffBranch: '',
        password: '',
        password2: ''
      }
    },
    editStaff(row) {
      this.staffFormTitle = '编辑员工'
      this.dialogVisible = true
      this.form.phone = row.employeeTelephone
      this.form.name = row.employeeName
      this.form.sex = row.employeeGender
      this.form.email = row.employeeEmail
      this.form.staffID = row.employeeCode
      this.form.staffID = row.employeeCode
      this.form.password = row.employeePassword
      this.form.password2 = row.employeePassword
      this.form.staffBranch = row.departmentName
      this.selectedStaffBranch = row.departmentId
      this.staffId = row.id
    },
    sureStaff() {
      if (this.form.password !== this.form.password2) {
        this.$message({
          type: 'warning',
          message: '两次输入的密码不一致'
        })
        return false
      }
      const data = {
        departmentId: this.selectedStaffBranch,
        employeeCode: this.form.staffID,
        employeeName: this.form.name,
        employeeGender: this.form.sex,
        employeeTelephone: this.form.phone,
        employeePassword: this.form.password,
        employeeEmail: this.form.email
      }
      if (this.staffFormTitle === '新增员工') {
        this.addStaff(data)
      } else {
        data.id = this.staffId
        this.updateStaff(data)
      }
    },
    getSelectRoleOption() {
      selectRoleOption()
        .then(res => {
          this.roleOption = res.data.result
        })
    },
    lookAll() {
      this.selectedDepartmentId = null
      this.getListEmployee()
    },
    changeStatus(row, status) {
      const data = {
        employeeId: row.id,
        employeeStatus: status
      }
      this.$confirm('确定执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeEmployeeStatus(data)
          .then(res => {
            this.getListEmployee()
            this.$message({
              type: 'success',
              message: res.data.message
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  mounted() {
    this.getListDepartment()
    this.getListEmployee()
    this.getSelectRoleOption()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.staff{
  padding: 15px 10px;
  .dispatch-from{
    .el-input{
      width: 300px;
    }
  }
  .header{
    .el-input{
      width: 300px;
      margin-right: 20px;
    }
    height: 40px;
  }
  .staff-left{
    width: 30%;
    height: 100%;
    float: left;
    border: 1px solid #eee;
    border-radius: 3px;
    margin-top: 30px;
    .title{
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      background: #fafafa;
      text-align: right;
      h5{
        font-size: 14px;
      }
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .el-tree{
      max-height: 500px;
      overflow-y: auto;
      clear: both;
    }
  }
  .staff-right{
    width: 68%;
    height: 100%;
    float: right;
    .staff-table {
      margin-top: 20px;
      .page {
        text-align: center;
        margin-top: 20px;
      }
    }
    .do{
      span{
        cursor: pointer;
        color: #409EFF;
      }
    }
  }
  .staff-tree-wrap{
      position: relative;
      .staff-tree{
        position: absolute;
        top: 50px;
        left: 0;
        width: 350px;
        height: 300px;
        overflow-y: auto;
        background-color: #fff;
        z-index: 2;
      }
    }
  .staff-form{
    overflow: hidden;
    .el-input{
      width: 350px;
    }
  }
}
</style>
