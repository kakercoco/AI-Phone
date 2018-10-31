<template>
  <div class="export">
    <div class="top">
      <el-input v-model="key" placeholder="请输入搜索的任务名称" prefix-icon="el-icon-search" clearable></el-input>
      <el-date-picker v-model="date" type="date" value-format="yyyy/MM/dd" placeholder="选择日期时间"></el-date-picker>
       <el-button type="primary"   @click="getListExcelTask">搜索</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="taskName" label="任务名称" sortable>
        </el-table-column>
        <el-table-column  label="任务类型" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.type.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sucessNumber" label="成功数" sortable>
        </el-table-column>
        <el-table-column prop="failNumber" label="失败数" sortable>
        </el-table-column>
        <el-table-column  label="状态" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.status.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" sortable>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间" sortable>
        </el-table-column>
        <el-table-column prop="readStatus" label="操作" sortable>
          <template slot-scope="scope">
            <a :href="scope.row.downloadLink" style="cursor:pointer;color:#409EFF" v-if="scope.row.downloadLink">下载</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { listExcelTask } from '@/api/callTask'
export default {
  name: 'export',
  data() {
    return {
      key: '',
      date: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: []
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getListExcelTask()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListExcelTask()
    },
    getListExcelTask() {
      const data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskName: this.key,
        createAt: this.date
      }
      listExcelTask(data)
        .then(res => {
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    }
  },
  mounted() {
    this.getListExcelTask()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.export{
  padding: 10px;
  .top{
    margin-bottom: 20px;
    .el-input{
      width: 200px;
      margin-right: 10px;
    }
  }
  .table{
    border: 1px solid #ebeef5;
    border-bottom: none;
  }
  .page{
    text-align: center;
    margin-top: 20px;
  }
}
</style>
