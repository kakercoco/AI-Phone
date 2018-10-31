<template>
  <div>
    <transition name="slide">
      <div class="qusetion-detail" v-if="knowledgeOpen">
        <div class="h3">
          <i class="el-icon-arrow-right" @click="close"></i>
          <span>问题详情</span>
          <em>更新时间：{{questionContentDetail.modifyAt}}</em>
        </div>
        <div class="detail-left">
          <div>
            <span>问题类型：</span>
            <p>
              <a :class="{active:questionContentDetail.questionType !== 3}">标准</a>
              <a :class="{active:questionContentDetail.questionType == 3}">系统</a>
            </p>
          </div>
          <div>
            <span>问题标题：</span>
            <p>
              {{questionContentDetail.title}}
            </p>
          </div>
          <div>
            <span>问题问法：</span>
            <p>
              {{questionContentDetail.standardQuestion}}
            </p>
          </div>
          <div style="height:auto;">
            <span>关键词：</span>
            <p style="padding-left:80px;">
              <a v-for="(item,index) in questionContentDetail.keywords" :key="index">{{item}}</a>
            </p>
          </div>
          <div>
            <span>客户关注点：</span>
            <p>{{questionContentDetail.concern}}</p>
          </div>
          <div>
            <span>客户意向等级：</span>
            <p v-text="questionContentDetail.customerIntent.title"></p>
          </div>
        </div>
        <div class="detail-right">
          <h5>问题答案：</h5>
          <ul>
            <li v-for="(item,index) in questionContentDetail.answerList" :key="index">
              <span class="fl">
                <svg-icon icon-class="Ai"></svg-icon>
              </span>
              <p class="fl">{{item.answerContent}}
                <i></i>
              </p>
              <div class="question-audio">
                <audio controls>
                  <source :src="item.knowledgeMp3Url" type="audio/mpeg"> 您的浏览器不支持该音频格式。
                </audio>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="call-content-wrap" v-if="knowledgeOpen"  @click="close"></div>
  </div>
</template>

<script>
export default {
  name: 'knowledgeDetail',
  props: {
    knowledgeOpen: {
      type: Boolean,
      default: false
    },
    questionContentDetail: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('close', false)
    }
  },
  mounted() {}
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.qusetion-detail {
  position: fixed;
  top: 0;
  right: 0;
  width: 801px;
  height: 100%;
  z-index: 10;
  background-color: #fafafa;
  padding-top: 50px;
  border-left: 1px solid #ccc;
  & /deep/ .el-input {
    width: 300px;
  }
  .h3 {
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
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
  .detail-left {
    height: 100%;
    width: 260px;
    float: left;
    & > div {
      padding: 20px 10px;
      border-bottom: 1px dashed #ccc;
      height: 90px;
      font-size: 14px;
      &:last-of-type {
        border-bottom: none;
      }
      span {
        float: left;
        width: 80px;
        height: 100%;
        color: #666;
      }
      p {
        font-size: 13px;
        color: #666;
        a {
          padding: 0 10px;
          text-align: center;
          line-height: 25px;
          display: inline-block;
          background-color: #fff;
          border-radius: 3px;
          border: 1px solid #8cc5fe;
          color: #999;
          margin-right: 5px;
          margin-bottom: 5px;
          font-size: 12px;
          &.active {
            color: #fff;
            background-color: #409eff;
          }
        }
      }
    }
    & > p {
      padding: 10px;
      text-align: center;
      &:first-of-type {
        margin-top: 20px;
      }
      i {
        transform: rotate(90deg);
        font-size: 18px;
        margin-top: -10px;
        color: #999;
        cursor: pointer;
      }
    }
  }
  .detail-right {
    height: 100%;
    width: 540px;
    float: left;
    background-color: #fff;
    padding: 10px;
    overflow-y: auto;
    h5 {
      color: #666;
      font-weight: normal;
      margin-bottom: 20px;
    }
    li {
      overflow: hidden;
      margin-bottom: 30px;
      span {
        background-color: #8cc5fe;
        border-radius: 40px;
        padding: 8px;
        width: 40px;
        height: 40px;
        text-align: center;
        svg {
          color: #fff;
          font-size: 25px;
        }
      }
      p {
        background-color: #f2f2f2;
        font-size: 12px;
        padding: 10px 5px;
        max-width: 260px;
        margin: 0 20px;
        color: #666;
        border-radius: 5px;
        position: relative;
        z-index: 3;
        min-height: 38px;
        margin-bottom: 3px;
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
    .question-audio {
      width: 380px;
      padding: 0 60px;
      audio {
        background: #f1f3f4;
        width: 400px;
      }
    }
    .slider-right-kefu {
      cursor: pointer;
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
        }
        i {
          left: auto;
          right: -5px;
          transform: skew(-45deg);
        }
      }
    }
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
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(800px);
}
</style>
