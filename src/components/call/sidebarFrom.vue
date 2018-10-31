<template>
  <div>
    <transition name="slide">
      <div class="add-question" v-show="open">
        <div class="h3">
          <i class="el-icon-arrow-right" @click="closeQuestion"></i>
          <span>设置知识点</span>
        </div>
        <div class="questionForm">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
            <el-form-item label="知识点标题：" prop="title">
              <el-input v-model="ruleForm.title" placeholder="输入知识点标题" :disabled="ruleForm.questionType ===3"></el-input>
            </el-form-item>
            <el-form-item label="知识点描述：" prop="standardQuestion">
              <el-input type="textarea" v-model="ruleForm.standardQuestion" placeholder="输入知识点描述" :disabled="ruleForm.questionType ===3"></el-input>
            </el-form-item>
            <el-form-item label="关键词：" prop="keywords">
              <el-input v-model="ruleForm.keywords" placeholder="请输入关键词，并回车添加多个" type="textarea" :rows="8"></el-input>
            </el-form-item>
            <el-form-item label="标准答案：" style="margin-top:30px;">
              <div class="answerList">
                <p class="btn">
                  <el-button type="primary" size="mini" @click="addAnswerList">添加回答</el-button>
                </p>
                <ul>
                  <li v-for="(item,index) in ruleForm.answerList" :key="index">
                    <el-input type="textarea" placeholder="请输入内容" resize="none" :autosize="{ minRows: 1 }" v-model="ruleForm.answerList[index].answerContent" class="questionList-textarea"></el-input>
                    <i></i>
                    <b class="el-icon-delete" @click="deleteAnswerList(index)"></b>
                  </li>
                </ul>
              </div>
            </el-form-item>
            <el-form-item label="操作：" prop="action">
              <el-select v-model="ruleForm.action" placeholder="请选择客户操作">
                <el-option label="继续知识库" :value="0"></el-option>
                <el-option label="挂机" :value="1"></el-option>
                <el-option label="跳转到原主动流程" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <div class="action-param el-form-item" v-if="ruleForm.action === 4">
              <label>
                话术参数：
                <el-tooltip class="item" effect="dark" placement="bottom">\
                  <div slot="content">话术标签，即肯定、拒绝等；<br/>跳转流程、节点设置完整，将优先执行。</div>
                  <el-icon class="el-icon-question"></el-icon>
                </el-tooltip>
              </label>
              <el-input v-model="ruleForm.actionParam" placeholder="请输入话术标签 如：肯定"></el-input>
            </div>
            <el-form-item label="跳转流程：" prop="jumpSceneNodeId" v-if="ruleForm.action === 4">
              <el-select v-model="ruleForm.jumpSceneNodeId" placeholder="请选择跳转流程" @change="changeJumpSceneNode" :clearable="true">
                <el-option :label="item.sceneNodeName" :value="item.id" v-for="(item, index) in sceneNodeOption" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跳转节点：" prop="jumpSceneNodeProcessorId"  v-if="ruleForm.action === 4">
              <el-select v-model="ruleForm.jumpSceneNodeProcessorId" placeholder="请选择跳转节点" :clearable="true">
                <el-option :label="item.knowledge.substring(0, 15)+'...'" :value="item.id" v-for="(item, index) in sceneNodeProcessorOption" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关注点：">
              <el-input v-model="ruleForm.concern" placeholder="请输入用户关注点"></el-input>
            </el-form-item>

            <el-form-item label="意向等级：">
              <el-select v-model="ruleForm.customerIntent" placeholder="请选择客户意向等级">
                <el-option :label="item.title" :value="item.code" v-for="(item,index) in intentState" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择分类：">
              <el-select v-model="ruleForm.classifyId" placeholder="请选择分类" clearable >
                <el-option :label="item.classifyName" :value="item.id" v-for="(item,index) in sortList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择短信模板：">
              <el-select v-model="ruleForm.templateId" placeholder="请选择短信模板" clearable >
                <el-option :label="item.templateName" :value="item.id" v-for="(item,index) in messageTemplateList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="main-btn">
          <el-button @click="closeQuestion">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </div>
      </div>
    </transition>
    <div class="call-content-wrap" v-if="open"  @click="closeQuestion"></div>
  </div>
</template>

<script>
import { listIntentState, listSceneNode, listSceneNodeProcessor } from '@/api/AiConfig'
import { listMessageTemplate } from '@/api/aiconfig/smsConfig'
export default {
  name: 'sidebar',
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
          jumpSceneNodeId: '',
          jumpSceneNodeProcessorId: '',
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
      sceneNodeOption: [], // 流程下拉选项
      sceneNodeProcessorOption: [], // 节点下拉选项
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
    },
    getListSceneNode() {
      if (!this.sceneId) return
      const data = {
        sceneId: this.sceneId
      }
      listSceneNode(data)
        .then(res => {
          this.sceneNodeOption = res.data.result == null ? [] : res.data.result
        })
    },
    changeJumpSceneNode() {
      this.ruleForm.jumpSceneNodeProcessorId = ''
      this.getListSceneNodeProcessor()
    },
    getListSceneNodeProcessor() {
      const data = {
        sceneId: this.sceneId,
        sceneNodeId: this.ruleForm.jumpSceneNodeId
      }
      listSceneNodeProcessor(data)
        .then(res => {
          this.sceneNodeProcessorOption = res.data.result === null ? [] : res.data.result
        })
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.getListSceneNode()
      }
    },
    ruleForm(val) {
      if (val.jumpSceneNodeId !== '') {
        this.getListSceneNodeProcessor()
      }
    }
  },
  mounted() {
    this.getListIntentState()
    this.listMessageTemplate()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
  .action-param{
    label {
      width: 110px;
      text-align: right;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
    }
  }
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
