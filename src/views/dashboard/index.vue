<template>
  <div class="dashboard">
    <el-col>
      <el-card class="box-card top-box" style="background-color: rgb(49, 180, 141)">
        <div class="top-icon">
          <svg-icon icon-class="call"></svg-icon>
        </div>
        <div class="top-text">
          <p>今日呼叫总数</p>
          <p>{{summary.callAmount}}</p>
        </div>
      </el-card>
      <el-card class="box-card top-box" style="background-color: rgb(56, 161, 242)">
        <div class="top-icon">
          <svg-icon icon-class="callsuccess"></svg-icon>
        </div>
        <div class="top-text">
          <p>接通电话数</p>
          <p>{{summary.callSuccessAmount}}</p>
        </div>
      </el-card>
      <el-card class="box-card top-box" style="background-color: rgb(117, 56, 199)">
        <div class="top-icon">
          <svg-icon icon-class="selectcustomer"></svg-icon>
        </div>
        <div class="top-text">
          <p>意向客户数</p>
          <p>{{summary.callIntent}}</p>
        </div>
      </el-card>
      <el-card class="box-card top-box" style="background-color: rgb(59, 103, 164)">
        <div class="top-icon">
          <svg-icon icon-class="clock"></svg-icon>
        </div>
        <div class="top-text">
          <p>通话总时长</p>
          <p>{{summary.callLengthAll}}s</p>
        </div>
      </el-card>
    </el-col>
    <el-col class="bottom-elcol">
      <div class="home-left">
        <el-card class="box-card middle-box">
          <div id="myChart1" class="chart"></div>
        </el-card>
        <el-card class="box-card bottom-box">
          <div slot="header" class="clearfix">
            <span>今日问题</span>
          </div>
          <el-tag size="medium" v-for="item in learnQuestionList" :key="item.id">{{item.historySentence}}</el-tag>
        </el-card>
      </div>
      <el-card class="box-card right-box">
        <div slot="header" class="clearfix">
          <span>今日客户</span>
        </div>
        <el-table :data="callDetailList" border @row-click="rowClickFinish" height="100%">
          <el-table-column
            prop="customerName"
            label="客户名称">
          </el-table-column>
          <el-table-column
            prop="callTime"
            label="呼叫时间" width="160">
          </el-table-column>
          <el-table-column
            prop="readStatus"
            label="查看状态">
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <call-content :open="callContentOpen" :callContentDetail="callContentDetail" @close="callContentClose"></call-content>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import echarts from 'echarts'
  import {
    listHomepageCallHistory,
    listHomepageKnowledgeLearn,
    selectHomepageOption,
    selectHomepageStatistics
  } from '@/api/dashboard'
  import { callHistoryDetail } from '@/api/callTask'
  import callContent from '@/components/call/callContent'

  export default {
    name: 'dashboard',
    components: {
      callContent
    },
    data() {
      return {
        callContentOpen: false,
        callContentDetail: {},
        learnQuestionList: [],
        summary: {
          callIntent: 0,
          callSuccessAmount: 0,
          callAmount: 0,
          callLengthAll: 0
        },
        callDetailList: []
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    methods: {
      drawCharts(option, dom) {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(dom))
        this.chart.clear()
        // 绘制图表
        this.chart.setOption(
          option
        )
      },
      selectHomepageOption() {
        const data = {}
        selectHomepageOption(data)
          .then(res => {
            this.drawCharts(res.data.result, 'myChart1')
          })
      },
      selectHomepageStatistics() {
        selectHomepageStatistics().then(res => {
          this.summary = res.data.result
        })
      },
      listHomepageCallHistory() {
        listHomepageCallHistory().then(res => {
          this.callDetailList = res.data.result
        })
      },
      listHomepageKnowledgeLearn() {
        listHomepageKnowledgeLearn().then(res => {
          this.learnQuestionList = res.data.result
        })
      },
      callContentClose(val) {
        this.callContentOpen = val
      },
      rowClickFinish(row) {
        const data = {
          callHistoryId: row.id
        }
        callHistoryDetail(data)
          .then(res => {
            this.callContentOpen = true
            this.callContentDetail = res.data.result
            this.callContentDetail.customerId = row.customerId
          })
      }
    },
    mounted() {
      this.selectHomepageOption()
      this.selectHomepageStatistics()
      this.listHomepageCallHistory()
      this.listHomepageKnowledgeLearn()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    padding: 15px;
    height: 100%;
    overflow-y: hidden;
    .top-box {
      padding-bottom: 20px;
      width: 20%;
      float: left;
      margin-left: 4%;
      color: #ffffff;
      .el-col {
        background-color: #eeeeee;
        border-radius: 40px;
        width: 15%;
        margin-left: 8%;
        margin-right: 8%;
      }
      .top-icon {
        float: left;
        padding: 15px;
        svg {
          font-size: 40px;
        }
      }
      .top-text {
        float: right;
        & > :last-child {
          margin-top: 10px;
          font: 30px bold;
        }
      }
    }
    .bottom-elcol {
      height: calc(100% - 130px);
      .middle-box {
        .chart {
          height: 300px;
        }
      }
      .right-box {
        margin-top: 15px;
        width: 35%;
        left: 1%;
        position: relative;
        height: 100%;
        & /deep/ .el-card__body {
          height: 90%;
        }
      }
      .bottom-box {
        margin-top: 15px;
        height: calc(100% - 225px);
        overflow-y: auto;
        .el-tag {
          margin-left: 10px;
          margin-bottom: 10px;
        }
      }
    }
    .home-left{
      float: left;
      width: 56%;
      margin-left: 4%;
      margin-top: 15px;
      height: calc(100% - 130px);
    }
  }
</style>
