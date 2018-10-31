<template>
  <div>
    <transition name="slide">
      <div class="call-content" v-if="open">
        <div class="h3">
          <i class="el-icon-arrow-right" @click="closeContent"></i>
          <span>通话内容</span>
          <em>通话记录ID：{{callContentDetail.callHistoryId}}（反馈通话问题时，请附带该id）</em>
        </div>
        <div class="slide-right">
          <el-card class="box-card intent-manual">
            <!--<div class="followhistory-tip" @click="openFollowDialog" v-if="callContentDetail.customerId">-->
              <!--<svg-icon slot="reference" icon-class="follow"></svg-icon>-->
              <!--跟进记录-->
            <!--</div>-->
            <div class="customer-message">
              <p class="customer-icon">
                <el-popover
                  placement="top-start"
                  :title="callContentDetail.customerName"
                  width="300"
                  trigger="hover"
                >
                  <ul>
                    <li>联系方式：{{callContentDetail.contact}}</li>
                    <li>公司名称：{{callContentDetail.companyName}}</li>
                  </ul>
                  <svg-icon slot="reference" icon-class="customer "></svg-icon>
                </el-popover>
              </p>
              <div>
                <p>{{callContentDetail.customerName}}</p>
                <p>{{callContentDetail.contact}}</p>
              </div>
              <div class="customer-call-time">
                <p>拨出时间：2018-08-09 10:41:49</p>
                <p>意向等级： 重点跟进</p>
              </div>
            </div>
            <div class="customer-intent">
              <span>分级：</span>
              <el-radio-group size="small" v-model="callContentDetail.markedCustomerIntent" @change="radioChange"
                              :disabled="hasPerm('callhistory:updateCustomerIntent')">
                <el-radio-button label="2" border title="重点跟进">重点</el-radio-button>
                <el-radio-button label="1" border title="需克服异议">异议</el-radio-button>
                <el-radio-button label="0" border title="不需要">拒绝</el-radio-button>
                <el-radio-button label="-1" border title="不再联系">不联系</el-radio-button>
                <el-radio-button label="-2" border title="未接听">未接</el-radio-button>
                <el-radio-button label="3" border title="已合作">合作</el-radio-button>
                <el-radio-button label="4" border title="同行">同行</el-radio-button>
                <el-radio-button label="5" border title="问题客户">问题</el-radio-button>
              </el-radio-group>
            </div>
            <div class="customer-concern">
              <span>关注点：</span>
              <ul class="customer-concern-tag">
                <li v-for="(item,index) in callContentDetail.concerns" :key="index">{{item}}</li>
              </ul>
            </div>
          </el-card>
          <el-card class="box-card call-content-list">
            <div class="question-fallback" @click="fallbackvisible=true">
              <svg-icon slot="reference" icon-class="fallback"></svg-icon>
              问题反馈
            </div>
            <ul>
              <li v-for="(item,index) in callContentDetail.recordingRecordDetail" :key="index"
                  :class="{'slider-right-kefu':item.contentDiff===2}">
                <span :class="[item.contentDiff === 1 ? 'fl' :'fr']">
                  <svg-icon icon-class="Ai" v-if="item.contentDiff===1"></svg-icon>
                  <svg-icon icon-class="kefu" v-if="item.contentDiff===2"></svg-icon>
                </span>
                <p :class="[item.contentDiff === 1 ? 'fl' :'fr']">
                  <svg-icon icon-class="yuyin" v-if="item.contentDiff===2"
                            @click.native="playAudio(item.recordingUrl)"></svg-icon>
                  <i v-if="item.contentDiff===2"></i>
                  {{item.content}}
                  <i v-if="item.contentDiff===1"></i>
                </p>
              </li>
            </ul>
          </el-card>
          <p class="slide-right-audio">
            <audio controls>
              <source :src="callContentDetail.recordingRecordUrl" type="audio/mpeg">
              您的浏览器不支持该音频格式。
            </audio>
          </p>
        </div>
      </div>
    </transition>
    <el-card class="box-card follow-dialog" v-if="followListDialogVisible">
        <div class="h3">
          <i class="el-icon-arrow-right" @click="followListDialogVisible = false"></i>
          <span>跟进记录</span>
        </div>
        <div class="follow-history-form">
          <el-form ref="followHistory" :model="followHistory" label-width="80px">
            <el-form-item label="跟进时间">
              <el-date-picker v-model="followHistory.followTime" type="datetime" placeholder="选择跟进时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进事件">
              <el-input v-model="followHistory.followEvent" placeholder="请输入跟进事件"></el-input>
            </el-form-item>
            <el-form-item label="跟进备注">
              <el-input type="textarea" v-model="followHistory.followDescription" placeholder="请输入跟进备注"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="insertFollowHistory">添加跟进</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="follow-list">
          <div v-for="item in followHistoryList" :key="item.id">
            <p>{{item.followEvent}}</p>
            <p class="follow-item-extended">跟进人：{{item.createBy}}<i class="el-icon-time fr">{{item.followTime}}</i></p>
          </div>
        </div>
      </el-card>
    <div class="call-content-wrap" @click="closeContent" v-if="open"></div>
    <el-dialog
      title="问题反馈"
      :visible.sync="fallbackvisible"
      width="25%">
      <el-checkbox-group v-model="questionType" class="question-type">
        <el-checkbox label="意向分级有偏差" name="type"></el-checkbox>
        <el-checkbox label="通话记录不精准" name="type"></el-checkbox>
      </el-checkbox-group>
      <el-checkbox v-model="showOhter" style="margin-bottom:15px;">其他</el-checkbox>
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="textarea" v-if="showOhter"></el-input>
      <span slot="footer" class="dialog-footer">
          <el-button @click="fallbackvisible = false">取 消</el-button>
          <el-button type="primary" @click="feedBack" :disabled="hasPerm('feedBack:insertFeedBack')">反馈</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import PCMPlayer from '@/utils/pcm-player'
  import { updateCustomerIntent, updateFeedBack } from '@/api/callTask'
  import { FollowHistory } from '@/api/customer/followHistory'
  import { insertFollowHistory } from '../../api/customer/followHistory'
  import { selectCustomer } from '../../api/customer'

