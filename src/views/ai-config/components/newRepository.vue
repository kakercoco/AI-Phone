<template>
  <div class="repository">
    <div class="repository-left">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddDialog">新建分类</el-button>
      <ul class="sort-list">
        <li style="background-color: #f0f9eb;border-color: #e1f3d8;" @click="unClassify">
          <p>未分类</p>
          <p>未分类内容</p>
        </li>
        <li :class="{active:classifyId === item.id}" v-for="(item, index) in sortList" :key="index" @click="changeSort(item)">
          <p>{{item.classifyName}}</p>
          <p>{{item.classifyDescription}}</p>
          <p class="tar edit-icon"><i class="el-icon-edit" @click.stop="showEditDiaLog(item)"></i> <i class="el-icon-delete" @click.stop="deleteSortList(item)"></i></p>
        </li>
      </ul>
    </div>
    <el-dialog :title="sortDialogTitle" :visible.sync="addFromStatus" width="500px" class="add-from">
      <el-form :model="addForm" :rules="addFormRules" ref="ruleAddForm">
        <el-form-item label="分类名称" label-width="120px" prop="title">
          <el-input v-model="addForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" label-width="120px" prop="description">
          <el-input v-model="addForm.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFromStatus = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('ruleAddForm')">确 定</el-button>
      </div>
    </el-dialog>
    <div class="repository-right">
      <ul class="repository-block">
        <li class="tac" @click="showAdd()">
          <i class="el-icon-plus add"></i>
        </li>
        <li v-for="(item,index) in knowledgeList" :key="index" :class="{special:item.questionType === 3}">
          <el-tooltip content="删除" placement="top" effect="light">
            <i class="el-icon-close close" @click="del(item)" v-if="item.questionType !== 3"></i>
          </el-tooltip>
          <h3>{{item.title}}</h3>
          <p class="description">{{item.standardQuestion}}</p>
          <p class="tar"><time>{{item.createAt}}</time></p>
          <div>
            <el-tooltip content="编辑" placement="bottom" effect="light">
            <i class="el-icon-edit-outline" @click="showEdit(item)"></i>
          </el-tooltip>
          <el-tooltip content="查看详情" placement="bottom" effect="light">
            <i class="el-icon-view" @click="look(item)"></i>
          </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
    <sidebar-from :open="sidebarOpen" :sceneId="sceneId" :ruleForm="ruleForm" @close="sidebarClose" @submit="submit"></sidebar-from>
    <knowledge-detail :knowledgeOpen="knowledgeOpen" :questionContentDetail="questionContentDetail" @close="knowledgeClose"></knowledge-detail>
  </div>
</template>

<script>
import { listKnowledgeClassify, insertKnowledgeClassify, updateKnowledgeClassify, deleteKnowledgeClassify, listKnowledge, listIntentState, insertKnowledge, updateKnowledge, selectKnowledge, deleteKnowledge } from '@/api/AiConfig'
import sidebarFrom from '@/components/call/sideBarFrom'
import knowledgeDetail from '@/components/call/knowledgeDetail'

