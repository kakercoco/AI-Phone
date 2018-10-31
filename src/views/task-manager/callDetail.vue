/*
 * @Author: kaker.xutianxing
 * @Date: 2018-05-09 10:00:21
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-07-23 17:14:15
 */
<template>
  <div class="callDetail" v-loading="loading.downloadLoading">
    <div class="top">
      <el-input v-model="value" placeholder="请输入搜索的关键词" prefix-icon="el-icon-search" clearable></el-input>
      <el-date-picker v-model="date" type="date" value-format="yyyy/MM/dd" placeholder="选择日期时间"></el-date-picker>
      <el-select v-model="selected" placeholder="请选择任务状态">
        <el-option  label="全部" value="">
        </el-option>
        <el-option v-for="item in phoneStateOptions" :key="item.code" :label="item.title" :value="item.code">
        </el-option>
      </el-select>
      <el-button type="primary" @click="searchCallList" :disabled="hasPerm('callhistory:callRecordsList')">搜索</el-button>
      <el-button @click="resetForm()" :disabled="hasPerm('callhistory:callRecordsList')">重置</el-button>
      <span class="fr" @click="downLoadCallHistory" v-if="!hasPerm('callTask:downLoadCallTaskHistory')">
        <i class="el-icon-upload2"></i>导出</span>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" @row-click="rowClick" v-loading="loading.callDetailLoading">
        <el-table-column prop="id" label="通话记录ID" sortable>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称" sortable>
        </el-table-column>
        <el-table-column prop="contact" label="联系方式" sortable>
        </el-table-column>
        <el-table-column prop="callTime" label="通话时间" sortable>
        </el-table-column>
        <el-table-column prop="callLength" label="通话时长/秒" sortable>
        </el-table-column>
        <el-table-column prop="contactStatus" label="通话状态" sortable>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" sortable>
        </el-table-column>
        <el-table-column prop="readStatus" label="查看状态" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.readStatus}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <call-content :open="callContentOpen" :callContentDetail="callContentDetail" @close="callContentClose"></call-content>
  </div>
</template>

<script>
import { callRecordsList, listPhoneState, callHistoryDetail, updateCustomerIntent, updateFeedBack, downLoadCallHistory } from '@/api/callTask'
import PCMPlayer from '@/utils/pcm-player'
import Store from '@/store/index'
import callContent from '@/components/call/callContent'

