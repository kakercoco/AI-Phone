/*
 * @Author: kaker.xutianxing
 * @Date: 2018-08-03 16:48:36
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-08-07 15:16:04
 */
<template>
  <div class="call-task">
    <div class="task-top">
      <p class="select-list" @click="showList">{{selectedTask.taskName}}
        <i class="el-icon-caret-bottom"></i>
      </p>
      <div class="select-message">
        <p class="select-progress fl"><span :style="{width:callStatusInfo.tempo + '%' }"></span><i>{{selectedTask.status}}&nbsp;&nbsp;&nbsp;&nbsp;{{callStatusInfo.callFinish}}/{{callStatusInfo.callAll}}</i></p>
      </div>
      <p class="select-btn">
        <span>{{selectedTask.createBy}} 创建于 {{selectedTask.createAt}}</span>
        <el-button size="small" type="primary" @click="refreshTask" icon="el-icon-refresh">刷新</el-button>
        <el-button size="small" type="primary" @click="editTask" icon="el-icon-edit">编辑</el-button>
        <el-button type="success" size="small" @click="startServer" :disabled="hasPerm('callTask:stopAiCallTask')" icon="el-icon-caret-right">开始服务</el-button>
        <el-button type="danger" size="small" @click="offServer" :disabled="hasPerm('callTask:startAiCallTask')" icon="el-icon-circle-close-outline">暂停服务</el-button>
        <el-dropdown style="margin-left: 10px;">
          <span class="el-dropdown-link">
            <el-button type="primary" size="small" icon="el-icon-more"></el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="addClient"><i class="el-icon-plus"></i> 新增</el-dropdown-item>
            <el-dropdown-item @click.native="unexport = true"><i class="el-icon-download"></i>导入</el-dropdown-item>
            <el-dropdown-item @click.native="exportDialogVisible = true"><i class="el-icon-upload2"></i>导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </p>
      <el-dialog title="请选择意向等级(多选)" :visible.sync="exportDialogVisible" width="30%">
        <el-checkbox-group v-model="checkedIntentStateList">
          <el-checkbox v-for="item in intentStateList" :label="item.code" :key="item.code" class="export-intent-checkbox">{{item.title}}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exportDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="callExport">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="添加联系人" :visible.sync="dialogClient" width="500px" :before-close="clientClose" class="call-dialog">
      <el-form :model="clientForm" :rules="clientRules" ref="clientForm" label-width="100px">
        <el-form-item label="联系人：" prop="name">
          <el-input v-model="clientForm.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="num">
          <el-input v-model="clientForm.num"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="companyName">
          <el-input v-model="clientForm.companyName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clientClose">取 消</el-button>
        <el-button type="primary" @click="submit('clientForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="unexport" width="500px" :before-close="exportClose" class="call-dialog">
      <p>
        第一步：下载导入模板文件
        <a href="https://aibell.dongchali.net/resource/template/客户模板.xlsx" class="downloadT">下载模板</a>
      </p>
      <p class="upload">
        <i class="fl">第二步：上传文件</i>
        <el-upload class="upload-demo fl" ref="upload"  :http-request="myRequest" :action="action"  :limit="1" :show-file-list="true" :with-credentials='true' :auto-upload="false">
          <el-button size="mini" plain @click="clearFile">点击上传</el-button>
        </el-upload>
      </p>
      <p style="clear:both;">
        <i class="fl">提 示：</i>
        <span class="tip">文件格式必须是.xls或.xlsx扩展名</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportClose">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确 定</el-button>
      </span>
    </el-dialog>
    <div class="list-wrap" v-show="listWrap" @click.self="closeListWrap">
      <div class="list" v-show="listWrap">
        <h5 @click.self="closeListWrap">{{selectedTask.taskName}}
          <i class="el-icon-caret-bottom"></i>
        </h5>
        <p class="tac new-button" @click="addTask">
          <i class="el-icon-plus"></i> 新建任务</p>
        <ul>
          <li v-for="(item, index) in taskList" :key="index" @click="changeTask(item)" :class="{active:selectedTask.id === item.id}">
            <h6>
              <i class="el-icon-star-off"></i> {{item.taskName}}</h6>
            <p>描述：{{item.processName}}</p>
            <!-- <el-progress type="circle" :percentage="25"></el-progress> -->
            <p class="time">创建时间：{{item.createAt}}</p>
            <el-tag type="success" size="mini" class="status">{{item.status}}</el-tag>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog title="设置任务" :visible.sync="taskDialog" width="700px" :before-close="handleClose" class="call-dialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
        <el-form-item label="任务名称：" prop="taskName">
          <el-input v-model="ruleForm.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="启动方式：" prop="style">
          <el-radio-group v-model="ruleForm.style">
            <el-radio-button label="手动启动"></el-radio-button>
            <el-radio-button label="定时启动"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启动日期：" required v-if="ruleForm.style!='手动启动'">
          <el-col :span="13">
            <el-form-item prop="launchDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.launchDate" style="width: 100%;" value-format="yyyy/MM/dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="拨打时间：" prop="startTime">
          <el-col :span="8">
            <el-time-picker is-range arrow-control v-model="ruleForm.startTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm:ss">
            </el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="禁拨时间：" prop="limitTime">
          <el-col :span="8">
            <el-time-picker is-range arrow-control v-model="ruleForm.limitTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm:ss">
            </el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="微信推送：" prop="wechatPush">
          <el-col>
            <el-checkbox-group v-model="ruleForm.wechatPush">
              <el-checkbox :label="2">重点跟进</el-checkbox>
              <el-checkbox :label="1">需克服异议</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-form-item>
        <el-form-item label="话术：" prop="processId">
          <el-select v-model="ruleForm.processId" placeholder="请选择话术">
            <el-option :label="item.sceneName" :value="item.sceneId" v-for="(item,index) in listSceneSelect" :key="index"></el-option>
            <!-- <el-option label="话术二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="外呼号码：" prop="phoneId">
          <el-select v-model="ruleForm.phoneId" placeholder="请选择外呼号码">
            <el-option :label="item.telephoneNumber" :value="item.telephoneId" v-for="(item,index) in selectTelephone" :key="index"></el-option>
            <!-- <el-option label="外呼一" value="15670520667"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述：" prop="description">
          <el-input type="textarea" v-model="ruleForm.description" placeholder="请输入内容" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <div class="call-task-main" :style="{display:expandInfo.leftDisplay}">
      <div class="top">
        <el-row :gutter="0" class="call-infor">
          <el-col :span="24">
            <div>
              <p>话&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;术：</p>
              <p>{{taskInfo.processName}}</p>
            </div>
            <div>
              <p>启动方式：</p>
              <p>{{taskInfo.launchType === 1 ? '手动启动' : '定时启动' }}</p>
            </div>
          </el-col>
          <el-col :span="24">
            <div>
              <p>启动时间：</p>
              <p>{{taskInfo.launchDate}}</p>
            </div>
            <div>
              <p>主叫号码：</p>
              <p>{{taskInfo.phoneNumber}}</p>
            </div>
          </el-col>
          <el-col :span="24">
            <div>
              <p>拨打时间：</p>
              <p>{{taskInfo.dailyStart}}--{{taskInfo.dailyEnd}}</p>
            </div>
            <div>
              <p>禁拨时间：</p>
              <p>{{taskInfo.suspendStart}}--{{taskInfo.suspendEnd}}</p>
            </div>
          </el-col>
          <el-col :span="24">
            <div>
              <p>推送等级：</p>
              <p>
                <el-checkbox-group v-model="taskInfo.pushIntent" class="push-intent">
                  <el-checkbox :label="2" :disabled="true">重点跟进</el-checkbox>
                  <el-checkbox :label="1" :disabled="true">需克服异议</el-checkbox>
                </el-checkbox-group>
              </p>
            </div>
          </el-col>
        </el-row>
        <div class="call-statistics">
          <div>
            <p>
              <el-progress type="circle" :percentage="callStatusInfo.tempo" :width="80"></el-progress>
              <span>呼叫进度</span>
            </p>
            <p>
              <el-progress type="circle" :percentage="myStatistics.receptionRate" :width="80"></el-progress>
              <span>接通率</span>
            </p>
          </div>
          <ul>
            <li v-for="(item, index) in myStatistics.callStatistics" :key="index">
              <p :class="{blue:index===0}">{{item.statusNumber}}次</p>
              <p>{{item.contact_status}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="center">
        <graph :callTaskId="selectedTask.id" height="100%"></graph>
      </div>
      <div class="bottom">

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>客户关注点</span>
          </div>
          <el-tag v-for="(item,index) in concernList" :key="index" @mouseover.native="concernShowList(item.concern)"  class="concern-tag">{{item.concern}}
            <span class="concernNum">{{item.statusNumber}}</span>
            <div class="concern-list-table">
              <el-table :data="concernCallList" @row-click="rowClickFinish" class="concern-tag-list" height="280px">
              <el-table-column  property="customerName" label="姓名"></el-table-column>
              <el-table-column  property="callLength" label="通话时长"></el-table-column>
              <el-table-column  property="customerIntent.title" label="意向等级">
                <template slot-scope="scope">
                  <span>{{scope.row.customerIntent.title}}</span>
                </template>
              </el-table-column>
            </el-table>
            </div>
          </el-tag>
        </el-card>
      </div>
    </div>
    <div class="call-task-list" :style="{width: expandInfo.rightWidth}">
      <div class="expand-table-slider" @click="expandCustomerList" title="点击展开/折叠"><i :class="expandInfo.arrowIcon"></i></div>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="进行中" name="first">
          <div class="task-table" style="height: calc(100% - 50px);">
            <el-table :data="callingTaskContentList" style="width: 100%" height="100%" v-if="activeTab === 'first'">
              <el-table-column prop="customerName" label="客户名称">
              </el-table-column>
              <el-table-column prop="contact" label="电话">
              </el-table-column>
              <el-table-column prop="customerIntent" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteTaskContact(scope.row.customerId)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            </div>
          <div class="page">
            <el-pagination @size-change="sizeChangeGoing" @current-change="currentChangeGoing" :current-page="currentPageGoing" :page-sizes="[5, 10, 15, 20]" :page-size="pageSizeGoing" layout="total, sizes, prev, pager, next" :total="totalGoing" :small="true">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="second"  >
          <div class="filter-list">
            <el-select v-model="selectCallLength" clearable placeholder="通话时长" @change="getListTaskContact()">
              <el-option v-for="item in callLengthList" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
            <el-select v-model="selectCallNum" clearable placeholder="通话轮次" @change="getListTaskContact()">
              <el-option v-for="item in callNumList" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
            <el-select v-model="selectCallState" clearable placeholder="通话状态" @change="getListTaskContact()">
              <el-option v-for="item in callStateList" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
            <el-select v-model="selectIntent" clearable placeholder="意向等级" @change="getListTaskContact()">
              <el-option v-for="item in intentStateList" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="task-table">
            <el-table :stripe="true" :data="calledTaskContentList" style="width: 100%" @row-click="rowClickFinish" height="100%" v-if="activeTab === 'second'">
              <el-table-column prop="customerName" label="客户名称" fixed="left">
              </el-table-column>
              <el-table-column prop="callLength" label="通话时长">
              </el-table-column>
              <el-table-column prop="dialogueAmount" label="对话轮次">
              </el-table-column>
              <el-table-column prop="customerIntent" label="意向等级">
                <template slot-scope="scope">
                  <span>{{scope.row.customerIntent?scope.row.customerIntent.title:''}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="callTime" label="通话时间" width="180">
              </el-table-column >
              <el-table-column prop="contactStatus" label="状态">
              </el-table-column>
              <el-table-column label="" fixed="right">
                <template slot-scope="scope">
                    {{scope.row.readStatus}}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page">
            <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" :small="true">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <call-content :open="callContentOpen" :callContentDetail="callContentDetail" @close="callContentClose"></call-content>
    </div>
  </div>
</template>

<script>
import {
  CallTaskList,
  selectCallTaskDetailAndRate,
  listTaskContact,
  listPhoneState,
  listCallLength,
  listDialogueAmount,
  selectHearingStatistics,
  listSceneSelect,
  selectTelephone,
  updateTask,
  stopAiCallTask,
  startAiCallTask,
  addTask,
  selectTaskDetail,
  selectConcernStatistics,
  callHistoryDetail,
  selectCallHistoryForConcern,
  deleteTaskContact,
  downLoadCallTaskHistory,
  insertContact
} from '@/api/callTask'
import { listIntentState } from '@/api/AiConfig'
import graph from './components/graph'
import callContent from '@/components/call/callContent'
import axios from 'axios'

export default {
  name: 'callTask',
  components: {
    graph,
    callContent
  },
  data() {
    return {
      exportDialogVisible: false, // 导出对话框
      activeTab: 'first', // 选中的tab选项
      listWrap: false,
      taskList: [], // 任务列表
      selectedTask: {}, // 选中的任务项
      expandInfo: {
        expanded: false, // 表格展开
        leftDisplay: 'block', // 左边显示
        rightWidth: '40%', // 右边宽
        arrowIcon: 'el-icon-d-arrow-left' // 表格展开
      },
      taskInfo: {}, // 任务详情
      callStatusInfo: {
        tempo: 0, // 接通率
        callAll: 0, // 接通率
        callFinish: 0 // 接通率
      },
      pageSize: 10, // 已完成的table列表的显示多少条数
      currentPage: 1, // 已完成的table列表的当前页码
      total: 0, // 已完成的table列表的总页码
      pageSizeGoing: 10, // 进行中的table列表的显示多少条数
      currentPageGoing: 1, // 进行中的table列表的当前页码
      totalGoing: 0, // 进行中的table列表的总页码
      callingTaskContentList: [], // 进行中的table列表
      calledTaskContentList: [], // 已完成的table列表
      callLengthList: [], // 通话时长下拉框选项
      callNumList: [], // 通话轮次下拉框选项
      callStateList: [], // 通话状态下拉框选项
      intentStateList: [], // 客户意向登记下拉框选项
      checkedIntentStateList: [], // 导出时选择的意向等级
      selectCallLength: null, // 选中的通话时长选项
      selectCallNum: null, // 选中的通话轮次选项
      selectCallState: null, // 选中的通话状态选项
      selectIntent: null, // 选中的意向等级选项
      concernList: [], // 关注点列表
      concernCallList: [], // 关注点通话列表
      callContentOpen: false, // 通话状态显示
      callContentDetail: {}, // 通话状态内容
      unexport: false, // 导入的弹框
      action: process.env.BASE_API + '/customer/importCustomer',
      myStatistics: {
        // 统计数据
        callStatistics: [],
        concernStatistics: [],
        statistics: {},
        receptionRate: 0
      },
      taskDialog: false, // 新建任务dialog
      isEditTask: false, // 是否是编辑话术
      listSceneSelect: [], // 下拉话术列表
      selectTelephone: [], // 下拉外呼电话列表
      dialogClient: false, // 新增联系人dialog
      clientForm: {
        name: '',
        num: '',
        companyName: ''
      },
      clientRules: {
        name: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        num: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
      },
      ruleForm: {
        startTime: ['09:30:00', '17:30:00'], // 当天时间段
        limitTime: ['11:30:00', '14:30:00'], // 禁拨时间段
        taskName: '', // 任务名称
        style: '定时启动', // 启动方式
        processId: '', // 话术id
        launchDate: '', // 启动日期
        phoneId: '', // 外呼电话id
        description: '', // 任务详情
        wechatPush: [2] // 微信推送类型
      },
      rules: {
        taskName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        style: [{ required: true, message: '请选择方式', trigger: 'change' }],
        processId: [
          { required: true, message: '请选择话术', trigger: 'change' }
        ],
        phoneId: [
          { required: true, message: '请选择外呼号码', trigger: 'change' }
        ],
        launchDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        wechatPush: [
          { required: false, message: '请选择日期', trigger: 'change' }
        ],
        description: [
          { required: false, message: '请选择活动资源', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addClient() {
      this.dialogClient = true
      this.clientForm = {
        name: '',
        num: '',
        companyName: ''
      }
    },
    clientClose() {
      this.dialogClient = false
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            name: this.clientForm.name,
            contact: this.clientForm.num,
            companyName: this.clientForm.companyName,
            taskId: this.selectedTask.id
          }
          insertContact(data).then((res) => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.getListTaskContact()
            this.taskDetail()
          })
          this.dialogClient = false
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.taskDialog = false
    },
    getListSceneSelect() {
      listSceneSelect().then(res => {
        this.listSceneSelect = res.data.result
      })
    },
    getSelectTelephone() {
      selectTelephone().then(res => {
        this.selectTelephone = res.data.result
      })
    },
    getSelectConcernStatistics() {
      if (this.selectedTask.id == null) {
        return false
      }
      const data = {
        callTaskId: this.selectedTask.id
      }
      selectConcernStatistics(data)
        .then(res => {
          this.concernList = res.data.result
        })
    },
    deleteTaskContact(id) {
      const data = {
        customerIds: id,
        taskId: this.selectedTask.id
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTaskContact(data)
          .then((res) => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.getListTaskContact()
            this.taskDetail()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    },
    callContentClose(val) {
      this.callContentOpen = val
      this.getListTaskContact()
    },
    concernShowList(concern) {
      const data = {
        callTaskId: this.selectedTask.id,
        concern: concern
      }
      selectCallHistoryForConcern(data)
        .then(res => {
          this.concernCallList = res.data.result
        })
    },
    offServer() {
      this.$confirm('您确定要暂停此项任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            callTaskId: this.selectedTask.id
          }
          stopAiCallTask(data).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.taskDetail()
            this.selectTaskDetail()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消暂停'
          })
        })
    },
    startServer() {
      this.$confirm('您确定要开始此项任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            callTaskId: this.selectedTask.id
          }
          startAiCallTask(data).then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.taskDetail()
            this.selectTaskDetail()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    callExport() {
      const data = {
        callTaskId: this.selectedTask.id,
        customerIntentList: this.checkedIntentStateList
      }
      downLoadCallTaskHistory(data)
        .then(res => {
          this.checkedIntentStateList = []
          window.location.href = res.data.result
        })
    },
    myRequest(content) {
      const file = content.file
      const isLt2M = file.size / 1024 / 1024 < 20
      const param = new FormData() // 创建form对象
      param.append('excelFile', file) // 通过append向form对象添加数据
      param.append('callTaskId', this.selectedTask.id) // 通过append向form对象添加数据
      if (file.name.indexOf('.xls') === -1) {
        this.$message.error('上传文件格式错误!!!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 20MB!')
        return false
      }
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      } // 添加请求头
      axios.post(`${process.env.BASE_API}/callTask/importCallTaskCustomer`, param, config)
        .then((res) => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.getTaskContact(1)
        })
    },
    uploadExcel() {
      this.unexport = false
      this.$refs.upload.submit()
      this.$refs.upload.clearFiles()
    },
    clearFile() {
      this.$refs.upload.clearFiles()
    },
    exportClose() {
      this.unexport = false
      this.$refs.upload.clearFiles()
    },
    addTask() {
      this.taskDialog = true
      this.isEditTask = false
      this.ruleForm.taskName = ''
      this.ruleForm.processId = ''
      this.ruleForm.phoneId = ''
      this.ruleForm.description = ''
      this.ruleForm.launchDate = ''
    },
    editTask() {
      this.taskDialog = true
      this.selectTaskDetail()
    },
    selectTaskDetail() {
      const data = {
        callTaskId: this.selectedTask.id
      }
      selectTaskDetail(data)
        .then(res => {
          this.isEditTask = true
          this.selectedTask = res.data.result
          const info = res.data.result
          if (!info.suspendStart) {
            info.suspendStart = ''
            info.suspendEnd = ''
          }
          this.ruleForm = {
            startTime: [info.dailyStart, info.dailyEnd],
            limitTime: [info.suspendStart, info.suspendEnd],
            wechatPush: info.pushIntent,
            taskName: info.taskName,
            style: info.launchType === 2 ? '定时启动' : '手动启动',
            processId: info.processId,
            launchDate: info.launchDate,
            phoneId: info.phoneId,
            description: info.description
          }
        })
        .catch(() => {
        })
    },
    insertTask() {
      const data = {
        taskName: this.ruleForm.taskName,
        processId: this.ruleForm.processId,
        phoneId: this.ruleForm.phoneId,
        description: this.ruleForm.description,
        dailyStart: this.ruleForm.startTime[0],
        dailyEnd: this.ruleForm.startTime[1],
        suspendStart: this.ruleForm.limitTime[0],
        suspendEnd: this.ruleForm.limitTime[1],
        pushIntent: this.ruleForm.wechatPush.join(','),
        launchType: this.ruleForm.style === '手动启动' ? 1 : 2,
        launchDate: this.ruleForm.launchDate || ''
      }
      if (this.ruleForm.style === '手动启动') {
        delete data.launchDate
      }
      addTask(data)
        .then(res => {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.getCallTaskList()
          this.taskDialog = false
        })
    },
    updateTask() {
      if (this.ruleForm.limitTime == null) {
        this.ruleForm.limitTime = ['', '']
      }
      const data = {
        taskName: this.ruleForm.taskName,
        processId: this.ruleForm.processId,
        phoneId: this.ruleForm.phoneId,
        description: this.ruleForm.description,
        dailyStart: this.ruleForm.startTime[0],
        dailyEnd: this.ruleForm.startTime[1],
        suspendStart: this.ruleForm.limitTime[0],
        suspendEnd: this.ruleForm.limitTime[1],
        pushIntent: this.ruleForm.wechatPush.join(','),
        id: this.selectedTask.id,
        launchType: this.ruleForm.style === '手动启动' ? 1 : 2
      }
      if (this.ruleForm.style === '手动启动') {
        delete data.launchDate
      } else {
        if (this.selectedTask.launchDate === this.ruleForm.launchDate) {
          data.launchDate = this.ruleForm.launchDate.replace(/-/g, '/')
        } else {
          data.launchDate = this.ruleForm.launchDate
        }
      }
      updateTask(data)
        .then(res => {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.taskDialog = false
          this.getCallTaskList()
          this.selectTaskDetail()
        })
        .catch(() => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEditTask) {
            this.updateTask()
          } else {
            this.insertTask()
          }
        } else {
          return false
        }
      })
    },
    showList() {
      this.listWrap = true
    },
    closeListWrap() {
      this.listWrap = false
    },
    getCallTaskList() {
      const data = {}
      CallTaskList(data)
        .then(res => {
          this.taskList = res.data.result.list
          if (!this.selectedTask.id && this.taskList.length > 0) {
            this.selectedTask = this.taskList[0]
          }
          this.getListTaskContact()
          this.taskDetail()
          this.selectHearingStatistics()
        })
        .catch(() => {
          // console.log('获取任务列表失败')
        })
    },
    changeTask(item) {
      this.selectedTask = item
      this.closeListWrap()
    },
    taskDetail() {
      if (this.selectedTask.id == null) {
        return
      }
      const data = {
        callTaskId: this.selectedTask.id
      }
      selectCallTaskDetailAndRate(data).then(res => {
        this.taskInfo = res.data.result.callTask
        this.callStatusInfo.tempo = res.data.result.tempo
        this.callStatusInfo.callAll = res.data.result.callAll
        this.callStatusInfo.callFinish = res.data.result.callFinish
      })
    },
    selectHearingStatistics() {
      if (this.selectedTask.id == null) {
        return
      }
      const data = {
        callTaskId: this.selectedTask.id
      }
      selectHearingStatistics(data).then(res => {
        this.myStatistics = res.data.result
      })
    },
    getListTaskContact() {
      if (this.selectedTask.id == null) {
        return
      }
      const data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.selectedTask.id,
        searchStatus: 2,
        callLength: this.selectCallLength,
        dialogueAmount: this.selectCallNum,
        contactStatus: this.selectCallState,
        customerIntent: this.selectIntent
      }
      listTaskContact(data).then(res => {
        this.calledTaskContentList = res.data.result.list
        this.total = res.data.result.total
      })
      const data2 = {
        taskId: this.selectedTask.id,
        searchStatus: 1,
        pageNum: this.currentPageGoing,
        pageSize: this.pageSizeGoing
      }
      listTaskContact(data2).then(res => {
        this.callingTaskContentList = res.data.result.list
        this.totalGoing = res.data.result.total
      })
    },
    sizeChange(val) {
      this.pageSize = val
      this.getListTaskContact()
    },
    currentChange(val) {
      this.currentPage = val
      this.getListTaskContact()
    },
    sizeChangeGoing(val) {
      this.pageSizeGoing = val
      this.getListTaskContact()
    },
    currentChangeGoing(val) {
      this.currentPageGoing = val
      this.getListTaskContact()
    },
    getListPhoneState() {
      listPhoneState().then(res => {
        this.callStateList = res.data.result
      })
    },
    getListIntentState() {
      listIntentState().then(res => {
        this.intentStateList = res.data.result
      })
    },
    getListCallTime() {
      listCallLength().then(res => {
        this.callLengthList = res.data.result
      })
    },
    getListCallRotation() {
      listDialogueAmount().then(res => {
        this.callNumList = res.data.result
      })
    },
    refreshTask() {
      if (this.selectedTask == null) {
        return
      }
      const id = this.selectedTask.id
      this.selectedTask.id = null
      this.$nextTick(() => {
        this.selectedTask.id = id
        this.getListTaskContact()
        this.taskDetail()
        this.selectHearingStatistics()
        this.getSelectConcernStatistics()
      })
    },
    expandCustomerList() {
      if (this.expandInfo.expanded) {
        this.expandInfo.expanded = false
        this.expandInfo.leftDisplay = 'block'
        this.expandInfo.rightWidth = '40%'
        this.expandInfo.arrowIcon = 'el-icon-d-arrow-left'
      } else {
        this.expandInfo.expanded = true
        this.expandInfo.leftDisplay = 'none'
        this.expandInfo.rightWidth = '100%'
        this.expandInfo.arrowIcon = 'el-icon-d-arrow-right'
      }
    }
  },
  watch: {
    selectedTask() {
      if (this.selectedTask.id != null) {
        this.getListTaskContact()
        this.taskDetail()
        this.selectHearingStatistics()
        this.getSelectConcernStatistics()
      }
    }
  },
  mounted() {
    this.getListPhoneState()
    this.getListIntentState()
    this.getListCallTime()
    this.getListCallRotation()

    this.getCallTaskList()
    this.getListSceneSelect()
    this.getSelectTelephone()
    this.getSelectConcernStatistics()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.call-task {
  height: 100%;
  overflow-y: hidden;
  .task-top {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e6e6e6;
    background-color: #fcfcfc;
    .select-list {
      cursor: pointer;
      width: 285px;
      float: left;
      font-size: 20px;
      font-weight: bold;
      margin-left: 15px;
      i {
        float: right;
        font-size: 20px;
        margin-top: 20px;
        color: #999;
      }
    }
    .select-btn {
      float: right;
      margin-right: 20px;
      & > span {
        font-size: 14px;
        color: #999;
        margin-right: 20px;
      }
    }
    .select-message {
      float: left;
      color: #666;
      margin-left: 10px;
      margin-top: 9px;
      .select-progress{
        display: inline-block;
        width: 300px;
        height: 40px;
        position: relative;
        margin-left: 10px;
        background-color: rgb(229, 233, 242);
        border-radius: 5px;
        span{
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 5px;
          background-color: #67e0e3;
          background-image: -webkit-linear-gradient(top, #67e0e3, #409eff);
          transition: width 1s ease-in-out;
        }
        i{
          position: absolute;
          height: 100%;
          display: inline-block;
          width: 100%;
          line-height: 40px;
          text-align: center;
          color: #fff;
        }
      }
    }
  }
  .list-wrap {
    position: fixed;
    width: 100%;
    height: calc(100% - 70px);
    background-color: rgba(0, 0, 0, 0.5);
    top: 70px;
    left: 0;
    z-index: 6;
    .list {
      width: 300px;
      height: 100%;
      background-color: #fff;
      margin-left: 180px;
      ul {
        height: calc(100% - 160px);
        overflow: auto;
        margin-top: 20px;
      }
      h5 {
        height: 60px;
        line-height: 60px;
        padding-left: 15px;
        font-size: 20px;
        border-bottom: 1px solid #eee;
        i {
          float: right;
          font-size: 20px;
          margin-top: 20px;
          color: #999;
        }
      }
      .new-button {
        border: 1px dashed #999;
        border-radius: 5px;
        margin: 20px 15px 0;
        padding: 20px 0;
        cursor: pointer;
      }
      li {
        line-height: 40px;
        margin: 0 15px;
        border: 1px solid #eee;
        cursor: pointer;
        border-radius: 5px;
        margin-bottom: 20px;
        padding: 10px;
        position: relative;
        h6 {
          font-size: 14px;
          color: #444;
        }
        p {
          overflow: hidden;
          line-height: 20px;
          height: 20px;
          color: #666;
          font-size: 13px;
          &.time {
            margin-top: 10px;
          }
        }
        .status {
          position: absolute;
          right: 10px;
          top: 10px;
        }
        &:hover {
          border-color: #409eff;
        }
        &.active {
          border-color: #409eff;
        }
      }
    }
  }
  .call-dialog {
    & /deep/ .el-dialog__body {
      border-top: 1px solid #dcdfe6;
      padding: 10px;
    }
    & /deep/ .el-input {
      width: 300px !important;
    }
    & /deep/ .el-date-editor--timerange {
      width: 300px !important;
      .el-range-separator {
        width: 10%;
      }
    }
    .upload {
      & > i {
        margin-right: 10px;
      }
      margin-top: 20px;
      .tip {
        color: #999;
        font-size: 12px;
      }
    }
    .downloadT{
      padding: 7px 15px;
      border-radius: 3px;
      border: 1px solid #dcdfe6;
      font-size: 12px;
    }
  }
  .call-task-main {
    padding: 10px;
    width: 60%;
    float: left;
    height: calc(100% - 60px);
    .top {
      width: 100%;
      height: 220px;
      padding: 0.1px;
      .push-intent{
        display: inline-flex;
        & /deep/ .is-checked {
          .el-checkbox__label{
            color: #409eff;
          }
        }
      }
    }
    .center {
      width: 100%;
      height: 30%;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      margin-top: 10px;
    }
    .bottom {
      width: 100%;
      height: calc(70% - 220px);
      padding: 10px 0;
      .el-card{
        height: 100%;
        overflow: inherit;
        & /deep/ .el-card__header{
          padding: 10px 20px;
        }
      }
      .concern-tag{
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 16px;
        cursor: pointer;
        position: relative;
        &:hover{
          .concern-list-table{
            display: block;
          }
        }
      }
      .concern-list-table{
        z-index: 3;
        position: absolute;
        bottom: 32px;
        left: 0;
        display: none;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      }
      .concern-tag-list{
       & /deep/ tbody{
          tr{
            cursor: pointer;
          }
        }
      }
      .concernNum{
        font-weight: bold;
        color: #409eff;
      }
    }
    .call-infor {
      width: 40%;
      height: 100%;
      float: left;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      padding: 15px 0;
      div {
        p {
          float: left;
          height: 28px;
          line-height: 28px;
          color: #666;
          font-size: 14px;
          &:first-child {
            width: 30%;
            text-align: right;
            margin-left: -10px;
          }
          &:last-child {
            width: 60%;
            .el-progress {
              width: 150px;
              display: inline-block;
              margin-right: 10px;
            }
          }
        }
      }
    }
    .call-statistics {
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      width: 59%;
      height: 100%;
      float: right;
      ul {
        height: 150px;
        clear: both;
      }
      li {
        float: left;
        width: 20%;
        height: 50px;
        text-align: center;
        border-top: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
        padding: 7px 0;
        font-size: 13px;
        color: #999;
        p {
          &:first-child {
            color: #f56c6c;
          }
          &:last-child {
            margin-top: 10px;
          }
        }
      }
      div {
        margin-top: 5px;
        p {
          width: 50%;
          height: 115px;
          float: left;
          text-align: center;
          & > span {
            display: block;
          }
        }
      }
    }
  }
  .call-task-list {
    border-left: 1px solid #ddd;
    padding: 10px;
    width: 40%;
    float: right;
    height: calc(100% - 60px);
    .expand-table-slider{
      width: 16px;
      position: absolute;
      top: 50%;
      display: inline-block;
      z-index: 3;
      height: 60px;
      border: solid 1px #dcdfe6;
      padding-top: 20px;
      border-radius: 0 8px 8px 0;
      cursor: pointer;
      background-color: #f5f7fa;
    }
    .el-tabs{
      height: 100%;
      & /deep/ .el-tabs__content{
        height: calc(100% - 40px);
        .el-tab-pane{
          height: 100%;
        }
        .task-table{
          height: calc(100% - 100px);
        }
      }
    }
    .page {
      text-align: center;
      margin-top: 15px;
    }
    .filter-list {
      .el-select {
        margin-bottom: 10px;
        width: 24%;
      }
    }
  }
  .export-intent-checkbox {
    width: 120px;
    margin-left: 0;
  }
}
</style>
