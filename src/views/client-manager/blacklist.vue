/*
 * @Author: kaker.xutianxing
 * @Date: 2018-05-14 14:31:32
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-07-25 16:55:05
 */
<template>
  <div class="client-manager">
    <div class="top">
      <el-input placeholder="请输入客户名称" v-model="searchParam.customerName" maxlength="20" clearable>
      </el-input>
      <el-input placeholder="请输入客户号码" v-model="searchParam.contact" maxlength="20" clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click="listBlacklist" :disabled="hasPerm('blacklist:listBlacklist')">搜索</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" class="mytable" v-loading="searchParam.loading">
        <el-table-column prop="customerName" label="客户名称">
        </el-table-column>
        <el-table-column prop="contact" label="联系方式">
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称">
        </el-table-column>
        <el-table-column prop="joinType.title" label="加入类型">
        </el-table-column>
        <el-table-column prop="createAt" label="加入时间"  width="200">
        </el-table-column>
        <el-table-column prop="callHistoryId" label="外呼任务">
          <template slot-scope="scope">
            <el-button type="text" @click="lookCallHistory(scope.row.callHistoryId)" v-if="scope.row.callHistoryId" >查看通话记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="加入人">
        </el-table-column>
         <el-table-column label="操作" class-name="do" align="center" width="110">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" slot="append" type="primary" size="mini" @click="deleteBlacklist(scope.row.contact)" :disabled="hasPerm('blacklist:listBlacklist')"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchParam.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="searchParam.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <call-content :open="callContentOpen" :callContentDetail="callContentDetail" @close="callContentClose"></call-content>
    </div>
  </div>
</template>

<script>
import { listBlacklist, deleteBlacklist } from '@/api/customer/blacklist'
import { callHistoryDetail } from '@/api/callTask'
import callContent from '@/components/call/callContent'
export default {
  name: 'clientManager',
  components: {
    callContent
  },
  data() {
    return {
      total: 0,
      searchParam: {
        pageNum: 1,
        pageSize: 10,
        customerName: null,
        contact: null,
        loading: false
      },
      deleteArray: [],
      dialogVisible: false,
      callContentOpen: false,
      callContentDetail: {},
      tableData: []
    }
  },
  methods: {
    handleSizeChange(val) {
      this.searchParam.pageSize = val
      this.listBlacklist()
    },
    handleCurrentChange(val) {
      this.searchParam.pageNum = val
      this.listBlacklist()
    },
    listBlacklist() {
      this.searchParam.loading = true
      listBlacklist(this.searchParam).then(res => {
        this.tableData = res.data.result.list
        this.total = res.data.result.total
        this.searchParam.loading = false
      })
    },
    lookCallHistory(id) {
      const data = {
        callHistoryId: id
      }
      callHistoryDetail(data)
        .then(res => {
          this.callContentOpen = true
          this.callContentDetail = res.data.result
        })
    },
    callContentClose(val) {
      this.callContentOpen = val
      this.listBlacklist()
    },
    deleteBlacklist(val) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          contact: [val]
        }
        deleteBlacklist(data)
          .then(res => {
            this.listBlacklist()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
      }).catch(() => {})
    }
  },
  mounted() {
    this.listBlacklist()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.client-manager {
  padding: 15px 10px;
  .top {
    & /deep/ .el-input {
      width: 200px;
    }
    span {
      margin-left: 10px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .table {
    margin-top: 20px;
    .mytable {
      border: 1px solid #e6e6e6;
      border-bottom: none;
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
}
</style>
