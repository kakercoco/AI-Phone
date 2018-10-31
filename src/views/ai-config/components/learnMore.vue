<template>
  <div class="learning">
    <div class="top">
      <el-input placeholder="请输入内容" v-model="historySentence" class="input-with-select">
        <el-select v-model="learnStatus" slot="prepend" placeholder="请选择" clearable  @change="getListKnowledgeLearn">
          <el-option label="待学习" :value="2"></el-option>
          <el-option label="已学习" :value="1"></el-option>
          <el-option label="已忽略" :value="3"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getListKnowledgeLearn"></el-button>
      </el-input>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="historySentence" label="待学习问题">
      </el-table-column>
      <el-table-column prop="name" label="来源">
        <template slot-scope="scoped">
          <el-button type="text" @click="lookCallHistory(scoped.row.historyId)" >查看通话记录</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="记录时间">
      </el-table-column>
      <el-table-column prop="learnStatus" label="学习状态">
        <template slot-scope="scoped">
          <span :class="[scoped.row.learnStatus.code === 2? 'red':'blue']">{{scoped.row.learnStatus.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scoped">
          <el-popover placement="bottom" width="160"  trigger="hover">
            <el-button type="primary" size="mini" @click="showSidebar(scoped.row)">新增</el-button>
            <el-button size="mini" type="success" @click="chooseKnowledge(scoped.row.id)">修改</el-button>
            <el-button type="text"  v-if="scoped.row.learnStatus.code !== 1" slot="reference">学习</el-button>
          </el-popover>
          
          <el-button type="text" @click="look(scoped.row.knowledgeId)" v-if="scoped.row.learnStatus.code === 1">查看</el-button>
          <el-button type="text" @click="overLook(scoped.row.id)" v-if="scoped.row.learnStatus.code === 2">忽略</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="选择知识点" :visible.sync="knowledgeDialog" width="500px">
      <el-form :model="form">
        <el-form-item label="分类列表:" label-width="120px">
          <el-select v-model="form.classify" placeholder="请选择分类"  @change="classifyChange">
            <el-option :label="item.classifyName" :value="item.id" v-for="(item,index) in classifyList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="知识点列表:" label-width="120px">
          <el-select v-model="form.knowledge" placeholder="请选择分类">
            <el-option :label="item.title" :value="item.id" v-for="(item,index) in knowledgeList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="knowledgeDialog = false">取 消</el-button>
        <el-button type="primary" @click="showSidebarEdit">确 定</el-button>
      </div>
    </el-dialog>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <call-content :callContentDetail='callContentDetail' :open="open" @close="close"></call-content>
    <sidebar-from :open="sidebarOpen" :ruleForm="ruleForm" @close="sidebarClose" @submit="submit"></sidebar-from>
    <knowledge-detail :knowledgeOpen="knowledgeOpen" :questionContentDetail="questionContentDetail" @close="knowledgeClose"></knowledge-detail>
  </div>
</template>

<script>
import { listKnowledgeLearn, knowledgeLearnIgnore, listScene, listKnowledgeClassify, listKnowledge, updateKnowledgeForLearn, insertKnowledgeLearn, selectKnowledge
} from '@/api/AiConfig'
import { callHistoryDetail } from '@/api/callTask'
import callContent from '@/components/call/callContent'
import sidebarFrom from '@/components/call/sideBarFrom'
import knowledgeDetail from '@/components/call/knowledgeDetail'

export default {
  name: 'learnMore',
  components: {
    callContent,
    knowledgeDetail,
    sidebarFrom
  },
  props: {
    sceneId: {
      type: String
    }
  },
  data() {
    return {
      tableData: [],
      options: [],
      historySentence: '',
      learnStatus: 2,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      open: false,
      sidebarOpen: false,
      knowledgeOpen: false,
      knowledgeDialog: false,
      callContentDetail: {},
      questionContentDetail: {
        customerIntent: {
          title: ''
        }
      },
      sceneList: [], // 话术列表下拉选项
      classifyList: [], // 分类列表下拉选项
      knowledgeList: [], // 知识点列表下拉选项
      knowledgeLearnId: '', // 要学习的id
      isEditKnowledge: false, // 要学习的id是否是编辑
      form: {
        classify: '',
        knowledge: ''
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
        classifyId: '',
        answerList: [{ answerContent: '' }] // 添加问题时的回答列表
      }
    },
    getListKnowledgeLearn() {
      const data = {
        historySentence: this.historySentence,
        learnStatus: this.learnStatus,
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        sceneId: this.sceneId
      }
      listKnowledgeLearn(data)
        .then(res => {
          this.total = res.data.result.total
          this.tableData = res.data.result.list
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getListKnowledgeLearn()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getListKnowledgeLearn()
    },
    lookCallHistory(id) {
      const data = {
        callHistoryId: id
      }
      callHistoryDetail(data)
        .then(res => {
          this.open = true
          this.callContentDetail = res.data.result
        })
    },
    close(val) {
      this.open = val
    },
    sidebarClose(val) {
      this.sidebarOpen = val
      this.clearForm()
    },
    knowledgeClose(val) {
      this.knowledgeOpen = val
    },
    look(id) {
      const data = {
        knowledgeId: id
      }
      selectKnowledge(data)
        .then(res => {
          this.knowledgeOpen = true
          this.questionContentDetail = res.data.result
        })
    },
    showSidebar(item) {
      this.sidebarOpen = true
      this.isEditKnowledge = false
      this.knowledgeLearnId = item.id
    },
    showSidebarEdit() {
      this.isEditKnowledge = true
      this.selectKnowledge()
    },
    selectKnowledge() {
      const data = {
        knowledgeId: this.form.knowledge
      }
      selectKnowledge(data)
        .then(res => {
          const val = res.data.result
          this.ruleForm = {
            title: val.title,
            standardQuestion: val.standardQuestion,
            keywords: val.keywords.join('\n'),
            concern: val.concern,
            customerIntent: val.customerIntent.code,
            action: val.action,
            actionParam: val.actionParam,
            classifyId: val.classifyId,
            answerList: val.answerList // 添加问题时的回答列表
          }
          this.sidebarOpen = true
          this.knowledgeDialog = false
        })
    },
    chooseKnowledge(id) {
      this.knowledgeLearnId = id
      this.knowledgeDialog = true
      this.form.classify = ''
      this.form.knowledge = ''
      this.getListKnowledge()
    },
    overLook(id) {
      const data = {
        knowledgeLearnId: id
      }
      knowledgeLearnIgnore(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.getListKnowledgeLearn()
        })
    },
    getListScene() {
      const data = {}
      listScene(data)
        .then(res => {
          this.sceneList = res.data.result.list
        })
    },
    getListKnowledgeClassify() {
      const data = {
        sceneId: this.sceneId
      }
      listKnowledgeClassify(data)
        .then(res => {
          this.form.knowledge = ''
          this.classifyList = res.data.result
          this.classifyList.unshift({
            classifyName: '未分类',
            id: ''
          })
        })
    },
    getListKnowledge() {
      const data = {
        sceneId: this.sceneId,
        classifyId: this.form.classify,
        type: 1
      }
      listKnowledge(data)
        .then(res => {
          this.knowledgeList = res.data.result
        })
    },
    classifyChange() {
      this.form.knowledge = ''
      this.getListKnowledge()
    },
    submit(val) {
      if (this.isEditKnowledge) {
        const data = {
          title: val.title,
          standardQuestion: val.standardQuestion,
          keywords: val.keywords.split('\n'),
          answerList: val.answerList,
          action: val.action,
          actionParam: val.actionParam,
          concern: val.concern,
          customerIntent: val.customerIntent,
          classifyId: val.classifyId,
          sceneId: this.sceneId,
          knowledgeId: this.form.knowledge,
          knowledgeLearnId: this.knowledgeLearnId
        }
        updateKnowledgeForLearn(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.sidebarOpen = false
            this.clearForm()
            this.getListKnowledgeLearn()
          })
      } else {
        const data = {
          title: val.title,
          standardQuestion: val.standardQuestion,
          keywords: val.keywords.split('\n'),
          answerList: val.answerList,
          action: val.action,
          actionParam: val.actionParam,
          concern: val.concern,
          customerIntent: val.customerIntent,
          classifyId: val.classify,
          sceneId: this.sceneId,
          knowledgeLearnId: this.knowledgeLearnId
        }
        insertKnowledgeLearn(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.sidebarOpen = false
            this.clearForm()
            this.getListKnowledgeLearn()
          })
      }
    }
  },
  watch: {
    sceneId(val) {
      this.getListKnowledgeLearn()
      this.getListKnowledgeClassify()
      this.getListKnowledge()
    }
  },
  mounted() {
    this.getListKnowledgeLearn()
    this.getListScene()
    this.getListKnowledgeClassify()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.learning {
  .red{
    color: red;
  }
  .blue{
    color: #409EFF;
  }
  .top {
    .el-input{
      width: 400px;
    }
    .el-select {
      & /deep/ .el-input {
        width: 130px;
      }
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
  .page{
    text-align: center;
    margin-top: 20px;
  }
  
}
</style>