export default {
  name: 'callDetail',
  components: {
    callContent
  },
  data() {
    return {
      care: '',
      textarea: '',
      questionType: [],
      showOhter: false,
      radio7: '',
      value: '',
      date: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      dialogTitle: '新增任务',
      phoneStateOptions: [],
      selected: '',
      tableData: [],
      loading: {
        callDetailLoading: true,
        downloadLoading: false
      },
      callContentOpen: false, // 通话状态显示
      callContentDetail: {} // 通话状态内容
    }
  },
  methods: {
    rowClick(row) {
      this.openContent(row)
    },
    playAudio(url, time) {
      var playStatus = Store.state.app.playStatus
      if (playStatus) {
        return false
      }
      var player = new PCMPlayer({
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 300
      })
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function(e) {
        player.feed(new Uint16Array(this.response))
      }
      xhr.send()
    },
    handleSizeChange(val) {
      this.pageSize = val
      const data = {
        searchVal: this.value,
        launchDate: this.date,
        callStatus: this.selected,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      callRecordsList(data)
        .then(res => {
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      const data = {
        searchVal: this.value,
        launchDate: this.date,
        callStatus: this.selected,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      callRecordsList(data)
        .then(res => {
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    },
    callContentClose() {
      this.callContentOpen = false
      const data = {
        searchVal: this.value,
        launchDate: this.date,
        callStatus: this.selected,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      this.loading.callDetailLoading = true
      callRecordsList(data)
        .then(res => {
          this.loading.callDetailLoading = false
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    },
    openContent(row) {
      const data = {
        callHistoryId: row.id
      }
      callHistoryDetail(data)
        .then(res => {
          if (res.data.resultCode === 200) {
            this.callContentOpen = true
            this.callContentDetail = res.data.result
            this.callContentDetail.customerId = row.customerId
            this.radio7 = this.callContentDetail.customerIntent
          } else {
            this.$message({
              type: 'warning',
              message: '获取通话详情失败'
            })
          }
        })
    },
    getCallRecordsList() {
      this.loading.callDetailLoading = true
      const data = {}
      callRecordsList(data)
        .then(res => {
          this.loading.callDetailLoading = false
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    },
    searchCallList() {
      this.loading.callDetailLoading = true
      const data = {
        searchVal: this.value,
        launchDate: this.date,
        callStatus: this.selected
      }
      callRecordsList(data)
        .then(res => {
          this.loading.callDetailLoading = false
          this.tableData = res.data.result.list
          this.total = res.data.result.total
        })
    },
    getListPhoneState() {
      listPhoneState()
        .then(res => {
          this.phoneStateOptions = res.data.result
        })
    },
    resetForm() {
      this.value = ''
      this.date = ''
      this.selected = ''
      this.getCallRecordsList()
    },
    radioChange(val) {
      const data = {
        callHistoryId: this.callContentDetail.callHistoryId,
        customerIntentCode: val
      }
      updateCustomerIntent(data)
        .then(res => {
        })
    },
    feedBack() {
      const data = {
        historyId: this.callContentDetail.callHistoryId,
        feedback: this.questionType.join(';') + '\n' + this.textarea
      }
      updateFeedBack(data)
        .then(res => {
          if (res.data.resultCode === 200) {
            this.$message({
              type: 'success',
              message: '反馈成功'
            })
            this.textarea = ''
            this.questionType = []
            this.showOhter = false
          }
        })
    },
    downLoadCallHistory() {
      this.loading.downloadLoading = true
      const data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        searchVal: this.value,
        launchDate: this.date,
        callStatus: this.selected
      }
      downLoadCallHistory(data)
        .then(res => {
          this.loading.downloadLoading = false
          window.location.href = res.data.result
        })
    }

  },
  mounted() {
    this.getCallRecordsList()
    this.getListPhoneState()
  }
}
</script>

<style scoped  rel="stylesheet/scss" lang="scss" >
.callDetail {
  padding: 10px;
  .top {
    margin-bottom: 20px;
    &>>>.el-input {
      width: 200px;
    }
    span{
      font-size: 14px;
      cursor: pointer;
      margin-right: 10px;
      margin-top: 15px;
    }
  }
  .table {
    border: 1px solid #ebeef5;
    border-bottom: none;
  }
  .page {
    text-align: center;
    margin-top: 20px;
  }
  .call-progress {
    .el-progress {
      width: 120px;
      float: left;
      margin-top: 5px;
    }
  }
  .call-content-wrap{
    position: fixed;
    top: 0;
    right: 0;
    width: calc(100% - 180px);
    height: 100%;
    z-index: 8;
  }
  .call-content{
    position: fixed;
    top: 0;
    right: 0;
    width: 800px;
    height: 100%;
    background-color: #fafafa;
    z-index: 9;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    .h3{
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #eee;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fafafa;
      z-index: 3;
      i{
        font-weight: bold;
        float: left;
        height: 100%;
        line-height: 40px;
        width: 40px;
        text-align: center;
        background-color: #409EFF;
        color: #fff;
        cursor: pointer;
      }
      span{
        float: left;
        line-height: 30px;
        padding-right: 20px;
        margin: 5px 20px;
        font-size: 16px;
        font-weight: bold;
        border-right: 2px solid #e6e6e6;
        color: #666;
      }
      em{
        line-height: 40px;
        color: #999;
        font-size: 14px;
        font-weight: bold;
      }
    }
    .slide-left{
      width: 260px;
      height: 100%;
      padding-top: 50px ;
      float: left;
      overflow: auto;
      li{
        &:last-child{
          border-bottom: none;
        }
        padding: 10px 15px;
        border-bottom:1px dashed #999;
        h5{
          height: 30px;
          font-size: 14px;
        }
        .slide-left-btn{
          text-align: right;
          margin-top: 15px;
        }
        .slide-left-grade{
          & /deep/ .el-radio-button__inner{
            font-size: 12px;
            padding: 10px 3px;
            border-color: #8cc5fe;
            font-weight: normal;
          }
        }
        .slide-left-care{
          span{
            width: auto;
            height: 32px;
            line-height: 32px;
            padding: 0 10px;
            border: 1px solid #8cc5fe;
            border-radius: 3px;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 12px;
            cursor: pointer;
            background-color: #fff;
            &.active{
              background-color: #409EFF;
              color: #fff;
            }
          }
        }
        p{
          color: #666;
          overflow: hidden;
          margin-bottom: 15px;
          font-size: 14px;
          &>span{
            float: left;
            height: 100%;
            width: 80px;
            text-align: right;
          }
          &>i{
            float: right;
            width: 130px;
          }
          a{
            width: 80px;
            float: left;
            height: 70px;
            padding: 10px 0;
            border: 1px solid #ccc;
            border-radius: 3px;
            background-color: #fff;
            margin-left: 25px;
            span{
              display: block;
              text-align: center;
              font-size: 20px;
              color: #409EFF;
              sub{
                bottom: 0.1em;
              }
            }
            i{
              display: block;
              text-align: center;
              margin-top: 5px;
            }
          }
        }
      }
    }
    .slide-right{
      width: 538px;
      padding-top: 50px;
      height: 100%;
      float: right;
      position: relative;
      padding-bottom: 50px;
      background-color: #fafafa;
      & > div{
        height: 100%;
        width: 100%;
        background-color: #fff;
        overflow: auto;
        padding: 20px 10px;
        li{
          overflow: hidden;
          margin-bottom: 30px;
          span{
            background-color: #8cc5fe;
            border-radius: 50px;
            padding: 10px;
            width: 48px;
            height: 48px;
            text-align: center;
            svg{
              color: #fff;
              font-size: 30px;
            }
          }
          p{
            background-color: #f2f2f2;
            font-size: 12px;
            padding: 10px 5px;
            max-width: 280px;
            margin: 0 20px;
            color: #666;
            border-radius: 5px;
            position: relative;
            z-index: 3;
            min-height: 38px;
            i{
              position: absolute;
              width: 10px;
              height: 10px;
              top: 10px;
              left: -5px;
              background-color:#f2f2f2;
              transform: skew(45deg);
              z-index: -1;
            }
          }
        }
        .slider-right-kefu{
          span{
            background-color: #e0e0e0;
            svg{
              font-size: 25px;
              color: #fff;
            }
          }
          p{
            svg{
              font-size: 18px;
              color: #8cc5fe;
              cursor: pointer;
            }
            i{
              left: auto;
              right: -5px;
              transform: skew(-45deg)
            }
          }
        }
      }
      .slide-right-audio{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        audio{
          width: 100%;
          margin-top: 5px;
          background: #f1f3f4;
        }
      }
    }
  }
  .question-type {
    .el-checkbox{
      display: block;
    }
    .el-checkbox+.el-checkbox{
      margin-left: 0;
    }
  }
}
.slide-enter-active, .slide-leave-active {
  transition: transform .5s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(800px)
}
</style>