export default {
  name: 'newRepository',
  components: {
    sidebarFrom,
    knowledgeDetail
  },
  props: {
    sceneId: {
      type: String
    }
  },
  data() {
    return {
      sidebarOpen: false,
      knowledgeOpen: false,
      questionContentDetail: {
        customerIntent: {
          title: ''
        }
      }, // 知识点详情
      intentState: [],
      sortList: [], // 分类列表
      addFromStatus: false, // 新增分类列表弹框显示状态
      isEditSort: false, // 新增还是修改分类列表弹框
      sortDialogTitle: '新增分类', // 分类列表弹框标题
      editSortId: '', // 分类列表编辑中的id
      classifyId: '', // 分类列表选中的id
      knowledgeList: [], // 知识库列表
      isEditKnowledge: false, // 新增还是修改知识库
      knowledgeId: '', // 编辑中的知识点id
      addForm: {
        title: '',
        description: ''
      },
      addFormRules: {
        title: [
          { required: true, message: '请输入分类标题', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入分类描述', trigger: 'blur' }
        ]
      },
      ruleForm: {
        title: '',
        standardQuestion: '',
        keywords: '',
        concern: '',
        customerIntent: 0,
        action: 0,
        actionParam: '',
        classifyId: '',
        questionType: 0,
        jumpSceneNodeId: '',
        jumpSceneNodeProcessorId: '',
        answerList: [{ answerContent: '' }] // 添加问题时的回答列表
      }
    }
  },
  methods: {
    clearForm() {
      this.ruleForm = {
        title: '',
        standardQuestion: '',
        keywords: '',
        concern: '',
        customerIntent: 0,
        action: 0,
        actionParam: '',
        questionType: 0,
        jumpSceneNodeId: '',
        jumpSceneNodeProcessorId: '',
        answerList: [{ answerContent: '' }] // 添加问题时的回答列表
      }
    },
    sidebarClose(val) {
      this.sidebarOpen = val
      this.clearForm()
    },
    addAnswerList() {
      this.answerList.push({
        answerContent: ''
      })
    },
    deleteAnswerList(index) {
      this.answerList.splice(index, 1)
    },
    knowledgeClose(val) {
      this.knowledgeOpen = val
    },
    showAdd() {
      this.sidebarOpen = true
      this.isEditKnowledge = false
      this.ruleForm = {
        title: '',
        standardQuestion: '',
        keywords: '',
        concern: '',
        customerIntent: 0,
        action: 0,
        actionParam: '',
        questionType: 0,
        classifyId: this.classifyId,
        jumpSceneNodeId: '',
        jumpSceneNodeProcessorId: '',
        answerList: [{ answerContent: '' }]
      }
    },
    showEdit(items) {
      this.sidebarOpen = true
      this.isEditKnowledge = true

      const data = {
        knowledgeId: items.id
      }
      selectKnowledge(data)
        .then(res => {
          const item = res.data.result
          this.ruleForm = {
            title: item.title,
            standardQuestion: item.standardQuestion,
            keywords: item.keywords.join('\n'),
            concern: item.concern,
            customerIntent: item.customerIntent.code,
            action: item.action,
            actionParam: item.actionParam,
            answerList: item.answerList,
            questionType: item.questionType,
            jumpSceneNodeId: item.jumpSceneNodeId,
            jumpSceneNodeProcessorId: item.jumpSceneNodeProcessorId,
            classifyId: item.classifyId
          }
          this.classifyId = item.classifyId
          this.knowledgeId = item.id
        })
    },
    add(val) {
      const data = JSON.parse(JSON.stringify(val))
      data.sceneId = this.sceneId
      data.keywords = val.keywords.split('\n')
      insertKnowledge(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.getListKnowledge()
          this.sidebarClose()
        })
    },
    edit(val) {
      const data = JSON.parse(JSON.stringify(val))
      data.sceneId = this.sceneId
      data.knowledgeId = this.knowledgeId
      data.keywords = val.keywords.split('\n')
      updateKnowledge(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.getListKnowledge()
          this.sidebarClose()
        })
    },
    look(items) {
      const data = {
        knowledgeId: items.id
      }
      selectKnowledge(data)
        .then(res => {
          this.knowledgeOpen = true
          this.questionContentDetail = res.data.result
        })
    },
    del(item) {
      const data = {
        knowledgeId: item.id
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteKnowledge(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.getListKnowledge()
          })
      })
    },
    submit(val) {
      if (this.isEditKnowledge) {
        this.edit(val)
      } else {
        this.add(val)
      }
    },
    getListKnowledgeClassify() {
      const data = {
        sceneId: this.sceneId
      }
      listKnowledgeClassify(data)
        .then(res => {
          this.sortList = res.data.result
          this.$store.state.node.sortList = res.data.result
        })
    },
    getListKnowledge() {
      const data = {
        sceneId: this.sceneId,
        classifyId: this.classifyId
      }
      listKnowledge(data)
        .then(res => {
          this.knowledgeList = res.data.result
        })
    },
    showAddDialog() {
      this.addFromStatus = true
      this.isEditSort = false
      this.sortDialogTitle = '新增分类'
      this.addForm.title = ''
      this.addForm.description = ''
    },
    showEditDiaLog(item) {
      this.addFromStatus = true
      this.isEditSort = true
      this.sortDialogTitle = '修改分类'
      this.addForm.title = item.classifyName
      this.addForm.description = item.classifyDescription
      this.editSortId = item.id
    },
    addSortlist() {
      const data = {
        classifyName: this.addForm.title,
        classifyDescription: this.addForm.description,
        sceneId: this.sceneId
      }
      insertKnowledgeClassify(data)
        .then(res => {
          this.addFromStatus = false
          this.getListKnowledgeClassify()
        })
    },
    updateSortList() {
      const data = {
        classifyName: this.addForm.title,
        classifyDescription: this.addForm.description,
        sceneId: this.sceneId,
        id: this.editSortId
      }
      updateKnowledgeClassify(data)
        .then(res => {
          this.addFromStatus = false
          this.getListKnowledgeClassify()
        })
    },
    deleteSortList(item) {
      const data = {
        id: item.id
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteKnowledgeClassify(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.getListKnowledgeClassify()
          })
      })
    },
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEditSort) {
            this.updateSortList()
          } else {
            this.addSortlist()
          }
        }
      })
    },
    changeSort(item) {
      if (this.classifyId === item.id) {
        return false
      }
      this.classifyId = item.id
      this.getListKnowledge()
      this.sidebarClose()
      this.knowledgeClose()
    },
    unClassify() {
      if (this.classifyId === '') return
      this.classifyId = ''
      this.getListKnowledge()
      this.sidebarClose()
      this.knowledgeClose()
    },
    getListIntentState() {
      listIntentState()
        .then(res => {
          this.intentState = res.data.result
        })
    }
  },
  watch: {
    sceneId(val) {
      this.getListKnowledgeClassify()
      this.getListKnowledge()
    }
  },
  mounted() {
    this.getListKnowledgeClassify()
    this.getListKnowledge()
    this.getListIntentState()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.repository{
  height: 100%;
  .repository-left{
    overflow: auto;
    height: 100%;
    float: left;
    width: 170px;
    border-right: 1px solid #eee;
    button{
      margin: 0 auto;
      display: block;
    }
    .sort-list{
      li{
        width: 140px;
        border: 1px solid #e6e6e6;
        padding: 10px;
        border-radius: 3px;
        color: #666;
        margin: 0 auto;
        margin-top: 10px;
        font-size: 14px;
        cursor: pointer;
        &.active{
          background-color: #c6e2ff;
          border: 1px solid #409eff;
        }
        p{
          margin-top: 5px;
          color: #999;
          &:first-child{
            margin-top: 0;
            color: #333;
          }
          &.edit-icon{
            i{
              font-size: 16px;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
  .add-from{
    .el-input{
      width: 300px;
    }
  }
  .repository-right{
    overflow: auto;
    width: calc(100% - 170px);
    height: 100%;
    float: right;
    padding: 10px;
    .repository-block{
      li {
        width: 19%;
        float: left;
        height: 150px;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        box-shadow: 0 0 5px #e6e6e6;
        padding: 10px;
        margin-bottom: 10px;
        margin-right: 1.2%;
        position: relative;
        &.special{
          background-color: #f0f9eb;
        }
        &:hover {
          .close{
            display: block;
          }
        }
        .close{
          position: absolute;
          right: 10px;
          top: 10px;
          cursor: pointer;
          font-size: 20px;
          display: none;
        }
        .add{
          font-size: 100px;
          color: #999;
          display: block;
          margin-top: 20px;
          cursor: pointer;
        }
        &:nth-of-type(5n){
          margin-right: 0;
        }
        &:hover{
          box-shadow: 0 0 5px #999;
        }
        h3{
          margin-bottom: 10px;
          height: 25px;
          line-height: 25px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 90%;
        }
        p{
          font-size: 14px;
          line-height: 20px;
          &.description{
            height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          time{
            color: #999;
            margin-top: 5px;
            display: block;
          }
        }
        div{
          text-align: right;
          i{
            color: #409eff;
            font-size: 20px;
            margin-top: 5px;
            cursor: pointer;
            margin-left: 5px;
          }
        }
      }
    }
  }
   .add-question{
    position: fixed;
    top: 0;
    right: 0;
    width: 500px;
    height: 100%;
    z-index: 2;
    background-color: #fafafa;
    border-left: 1px solid #ccc;
    & /deep/ .el-input{
      width: 300px;
    }
    .h3{
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #eee;
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
        line-height: 40px;
        margin-left: 20px;
        font-size: 16px;
        font-weight: bold;

      }
    }
    .questionForm{
      height: calc(100% - 50px);
      padding: 10px;
      padding-bottom: 60px;
      overflow: auto;
      & /deep/ .el-textarea{
        width: 300px;
      }
      .answerList{
        position: relative;
        .btn{
          position: absolute;
          top: -40px;
          right: 70px;
        }
        ul{
          margin-top: 10px;
        }
        li{
          padding: 20px;
          background-color: #f2f2f2;
          border-radius: 5px;
          width: 300px;
          margin-bottom: 10px;
          line-height: 20px;
          font-size: 12px;
          position: relative;
          i{
            position: absolute;
            width: 10px;
            height: 10px;
            top: 10px;
            left: -5px;
            background-color: #f2f2f2;
            -webkit-transform: skew(45deg);
            transform: skew(45deg);
          }
          span{
            display: block;
            outline:none;
          }
          b{
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
    .main-btn{
      position: absolute;
      left: 0;
      bottom:0;
      width: 480px;
      height: 70px;
      padding-top: 10px;
      padding-right: 20px;
      background-color: #fafafa;
      text-align: right;
    }
    .questionList-textarea.el-textarea{
      width: 100%;
      & /deep/ .el-textarea__inner{
        border: none;
        background-color: transparent;
        padding: 0;
        font-size: 12px;
        color: #333;
      }
    }
  }
  .qusetion-detail{
    position: fixed;
    top: 0;
    right: 0;
    width: 801px;
    height: 100%;
    z-index: 4;
    background-color: #fafafa;
    padding-top: 50px;
    border-left: 1px solid #ccc;
    & /deep/ .el-input{
      width: 300px;
    }
    .h3{
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #eee;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 0;
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
        margin: 5px 20px ;
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
    .detail-left{
      height: 100%;
      width: 260px;
      float: left;
      &>div{
        padding: 20px 10px;
        border-bottom: 1px dashed #ccc;
        height: 90px;
        font-size: 14px;
        &:last-of-type{
          border-bottom: none;
        }
        span{
          float: left;
          width: 80px;
          height: 100%;
          color: #666;
        }
        p{
          font-size: 13px;
          color: #666;
          a{
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
            &.active{
              color: #fff;
              background-color: #409EFF;
            }
          }
        }
      }
      &>p{
        padding:10px;
        text-align: center;
        &:first-of-type{
          margin-top: 20px;
        }
        i{
          transform: rotate(90deg);
          font-size: 18px;
          margin-top: -10px;
          color: #999;
          cursor: pointer;
        }
      }
    }
    .detail-right{
      height: 100%;
      width: 540px;
      float: left;
      background-color: #fff;
      padding: 10px;
      overflow-y: auto;
      h5{
        color: #666;
        font-weight: normal;
        margin-bottom: 20px;
      }
      li{
        overflow: hidden;
        margin-bottom: 30px;
        span{
          background-color: #8cc5fe;
          border-radius: 40px;
          padding: 8px;
          width: 40px;
          height: 40px;
          text-align: center;
          svg{
            color: #fff;
            font-size: 25px;
          }
        }
        p{
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
      .question-audio{
        width: 380px;
        padding: 0 60px ;
        audio{
         background: #f1f3f4;
         width: 400px;
        }
      }
      .slider-right-kefu{
        cursor: pointer;
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
          }
          i{
            left: auto;
            right: -5px;
            transform: skew(-45deg)
          }
        }
      }
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
