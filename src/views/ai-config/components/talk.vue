/*
 * @Author: kaker.xutianxing
 * @Date: 2018-05-11 10:02:44
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-08-31 17:10:19
 */
<template>
  <div class="talk-setting">
    <div class="setting-left">
      <el-button type="primary" size="small" icon="el-icon-plus" :disabled="hasPerm('aiConfig:insertSceneNode')" @click="addProcess">新建流程</el-button>
      <ul>
        <li v-for="(item, index) in talkList" :key="index" @click="changeScene(item,index)">
          <span>{{index+1}}.</span>
          <div :class="{active: item.id===editId}">
            <h6>{{item.sceneNodeName}}</h6>
            <p>
              <i class="el-icon-edit" @click.stop="editProcess(item)" v-if="!hasPerm('aiConfig:updateSceneNode')"></i>
              <i class="el-icon-delete" @click.stop="deleteProcess(item.id)" v-if="!hasPerm('aiConfig:deleteSceneNode')"></i>
            </p>
          </div>
        </li>
      </ul>
      <el-dialog :title="processTitle" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
          <el-form-item label="流程名称：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入流程名称"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>

    </div>
    <div class="setting-right node">
      <div class="header">
        <el-tooltip class="item" effect="dark" content="尝试拖动此按钮" placement="bottom">
          <a class="common">
            <i class="el-icon-tickets"></i>
            <span>普通话术</span>
            <i class="el-icon-rank"></i>
            <p>喂，你好啊，塑料袋看风景啥两地分居速度快放假阿斯蒂芬</p>
            <button>肯定</button>
            <button>未识别</button>
            <button>否定</button>
          </a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="尝试拖动此按钮" placement="bottom">
          <a class="jump">
            <i class="el-icon-news"></i>
            <span>跳转话术</span>
            <i class="el-icon-rank"></i>
            <p>喂，你好啊，塑料袋看风景啥两地分居速度快放假阿斯蒂芬</p>
          </a>
        </el-tooltip>
      </div>
      <div class="content" id="content">
        <ul>
          <li v-for="(item,index) in nodeList" :key="index" class="add-li node-block" :style="{top:item.positionX + 'px',left:item.positionY + 'px'}"  :data-parent-id="item.parentId"  :id="item.id" @dblclick="item.nodeDbclick(index)" @mouseup="item.nodeMouseUp($event)" @mouseover="item.nodeDrag()" @click="item.nodeClick()">
            <span>{{item.processorName}}</span>
            <p>{{item.knowledge}}</p>
            <button class="add-button tag-button" :id="items.id" v-for="(items,i) in item.tagsMap"  v-if="items.checked" :key="i"  @mousedown="items.nodeTagMouseDown()">{{items.tagName}}</button>
            <p v-if="item.processorType !== 1">操作：{{item.processorType === 2 ? '执行下一步' : '挂机'}}</p>
            <b class="el-icon-circle-close" @click="item.deleteNode()"></b>
          </li>
        </ul>
      </div>
      <p class="save">
        <el-button type="primary" @click="save"  :disabled="hasPerm('aiConfig:updateSceneNodeProcessorList')">保存</el-button>
      </p>
    </div>
    <transition name="slide">
      <div class="common-setting" v-if="open">
        <div class="h3">
          <i class="el-icon-arrow-right" @click="closeContent"></i>
        </div>
        <div class="commonForm">
          <el-form :model="nodeTransfer" :rules="commons" ref="commonForm" label-width="110px">
            <el-form-item label="流程名称：" prop="processorName">
              <el-input v-model="nodeTransfer.processorName" placeholder="请输入任务名称"></el-input>
            </el-form-item>
            <el-form-item label="AI话术：" prop="knowledge">
              <el-input v-model="nodeTransfer.knowledge" placeholder="请输入任务名称" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" resize="none"></el-input>
            </el-form-item>
            <el-form-item label="用户回答：" v-if="openTalkType === 1">
              <div style="display:inline-block;">全部回答分支</div>
              <el-button type="primary" icon="el-icon-plus" size="mini" class="fr" style="margin-right:70px" @click="addBranch">添加分支</el-button>
              <div class="my-check-group">
                <p v-for="(answer, index) in nodeTransfer.tagsMap" :key="index" >
                  <el-checkbox v-model="answer.checked" >{{answer.tagName}}</el-checkbox>
                  <span class="edit" @click="editBranch(answer)">编辑</span>
                </p>
              </div>
            </el-form-item>
            <el-form-item prop="processorType" v-if="openTalkType !== 1" label="跳转操作：">
              <el-select v-model="nodeTransfer.processorType" placeholder="请选择操作">
                <el-option label="执行下个流程" :value="2"></el-option>
                <el-option label="挂机" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="acceptBreak" label="是否打断：">
              <el-select v-model="nodeTransfer.acceptBreak" placeholder="是否允许用户打断">
                <el-option label="允许" :value="true"></el-option>
                <el-option label="不可打断" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="concern" label="关注点：">
              <el-input v-model="nodeTransfer.concern" placeholder="请输入用户关注点"></el-input>
            </el-form-item>
            <el-form-item prop="customerIntent" label="意向等级：">
              <el-select v-model="nodeTransfer.customerIntent" placeholder="请选择客户意向等级">
                <el-option :label="item.title" :value="item.code" v-for="(item,index) in intentState" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择短信模板：">
              <el-select v-model="nodeTransfer.smsTemplateId" placeholder="请选择短信模板" clearable >
                <el-option :label="item.templateName" :value="item.id" v-for="(item,index) in messageTemplateList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <el-button @click="closeContent">取消</el-button>
          <el-button type="primary" @click="submit('commonForm')">确定</el-button>
        </div>
      </div>
    </transition>
    <div class="call-content-wrap" v-if="open"  @click="closeContent"></div>
    <transition name="slide">
      <div class="common-branch" v-if="branch">
        <div class="h3">
          <i class="el-icon-arrow-right" @click="closeBrance"></i>
          <span>新建/编辑分支</span>
        </div>
        <div class="branchForm">
          <el-form :model="branchForm" :rules="branchs" ref="branchForm" label-width="110px">
            <el-form-item label="分支名称：" prop="name">
              <el-input v-model="branchForm.name" placeholder="请输入分支名称"></el-input>
            </el-form-item>
            <el-form-item label="回答方式：" prop="style">
              <el-input v-model="branchForm.style" placeholder="请输入回答方式,并回车添加多个" type="textarea" :rows="20"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <el-button @click="closeBrance">取消</el-button>
          <el-button type="primary" @click="submitBranch('branchForm')">确定</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import { Node, NodeTag, copyJson, copyJsonWithPure, drawLine, selectById, addLine } from '@/utils/sceneNode'
