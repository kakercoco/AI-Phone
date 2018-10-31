/*
 * @Author: kaker.xutianxing 
 * @Date: 2018-06-25 17:39:09 
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-06-29 18:28:05
 */
<template>
  <div class="branch">
    <div class="header">
      <el-input placeholder="请输入角色名称" v-model="roleName"  class="fl">
      </el-input>
      <el-input placeholder="请输入角色code" v-model="roleCode"  class="fl">
      </el-input>
      <el-button  type="primary" @click="getListRole"  class="fl" :disabled="hasPerm('role:listRole')">搜索</el-button>
      <el-button type="primary" @click="showRoleForm" class="fl" :disabled="hasPerm('role:insertRoleUseGeneratedKeys')">新增角色</el-button>
    </div>
    <el-dialog :title="roleFormTitle" :visible.sync="roleForm" width="500px">
      <el-form :model="form" class="role-form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
           <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色code" :label-width="formLabelWidth">
           <el-input v-model="form.code" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleForm = false">取 消</el-button>
        <el-button type="primary" @click="sureRoleForm">确 定</el-button>
      </div>
    </el-dialog>
    <div class="branch-table">
      <el-table :data="tableData" style="width: 100%" class="mytable">
        <el-table-column prop="id" label="编号" sortable>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" sortable >
        </el-table-column>
        <el-table-column prop="roleCode" label="角色code" sortable>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="200" sortable>
        </el-table-column>
        <el-table-column label="操作" class-name="do" align="center" width="150">
          <template slot-scope="scope">
            <span @click="editRoleForm(scope.row)" v-if="!hasPerm('role:updateRoleByPrimaryKeySelective')">编辑</span>
            <span @click="deleteRole(scope.row)">删除</span>
            <span @click="settingLimit(scope.row)">权限</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-dialog title="设置权限" :visible.sync="limitForm" width="800px" class="permission-form">
      <el-form :model="form" >
        <el-form-item :label="item.permissionName" :label-width="formLabelWidth" v-for="(item,index) in permissionList" :key="index">
           <el-checkbox-group v-model="item.checkedGroup">
            <el-checkbox :label="node.id" name="type" v-for="(node,i) in item.children" :key="i">{{node.permissionName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="limitForm = false">取 消</el-button>
        <el-button type="primary" @click="sureLimit">确 定</el-button>
      </div>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import { listRole, insertRoleUseGeneratedKeys, updateRoleByPrimaryKeySelective, deleteRoleByPrimaryKey, listRolePermission, assignPermissionToRole } from '@/api/role'
export default {
  name: 'role',
  data() {
    return {
      roleForm: false,
      roleName: '',
      roleCode: '',
      editRoleId: 0,
      limitForm: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formLabelWidth: '120px',
      roleFormTitle: '新增角色',
      permissionList: [],
      form: {
        name: '',
        code: '',
        type: []
      }
    }
  },
  methods: {
    getListRole() {
      const data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        roleName: this.roleName,
        roleCode: this.roleCode
      }
      listRole(data)
        .then(res => {
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    },
    showRoleForm() {
      this.roleForm = true
      this.roleFormTitle = '新增角色'
      this.form = {
        name: '',
        code: ''
      }
    },
    editRoleForm(row) {
      this.roleForm = true
      this.editRoleId = row.id
      this.roleFormTitle = '编辑角色'
      this.form = {
        name: row.roleName,
        code: row.roleCode
      }
    },
    sureRoleForm() {
      if (this.roleFormTitle === '新增角色') {
        this.addRole()
      } else {
        this.editRole()
      }
    },
    addRole() {
      const data = {
        roleName: this.form.name,
        roleCode: this.form.code
      }
      insertRoleUseGeneratedKeys(data)
        .then(res => {
          this.roleForm = false
          this.getListRole()
        })
    },
    editRole() {
      const data = {
        roleName: this.form.name,
        roleCode: this.form.code,
        id: this.editRoleId
      }
      updateRoleByPrimaryKeySelective(data)
        .then(res => {
          this.roleForm = false
          this.getListRole()
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getListRole()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListRole()
    },
    settingLimit(row) {
      this.limitForm = true
      this.editRoleId = row.id
      this.getListRolePermission(this.editRoleId)
    },
    sureLimit() {
      var array = []
      for (let i = 0; i < this.permissionList.length; i++) {
        const element = this.permissionList[i]
        for (let n = 0; n < element.checkedGroup.length; n++) {
          const elements = element.checkedGroup[n]
          array.push(elements)
        }
      }
      const data = {
        roleId: this.editRoleId,
        permissionIds: array
      }
      assignPermissionToRole(data)
        .then(res => {
          this.limitForm = false
          this.$message({
            type: 'success',
            message: res.data.message
          })
        })
    },
    deleteRole(row) {
      const data = {
        roleId: row.id
      }
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleByPrimaryKey(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.getListRole()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getListRolePermission(id) {
      const data = {
        roleId: id
      }
      listRolePermission(data)
        .then(res => {
          this.permissionList = res.data.result
        })
    }
  },
  mounted() {
    this.getListRole()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.branch{
  padding: 15px 10px;
  .header{
    .el-input{
      width: 300px;
      margin-right: 20px;
    }
    height: 40px;
  }
  .branch-table {
    margin-top: 20px;
    .page {
      text-align: center;
      margin-top: 20px;
    }
    .do{
      span{
        cursor: pointer;
        color: #409EFF;
      }
    }
  }
  .role-form{
    .el-input{
      width: 300px;
    }
  }
  .permission-form{
    & /deep/ .el-dialog__body{
      height: 600px;
      overflow-y: auto;
      .el-checkbox{
        margin-left: 30px;
      }
    }
  }
}
</style>
