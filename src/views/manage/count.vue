/*
 * @Author: kaker.xutianxing
 * @Date: 2018-05-18 14:03:10
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-06-28 15:00:41
 */
<template>
  <div class="count">
    <div class="header">
      <el-select v-model="value" placeholder="请选择" filterable>
         <el-option v-for="item in taskOption" :key="item.taskId" :label="item.taskName" :value="item.taskId">
        </el-option>
      </el-select>
      <el-date-picker v-model="date" type="date" value-format="yyyy/MM/dd" placeholder="起始日期"></el-date-picker>
      <el-date-picker v-model="date2" type="date" value-format="yyyy/MM/dd" placeholder="结束日期"></el-date-picker>
      <el-button type="primary" @click="searchEchart" :disabled="hasPerm('statistics:selectCallNumberOption')"><i class="el-icon-search"></i>搜索</el-button>
    </div>
    <div class="radio">
      <a :class="{active:radio=='1'}" @click="radioTab('1')">通话数量</a>
      <!-- <a :class="{active:radio=='2'}" @click="radioTab('2')">通话比例</a> -->
      <a :class="{active:radio=='3'}" @click="radioTab('3')" v-if="!hasPerm('statistics:selectCallLengthOption')">通话总时长</a>
    </div>
    <div id="myChart"></div>
    <div class="header">
      <el-select v-model="taskOptionId2" placeholder="请选择" filterable>
        <el-option v-for="item in taskOption" :key="item.taskId" :label="item.taskName" :value="item.taskId">
        </el-option>
      </el-select>
      <el-date-picker v-model="tableDate" value-format="yyyy/MM/dd" type="date" placeholder="起始日期"></el-date-picker>
      <el-date-picker v-model="tableDate2" value-format="yyyy/MM/dd" type="date" placeholder="结束日期"></el-date-picker>
      <el-button type="primary" @click="searchTable" :disabled="hasPerm('statistics:listCallDetail')"><i class="el-icon-search"></i>搜索</el-button>
    </div>
    <div class="count-table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="callDate" label="日期" align="center">
        </el-table-column>
        <el-table-column prop="callAmount" label="外呼量">
          <template slot-scope="scoped">
            <span>{{scoped.row.callAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="callSuccessAmount" label="接听量">
          <template slot-scope="scoped">
            <span>{{scoped.row.callSuccessAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="callPercent" label="接通率">
          <template slot-scope="scoped">
            <span>{{scoped.row.callPercent}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="callLengthAmount" label="外呼通话总时长/分">
          <template slot-scope="scoped">
            <span>{{scoped.row.callLengthAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="averageCallLengthAmount" label="外呼通话平均时长/分">
          <template slot-scope="scoped">
            <span>{{scoped.row.averageCallLengthAmount}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { selectAiCallTaskName } from '@/api/customer'
import { listCallDetail, selectCallLengthOption, selectCallNumberOption } from '@/api/count'
export default {
  name: 'count',
  data() {
    return {
      value: null,
      date: '',
      date2: '',
      tableDate: '',
      tableDate2: '',
      radio: '1',
      chart: null,
      taskOption: [],
      taskOptionId: null,
      taskOptionId2: null,
      options: [],
      tableData: []
    }
  },
  methods: {
    drawLine(option) {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById('myChart'))
      this.chart.clear()
      // 绘制图表
      this.chart.setOption(
        option
      )
    },
    radioTab(val) {
      this.radio = val
      if (val === '1') {
        this.getEchartCallNum()
      } else if (val === '3') {
        this.getEchartCallLength()
      }
    },
    listCallDetail() {
      const data = {}
      listCallDetail(data)
        .then(res => {
          this.tableData = res.data.result
        })
    },
    getListAiTask() {
      selectAiCallTaskName()
        .then(res => {
          this.taskOption = res.data.result
          this.taskOption.unshift({
            taskName: '全部',
            taskId: null
          })
        })
    },
    getEchartCallLength() {
      const data = {}
      selectCallLengthOption(data)
        .then(res => {
          this.drawLine(res.data.result)
        })
    },
    getEchartCallNum() {
      const data = {}
      selectCallNumberOption(data)
        .then(res => {
          this.drawLine(res.data.result)
        })
    },
    searchTable() {
      const data = {
        startDate: this.tableDate,
        endDate: this.tableDate2,
        taskId: this.taskOptionId2
      }
      listCallDetail(data)
        .then(res => {
          this.tableData = res.data.result
        })
    },
    searchEchart() {
      if (this.radio === '1') {
        const data = {
          startDate: this.date,
          endDate: this.date2,
          taskId: this.value
        }
        selectCallNumberOption(data)
          .then(res => {
            this.drawLine(res.data.result)
          })
      } else if (this.radio !== '2') {
        const data = {
          startDate: this.date,
          endDate: this.date2,
          taskId: this.value
        }
        selectCallLengthOption(data)
          .then(res => {
            this.drawLine(res.data.result)
          })
      }
    }
  },
  mounted() {
    this.listCallDetail()
    this.getListAiTask()
    this.getEchartCallNum()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.count {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px;
  .header {
    margin-bottom: 15px;
    &:last-of-type {
      margin-top: 20px;
    }
  }
  .radio {
    border-bottom: 1px solid #ddd;
    a {
      display: inline-block;
      width: 120px;
      height: 32px;
      line-height: 34px;
      text-align: center;
      font-size: 13px;
      background-color: #e4e4e4;
      color: #868686;
      border-right: 1px solid #fff;
      margin-right: -5px;
    }
    .active {
      background-color: #409eff;
      color: #fff;
    }
  }
  #myChart {
    width: 100%;
    height: 360px;
    margin-top: 20px;
  }
  .count-table {
    border-radius: 5px 5px 0 0;
    border-left: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    & /deep/ .el-table__header {
      border-radius: 5px 5px 0 0;
      overflow: hidden;
    }
    & /deep/ .el-table th,
    .el-table tr {
      background-color: #d7d7d7;
    }
  }
  .page {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