import $ from '@/utils/jquery-ui'

import {
  listResponseTags,
  listSceneNode,
  listSceneNodeProcessor,
  updateSceneNode,
  insertSceneNode,
  deleteSceneNode,
  listIntentState,
  updateSceneNodeProcessorList
} from '@/api/AiConfig'
import { listMessageTemplate } from '@/api/aiconfig/smsConfig'

export default {
  name: 'test',
  props: {
    sceneId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      talkList: [], // 话术流程列表
      processTitle: '', // 新建流程弹框标题
      isEdit: false, // 是否是编辑流程
      intentState: [], // 客户意向等级列表
      editId: null, // 编辑中的流程id 即左面列表的id
      editIndex: 0, // 编辑流程中的下标
      Answer: [], // 初始化默认回答方式
      isEditBranch: false, // 是否是编辑分支
      EditNodeTagId: '', // 是否是编辑分支
      messageTemplateList: [],
      rules: {
        name: [
          { required: true, message: '请输入流程名称', trigger: 'blur' }
        ]
      },
      ruleForm: {
        name: ''
      },
      branch: false,
      commonForm: {
        name: '',
        AI: '',
        checkedAnswer: [],
        acceptBreak: '',
        concern: '',
        customerIntent: '',
        action: ''
      },
      commons: {
        processorName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' }
        ],
        knowledge: [
          { required: true, message: '请输入AI话术', trigger: 'blur' }
        ],
        acceptBreak: [
          {
            required: false,
            message: '请选择客户是否可以打断',
            trigger: 'change'
          }
        ],
        concern: [
          { required: false, message: '请输入用户关注点', trigger: 'blur' }
        ],
        customerIntent: [
          { required: false, message: '请选择客户意向等级', trigger: 'change' }
        ],
        processorType: [
          { required: false, message: '请选择操作类型', trigger: 'change' }
        ]
      },
      branchs: {
        name: [
          { required: true, message: '请输入分支名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入回答方式', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        style: [{ required: true, message: '请填写回答方式', trigger: 'blur' }]
      },
      branchForm: {
        name: '',
        style: '',
        key: ''
      }
    }
  },
  computed: {
    open() {
      return this.$store.state.node.open
    },
    openTalkType() {
      return this.$store.state.node.openType
    },
    nodeTransfer() {
      return this.$store.state.node.nodeTransfer
    },
    nodeList() {
      return this.$store.state.node.nodeList
    }
  },
  methods: {
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid() {
      return (
        this.S4() +
        this.S4() +
        this.S4() +
        this.S4() +
        this.S4() +
        this.S4() +
        this.S4() +
        this.S4()
      )
    },
    getListIntentState() {
      // 获取意向等级
      listIntentState()
        .then(res => {
          this.intentState = res.data.result
        })
    },
    handleClose() {
      this.dialogVisible = false
    },
    getListResponseTags() {
      // 获取默认标签
      listResponseTags().then(res => {
        this.Answer = res.data.result
      })
    },
    changeScene(item, index) {
      // 切换话术流程
      if (item.id === this.editId) {
        return false
      }
      this.$confirm('切换前请确认保存流程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editId = item.id
        this.editIndex = index
        this.clearNodeList()
        this.getListSceneNodeProcessor()
      }).catch(() => {

      })
    },
    addProcess() {
      if (this.talkList.length <= 0) {
        this.isEdit = false
        this.dialogVisible = true
        this.processTitle = '新建流程'
        this.ruleForm.name = ''
      } else {
        this.$confirm('新建流程前请先确认保存流程', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.isEdit = false
            this.dialogVisible = true
            this.processTitle = '新建流程'
            this.ruleForm.name = ''
          })
      }
    },
    editProcess(item, index) {
      this.editId = item.id
      this.isEdit = true
      this.dialogVisible = true
      this.processTitle = '编辑流程'
      this.ruleForm.name = item.sceneNodeName
    },
    deleteProcess(id) {
      this.$confirm('是否删除流程', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            sceneId: this.sceneId,
            sceneNodeId: id
          }
          deleteSceneNode(data).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.clearNodeList()
            if (this.editId === id) {
              this.editId = null
            }
            this.getListSceneNode()
          })
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
        })
    },
    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            const data = {
              sceneId: this.sceneId,
              sceneNodeName: this.ruleForm.name,
              sceneNodeId: this.editId
            }
            updateSceneNode(data).then(res => {
              if (res.data.resultCode === 200) {
                this.$message({
                  type: 'success',
                  message: '修改流程成功'
                })
                this.clearNodeList()
                this.getListSceneNode()
                this.dialogVisible = false
              }
            })
          } else {
            const data = {
              sceneId: this.sceneId,
              sceneNodeName: this.ruleForm.name
            }
            insertSceneNode(data)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '新增流程成功'
                })
                this.getListSceneNode()
                this.dialogVisible = false
              })
          }
        } else {
          return false
        }
      })
    },
    addBranch() {
      this.isEditBranch = false
      this.branch = true
      this.EditNodeTagId = ''
      this.branchForm.name = ''
      this.branchForm.style = ''
    },
    editBranch(item) {
      const nodeTag = selectById(this.nodeTransfer.tagsMap, item.id)
      this.isEditBranch = true
      this.branch = true
      this.EditNodeTagId = nodeTag.id
      this.branchForm.name = nodeTag.tagName
      this.branchForm.style = nodeTag.questions.join('\n')
    },
    submitBranch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isEditBranch) {
            const node = this.$store.state.node
            const questions = this.branchForm.style.split('\n')
            const nodeTag = new NodeTag('tag' + this.guid(), this.branchForm.name, true, questions, node.nodeTransfer.id)
            node.nodeTransfer.tagsMap.push(nodeTag)
          } else {
            const nodeTag = selectById(this.nodeTransfer.tagsMap, this.EditNodeTagId)
            nodeTag.tagName = this.branchForm.name
            nodeTag.questions = this.branchForm.style.split('\n')
          }
          this.closeBrance()
        } else {
          return false
        }
      })
    },
    closeContent() {
      this.$store.state.node.open = false
      this.closeBrance()
    },
    closeBrance() {
      this.branch = false
    },
    addBlock() {
      const that = this
      $('.node .header a').draggable({
        helper: 'clone',
        appendTo: '#content',
        start: function(event, ui) {

        },
        stop: function(event, ui) {
          const id = 'nid' + that.guid()
          const node = new Node(id)
          if (event.target.className.indexOf('common') > -1) {
            node.knowledge = '你好啊'
            node.processorName = '普通话术'
            node.processorType = 1
            node.tagsMap = []
            that.Answer.forEach(element => {
              node.tagsMap.push(new NodeTag('tag' + that.guid(), element.tagName, element.checked, element.questions, node.id))
            })
          } else {
            node.knowledge = '(不录音)'
            node.processorName = '跳转话术'
            node.processorType = 2
            node.tagsMap = []
          }
          node.customerIntent = 0
          node.acceptBreak = true
          node.positionX = ui.position.top
          node.positionY = ui.position.left
          node.responseTags = []
          that.nodeList.push(node)
        }
      })
    },
    getListSceneNode() {
      // 获取流程列表
      const data = {
        sceneId: this.sceneId
      }
      this.$store.commit('SET_SCENEID', this.sceneId)
      listSceneNode(data).then(res => {
        if (res.data.resultCode === 200) {
          this.talkList = res.data.result === null ? [] : res.data.result
          if (this.talkList.length > 0) {
            if (this.editId == null) {
              this.editId = this.talkList[0].id
            }
            this.$store.commit('SET_SCENENODEID', this.editId)
            this.getListSceneNodeProcessor()
          } else {
            this.editId = null
          }
        }
      })
    },
    getListSceneNodeProcessor() {
      // 获取流程节点列表
      const data = {
        sceneId: this.sceneId,
        sceneNodeId: this.editId
      }
      listSceneNodeProcessor(data).then(res => {
        const result = res.data.result
        this.$nextTick(() => {
          this.init(result)
        })
      })
    },
    submit(formName) {
      // 修改节点块
      this.$refs[formName].validate(valid => {
        if (valid) {
          const node = this.$store.state.node
          copyJson(node.nodeTransfer, node.nodeList[node.nodeTransferIndex])
          const orginNode = node.nodeList[node.nodeTransferIndex]
          this.closeContent()
          for (let j = 0; j < orginNode.tagsMap.length; j++) {
            if (!orginNode.tagsMap[j].checked) {
              if (orginNode.tagsMap[j].childNodeId != null) {
                if (orginNode.tagsMap[j].line != null) {
                  $(orginNode.tagsMap[j].line.cav).remove()
                  orginNode.tagsMap[j].line = null
                  orginNode.tagsMap[j].childNodeId = null
                }
              }
            } else {
              if (orginNode.tagsMap[j].line != null) {
                this.$nextTick(() => {
                  drawLine(orginNode.tagsMap[j].line)
                })
              }
            }
          }
        }
      })
    },
    init(val) {
      const result = val
      for (let i = 0; i < result.length; i++) {
        const node = new Node(result[i].id)
        // 复制对象
        copyJson(result[i], node)
        // 单独创建tagsMap
        node.tagsMap = []
        if (result[i].tagsMap != null) {
          result[i].tagsMap.forEach(element => {
            node.tagsMap.push(new NodeTag(element.id, element.tagName, element.checked, element.questions, result[i].id, element.childNodeId))
          })
        }
        this.$store.state.node.nodeList.push(node)
      }
      this.$nextTick(() => {
        for (let i = 0; i < this.$store.state.node.nodeList.length; i++) {
          const node = this.$store.state.node.nodeList[i]
          for (const tag of node.tagsMap) {
            if (tag.childNodeId != null) {
              const childNode = selectById(this.$store.state.node.nodeList, tag.childNodeId)
              addLine(tag, childNode, true)
            }
          }
        }
      })
    },
    save() {
      const nodeList = []
      copyJsonWithPure(this.$store.state.node.nodeList, nodeList)
      const data = {
        sceneId: this.sceneId,
        sceneNodeId: this.editId,
        sceneNodeProcessorList: nodeList
      }
      updateSceneNodeProcessorList(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        })
    },
    clearNodeList() {
      this.$store.state.node.nodeList = []
      $('#content canvas').remove()
    },
    listMessageTemplate() {
      const param = { templateStatus: 1 }
      listMessageTemplate(param)
        .then(res => {
          this.messageTemplateList = res.data.result
        })
    }
  },
  watch: {
    sceneId(val) {
      this.clearNodeList()
      this.editId = null
      this.$store.commit('SET_SCENEID', this.sceneId)
      this.$nextTick(() => {
        this.getListSceneNode()
      })
    }
  },
  mounted() {
    this.addBlock()
    this.getListResponseTags()
    this.getListIntentState()
    this.listMessageTemplate()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.talk-setting {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .setting-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 170px;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    background: #fff;
    & /deep/ .el-input {
      width: 300px;
    }
    & > button {
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
    }
    ul {
      overflow: hidden;
    }
    li {
      float: left;
      width: 100%;
      padding: 0 20px 0 5px;
      cursor: pointer;
      margin-bottom: 10px;
      span {
        float: left;
        line-height: 60px;
        color: #666;
      }
      div {
        width: 120px;
        border: 1px solid #e6e6e6;
        float: right;
        padding: 10px;
        border-radius: 3px;
        color: #666;
        &.active {
          background-color: #c6e2ff;
          border: 1px solid #409eff;
        }
        h6 {
          font-weight: normal;
        }
        p {
          margin-top: 10px;
          text-align: right;
        }
      }
    }
  }
  .setting-right {
    width: 100%;
    height: 100%;
    padding-left: 170px;
    background-color: #f7f7f7;
    padding-top: 45px;
    .header {
      background-color: #fff;
      height: 45px;
      padding: 5px 10px;
      border-bottom: 1px solid #e6e6e6;
      position: absolute;
      left: 170px;
      top: 0;
      z-index: 5;
      width: calc(100% - 170px);
      a {
        padding: 5px;
        border: 1px solid #aaa;
        border-radius: 3px;
        float: left;
        font-size: 12px;
        color: #666;
        margin-right: 10px;
        span {
          float: left;
          line-height: 20px;
          margin: 0 5px;
        }
        i {
          font-size: 18px;
          float: left;
          &:last-child {
            color: #8cc5fe;
          }
        }
        p,
        button {
          display: none;
        }
      }
    }
    .save {
      position: absolute;
      bottom: 40px;
      right: 60px;
      z-index: 3;
    }
  }
  .common-setting {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    width: 500px;
    height: 100%;
    background-color: #fff;
    border-left: 1px solid #ccc;
    & /deep/ .el-input {
      width: 300px;
    }
    & /deep/ .el-textarea {
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
    .commonForm {
      padding: 10px;
      overflow-y: auto;
      height: calc(100% - 50px);
      padding-bottom: 50px;
      .mycheckbox {
        border: 1px solid #e6e6e6;
        border-bottom: none;
        border-radius: 3px;
        width: 300px;
        p {
          border-bottom: 1px solid #e6e6e6;
          padding-left: 10px;
          .edit {
            float: right;
            font-size: 14px;
            color: #409eff;
            margin-right: 50px;
            cursor: pointer;
          }
        }
      }
    }
    .btn {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 480px;
      height: 70px;
      padding-top: 10px;
      padding-right: 20px;
      background-color: #fff;
      text-align: right;
    }
    .my-check-group{
      border: 1px solid #e6e6e6;
      border-bottom: none;
      border-radius: 3px;
      width: 300px;
      &>p{
         padding-left: 10px;
         border-bottom: 1px solid #e6e6e6;
      }
      .edit{
        float: right;
        font-size: 14px;
        color: #409eff;
        margin-right: 50px;
        cursor: pointer;
      }
    }
  }
  .common-branch {
    position: fixed;
    top: 0;
    right: 0;
    width: 370px;
    height: 100%;
    background-color: #fff;
    border-left: 1px solid #ccc;
    z-index: 10;
    & /deep/ .el-input {
      width: 230px;
    }
    & /deep/ .el-textarea {
      width: 230px;
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
    .branchForm {
      padding: 10px;
      .key {
        p {
          color: #999;
          line-height: 25px;
        }
      }
    }
    .btn {
      position: absolute;
      bottom: 40px;
      right: 40px;
    }
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(800px);
}

.content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  overflow-y: scroll;
  ul {
    width: 100%;
    height: 3000px;
  }
  a.ui-draggable-dragging {
    p,
    button {
      display: none;
    }
  }
  li {
    list-style: none;
    position: absolute;
    z-index: 3;
    border: 2px solid transparent;
    &.active{
      border: 2px solid #409EFF;
    }
    b {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      display: none;
    }
    &:hover {
      b {
        display: block;
      }
    }
  }
  canvas {
    position: absolute;
  }
  .add-li {
    max-width: 240px;
    min-width: 140px;
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
</style>