export default {
    name: 'callContent',
    data() {
      return {
        questionType: [],
        showOhter: false,
        fallbackvisible: false,
        followListDialogVisible: false,
        followHistory: new FollowHistory(),
        followHistoryList: [],
        textarea: '' // 反馈内容
      }
    },
    props: {
      callContentDetail: {
        type: Object,
        default: {}
      },
      open: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      radioChange(val) {
        const data = {
          callHistoryId: this.callContentDetail.callHistoryId,
          customerIntentCode: val
        }
        updateCustomerIntent(data).then(res => {
        })
      },
      feedBack() {
        const data = {
          historyId: this.callContentDetail.callHistoryId,
          feedback: this.questionType.join(';') + '\n' + this.textarea
        }
        updateFeedBack(data).then(res => {
          if (res.data.resultCode === 200) {
            this.$message({
              type: 'success',
              message: '反馈成功'
            })
            this.textarea = ''
            this.questionType = []
            this.showOhter = false
            this.fallbackvisible = false
          }
        })
      },
      playAudio(url, time) {
        var playStatus = this.$store.state.app.playStatus
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
      closeContent() {
        this.$emit('close', false)
        this.followListDialogVisible = false
      },
      insertFollowHistory() {
        this.followHistory.customerId = this.callContentDetail.customerId
        insertFollowHistory(this.followHistory).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.followHistory = new FollowHistory()
        })
      },
      openFollowDialog() {
        this.selectCustomer()
        this.followListDialogVisible = true
      },
      selectCustomer() {
        selectCustomer({ id: this.callContentDetail.customerId }).then(res => {
          this.followHistoryList = res.data.result.followIdList
        })
      }
    },
    mounted() {
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .follow-dialog {
    z-index: 10;
    position: fixed;
    top: 0;
    right: 560px;
    width: 500px;
    height: 80%;
    .follow-history-form{
      margin-top: 40px;
    }
    .follow-list {
      height: 280px;
      overflow-y: auto;
      border: 1px solid #eeeeee;
      padding: 10px;
      &  >div {
        border: solid 1px #dcdfe6;
        border-radius: 5px;
        padding: 5px;
        margin-bottom: 10px;
        height: 60px;
        color: #606266;
        .follow-item-extended{
          font-size: 12px;
          margin-top: 20px;
          color: #909399;
        }
      }
    }
    .h3 {
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #eee;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fafafa;
      z-index: 3;
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
        line-height: 30px;
        padding-right: 20px;
        margin: 5px 20px;
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
      em {
        line-height: 40px;
        color: #999;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .call-content-wrap {
    position: fixed;
    top: 0;
    right: 0;
    width: calc(100% - 180px);
    height: 100%;
    z-index: 8;
  }

  .call-content {
    position: fixed;
    top: 0;
    right: 0;
    width: 560px;
    height: 100%;
    background-color: #fafafa;
    z-index: 9;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    .h3 {
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #eee;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fafafa;
      z-index: 3;
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
        line-height: 30px;
        padding-right: 20px;
        margin: 5px 20px;
        font-size: 16px;
        font-weight: bold;
        border-right: 2px solid #e6e6e6;
        color: #666;
      }
      em {
        line-height: 40px;
        color: #999;
        font-size: 14px;
        font-weight: bold;
      }
    }
    .slide-right {
      width: 100%;
      padding-top: 40px;
      height: 100%;
      float: right;
      position: relative;
      padding-bottom: 50px;
      background-color: #fafafa;
      .customer-icon {
        font-size: 50px;
        float: left;
        .customer-detail-popover {

        }
      }
      .followhistory-tip{
        position: absolute;
        width: 30px;
        left: -30px;
        background-color: #67affa;
        color: white;
        padding: 5px;
        cursor: pointer;
      }
      .customer-message {
        height: 50px;
        & > div {
          padding-top: 10px;
          float: left;
          margin-left: 12px;
        }
      }
      .customer-intent {
        clear: both;
      }
      .customer-call-time {
        color: #666;
        font-size: 14px;
        line-height: 20px;
      }
      .customer-concern {
        line-height: 32px;
        font-size: 14px;
        & > span {
          float: left;
          display: inline-block;
        }
        .customer-concern-tag {
          li {
            margin-top: 5px;
            padding-left: 3px;
            padding-right: 3px;
            width: auto;
            float: left;
            height: 22px;
            line-height: 22px;
            border-radius: 3px;
            margin-right: 10px;
            background-color: #fff;
            border: 0.5px solid #86aace;
          }
        }
      }

      & > .intent-manual {
        height: 20%;
        width: 100%;
        & /deep/ .el-card__body {
          padding: 12px;
        }
      }
      & > .call-content-list {
        height: 80%;
        width: 100%;
        background-color: #fff;
        overflow: auto;
        padding: 20px 10px;
        .question-fallback {
          padding: 5px;
          float: left;
          display: block;
          position: absolute;
          width: 30px;
          left: -30px;
          bottom: 0;
          background-color: #409EFF;
          color: #ffffff;
          text-align: center;
          cursor: pointer;
          svg {
            color: #ffffff;
          }
        }
        li {
          overflow: hidden;
          margin-bottom: 30px;
          span {
            background-color: #8cc5fe;
            border-radius: 50px;
            padding: 10px;
            width: 48px;
            height: 48px;
            text-align: center;
            svg {
              color: #fff;
              font-size: 30px;
            }
          }
          p {
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
            i {
              position: absolute;
              width: 10px;
              height: 10px;
              top: 10px;
              left: -5px;
              background-color: #f2f2f2;
              transform: skew(45deg);
              z-index: -1;
            }
          }
        }
        .slider-right-kefu {
          span {
            background-color: #e0e0e0;
            svg {
              font-size: 25px;
              color: #fff;
            }
          }
          p {
            svg {
              font-size: 18px;
              color: #8cc5fe;
              cursor: pointer;
            }
            i {
              left: auto;
              right: -5px;
              transform: skew(-45deg);
            }
          }
        }
      }
      .slide-right-audio {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10%;
        z-index: 3;
        audio {
          width: 100%;
          margin-top: 5px;
          background: #f1f3f4;
        }
      }
    }

  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s;
  }

  .slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform: translateX(800px);
  }

  .question-type {
    .el-checkbox {
      display: block;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
</style>
