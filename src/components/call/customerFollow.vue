<template>
  <div>
    <el-card class="box-card">
      sadadadadadsas
    </el-card>
    <el-card class="box-card">
      sadadadadadsas
    </el-card>
    <el-card class="box-card">
      sadadadadadsas
    </el-card>
    <el-card class="box-card">
      sadadadadadsas
    </el-card>

  </div>
</template>

<script>
import { listIntentState } from '@/api/AiConfig'
import { listMessageTemplate } from '@/api/aiconfig/smsConfig'
export default {
  name: 'customerFollow',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    sceneId: {
      type: String,
      default: ''
    },
    ruleForm: {
      type: Object,
      default: function() {
        return {
          title: '',
          standardQuestion: '',
          keywords: '',
          concern: '',
          customerIntent: 0,
          action: 0,
          actionParam: '',
          classifyId: '',
          questionType: 0,
          templateId: null,
          answerList: [{ answerContent: '' }] // 添加问题时的回答列表
        }
      }
    }
  },
  data() {
    return {
      intentState: [],
      messageTemplateList: [],
      rules: {
        title: [
          { required: true, message: '请输入知识点标题', trigger: 'blur' }
        ],
        keywords: [
          { required: false, message: '请输入关键词', trigger: 'blur' }
        ],
        standardQuestion: [
          { required: true, message: '输入知识点描述问题', trigger: 'blur' }
        ],
        concern: [
          { required: false, message: '请输入客户关注点', trigger: 'blur' }
        ],
        customerIntent: [
          { required: true, message: '请选择客户意向等级', trigger: 'change' }
        ],
        action: [
          { required: true, message: '请选择操作方式', trigger: 'change' }
        ],
        actionParam: [
          { required: false, message: ' ' }
        ]
      }
    }
  },
  computed: {
    sortList() {
      return this.$store.state.node.sortList
    }
  },
  methods: {
    deleteAnswerList(index) {
      this.ruleForm.answerList.splice(index, 1)
    },
    closeQuestion() {
      this.$emit('close', false)
    },
    addAnswerList() {
      this.ruleForm.answerList.push({ answerContent: '' })
    },
    getListIntentState() {
      listIntentState()
        .then(res => {
          this.intentState = res.data.result
        })
    },
    listMessageTemplate() {
      const param = { templateStatus: 1 }
      listMessageTemplate(param)
        .then(res => {
          this.messageTemplateList = res.data.result
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('submit', this.ruleForm)
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    this.getListIntentState()
    this.listMessageTemplate()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.add-question {
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
  .questionForm {
    height: calc(100% - 50px);
    padding: 10px;
    padding-bottom: 60px;
    overflow: auto;
    & /deep/ .el-textarea {
      width: 300px;
    }
    .answerList {
      position: relative;
      .btn {
        position: absolute;
        top: -40px;
        right: 70px;
      }
      ul {
        margin-top: 10px;
      }
      li {
        padding: 20px;
        background-color: #f2f2f2;
        border-radius: 5px;
        width: 300px;
        margin-bottom: 10px;
        line-height: 20px;
        font-size: 12px;
        position: relative;
        i {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 10px;
          left: -5px;
          background-color: #f2f2f2;
          -webkit-transform: skew(45deg);
          transform: skew(45deg);
        }
        span {
          display: block;
          outline: none;
        }
        b {
          position: absolute;
          top: 20px;
          right: -40px;
          cursor: pointer;
          font-size: 18px;
          color: #f00;
        }
      }
    }
  }
  .main-btn {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 480px;
    height: 70px;
    padding-top: 10px;
    padding-right: 20px;
    background-color: #fafafa;
    text-align: right;
  }
  .questionList-textarea.el-textarea {
    width: 100%;
    & /deep/ .el-textarea__inner {
      border: none;
      background-color: transparent;
      padding: 0;
      font-size: 12px;
      color: #333;
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
