<template>
  <div class="home">
      <div class="home-top" >
        <p class="select-list" @click="showList">{{selectedScene.sceneName}}<i class="el-icon-caret-bottom"></i></p>
        <div class="select-message">
          <el-tag type="success">{{selectedScene.status}}</el-tag>
        </div>
        <p class="select-btn">
          <span>更新时间：{{selectedScene.modifyAt}}</span>
          <el-button size="small" type="primary" @click="copyTalk(selectedScene)" >复制话术</el-button>
          <el-button size="small" type="primary" @click="editTalk(selectedScene)" v-if="!hasPerm('aiConfig:updateScene')">编辑</el-button>
          <el-button size="small" type="primary" @click.native="getPutOut(selectedScene.id)" v-if="!hasPerm('aiConfig:publishScene')">发布</el-button>
        </p>
      </div>
      <el-dialog title="设置话术" :visible.sync="dialogVisible" width="500px" :before-close="handleClose" class="call-dialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
          <el-form-item label="话术名称：" prop="sceneName">
            <el-input v-model="ruleForm.sceneName" placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="sceneDescription">
            <el-input v-model="ruleForm.sceneDescription" type="textarea" :rows="5" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="发布话术" :visible.sync="putOut" width="500px" :before-close="putOutClose" >
        <el-row class="put-out">
          <el-col :span="8">
            <span>更新时间：</span>
          </el-col>
          <el-col :span="16">
            <span>{{putOutDetail.modifyAt}}</span>
          </el-col>
          <el-col :span="8">
            <span>更新人：</span>
          </el-col>
          <el-col :span="16">
            <span>{{putOutDetail.modifyBy}}</span>
          </el-col>
          <el-col :span="8">
            <span>录音进度：</span>
          </el-col>
          <el-col :span="16">
            <el-progress :percentage="putOutProgress" :stroke-width="10" :show-text="false"></el-progress>
            <span style="color:#409EFF">进度{{putOutDetail.completeCount}}/{{putOutDetail.totalCount}}</span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="putOut = false">取 消</el-button>
          <el-button type="primary" @click="putOutTalk">发 布</el-button>
        </span>
      </el-dialog>
      <div class="list-wrap" v-show="listWrap" @click.self="closeListWrap">
        <transition name="slideDown" >
          <div class="list" v-show="listWrap" :class="{ 'ml-36' : !sliderOpen }">
            <h5 @click.self="closeListWrap">{{selectedScene.sceneName}} <i class="el-icon-caret-bottom"></i></h5>
            <p class="tac new-button"  @click="addTalk" :disabled="hasPerm('aiConfig:insertScene')"><i class="el-icon-plus"></i> 新建AI话术</p>
            <ul>
              <li v-for="(item, index) in listScene" :key="index" @click="changeScene(item)" :class="{active:selectedScene.id === item.id}">
                <h6><i class="el-icon-star-off"></i> {{item.sceneName}}</h6>
                <p>描述：{{item.sceneDescription}}</p>
                <p class="time">更新时间：{{item.modifyAt}}</p>
                <el-tag type="success" size="mini" class="status">{{item.status}}</el-tag>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane label="AI 话 术" name="first">
          <ai-setting :sceneId='selectedScene.id'></ai-setting>
        </el-tab-pane>
        <el-tab-pane label="知 识 库" name="second">
          <new-repository :sceneId='selectedScene.id'></new-repository>
        </el-tab-pane>
        <el-tab-pane label="问题学习" name="third">
          <learn-more :sceneId='selectedScene.id'></learn-more>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import newRepository from './components/newRepository'
import AiSetting from './components/talk'
import learnMore from './components/learnMore'
import { listScene, listKnowledgeClassify, publishScene, selectSceneStatus, insertScene, updateScene, copyScene } from '@/api/AiConfig'

export default {
  name: 'aiHome',
  components: {
    newRepository, AiSetting, learnMore
  },
  data() {
    return {
      activeName: 'first',
      settingStatus: true,
      listWrap: false,
      pageNum: 1,
      pageSize: 10,
      listScene: [],
      selectedScene: { sceneName: '--', id: '', createAt: '--', modifyAt: '--', status: '--' }, // 选中的话术对象
      putOut: false, // 发布话术状态
      putOutDetail: {}, // 发布话术详细信息
      putOutProgress: null, // 发布话术详细进度条
      dialogVisible: false, // 话术弹框显示状态
      ruleForm: {
        sceneName: '',
        sceneDescription: ''
      },
      rules: {
        sceneName: [
          { required: true, message: '请输入话术名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        sceneDescription: [
          { required: true, message: '请输入描述信息', trigger: 'blur' },
          { max: 100, message: '长度在不超过 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClick(tab, event) {
    },
    handleClose() {
      this.dialogVisible = false
    },
    showList() {
      this.listWrap = true
    },
    closeListWrap() {
      this.listWrap = false
    },
    getListScene() {
      const data = {}
      listScene(data)
        .then(res => {
          this.listScene = res.data.result.list
          if (this.listScene.length > 0) {
            this.selectedScene = this.listScene[0]
          }
        })
    },
    getListKnowledgeClassify() {
      const data = {
        sceneId: this.selectedScene.id
      }
      listKnowledgeClassify(data)
        .then(res => {
          this.$store.state.node.sortList = res.data.result
        })
    },
    changeScene(item) {
      this.selectedScene = item
      this.closeListWrap()
    },
    addTalk() {
      this.dialogVisible = true
      this.isEdit = false
      this.ruleForm.sceneName = ''
      this.ruleForm.sceneDescription = ''
    },
    editTalk(row) {
      this.selectedSceneId = row.id
      this.ruleForm.sceneName = row.sceneName
      this.ruleForm.sceneDescription = row.sceneDescription
      this.dialogVisible = true
      this.isEdit = true
    },
    addInsertScene() {
      const data = {
        sceneName: this.ruleForm.sceneName,
        sceneDescription: this.ruleForm.sceneDescription
      }
      insertScene(data).then(res => {
        this.$message({
          type: 'success',
          message: res.data.message
        })
        this.refreshScene()
      })
    },
    updateScene(id) {
      const data = {
        sceneName: this.ruleForm.sceneName,
        sceneDescription: this.ruleForm.sceneDescription,
        sceneId: this.selectedSceneId
      }
      updateScene(data).then(res => {
        this.$message({
          type: 'success',
          message: res.data.message
        })
        this.refreshScene()
      })
    },
    copyTalk() {
      const data = {
        sceneId: this.selectedScene.id
      }
      this.$confirm('是否确定复制改话术?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        copyScene(data)
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.refreshScene()
          })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false
          if (this.isEdit) {
            this.updateScene()
          } else {
            this.addInsertScene()
          }
        } else {
          return false
        }
      })
    },
    putOutClose() {
      this.putOut = false
    },
    getPutOut(id) {
      this.selectedSceneId = id
      const data = {
        sceneId: this.selectedSceneId
      }
      selectSceneStatus(data)
        .then(res => {
          if (res.data.resultCode === 200) {
            this.putOut = true
            this.putOutDetail = res.data.result
            const num = Math.floor(this.putOutDetail.completeCount / this.putOutDetail.totalCount * 100)
            this.putOutProgress = isNaN(num) ? 0 : num
          }
        })
    },
    putOutTalk(index) {
      const data = {
        sceneId: this.selectedSceneId
      }
      publishScene(data)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.putOut = false
          this.refreshScene()
        })
    },
    refreshScene() {
      const data = {}
      listScene(data)
        .then(res => {
          this.listScene = res.data.result.list
          if (this.listScene != null) {
            for (var sceneIndex in this.listScene) {
              if (this.selectedSceneId == null) {
                this.selectedSceneId = this.listScene[sceneIndex].id
                this.selectedScene = this.listScene[sceneIndex]
                break
              } else if (this.selectedSceneId === this.listScene[sceneIndex].id) {
                this.selectedScene = this.listScene[sceneIndex]
              }
            }
          }
        })
    }
  },
  watch: {
    selectedScene(val) {
      this.activeName = 'first'
      this.getListKnowledgeClassify()
      this.settingStatus = false
      this.$nextTick(() => {
        this.settingStatus = true
      })
    }
  },
  computed: {
    sliderOpen() {
      return this.$store.state.app.sidebar.opened
    }
  },
  mounted() {
    this.getListScene()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
.home{
  // padding: 0 15px;
  height: 100%;
  padding-left: 15px;
  .home-top{
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e6e6e6;
    background-color: #fcfcfc;
    .select-list{
      cursor: pointer;
      width: 285px;
      float: left;
      font-size: 20px;
      font-weight: bold;
      i{
        float: right;
        font-size: 20px;
        margin-top: 20px;
        color: #999;
      }
    }
    .select-btn{
      float: right;
      margin-right: 20px;
      &> span{
        font-size: 14px;
        color: #999;
        margin-right: 20px;
      }
    }
    .select-message{
      float: left;
      color: #666;
      margin-left: 10px;
    }

  }
  .call-dialog {
    & /deep/ .el-dialog__body {
      padding: 10px;
      .el-input{
        width: 300px;
      }
      .el-textarea{
        width: 300px;
      }
    }
  }
  .put-out{
    & /deep/ .el-col{
      height: 40px;
    }
    & /deep/ .el-col-8{
      text-align: right;
    }
    .el-progress {
      width: 140px;
      float: left;
      margin-top: 8px;
      margin-right: 10px;
    }
  }
  & /deep/ .el-tabs__header {
    background-color: #fafafa;
  }
  .list-wrap{
    position: fixed;
    width: 100%;
    height: calc(100% - 70px);
    background-color:rgba(0, 0, 0, 0.5);
    top: 70px;
    left: 0;
    z-index: 6;
    .list{
      width: 300px;
      height: 100%;
      background-color: #fff;
      margin-left: 180px;
      ul{
        height: calc(100% - 160px);
        overflow: auto;
        margin-top: 20px;
      }
      h5{
        height: 60px;
        line-height: 60px;
        padding-left: 15px;
        font-size: 20px;
        border-bottom: 1px solid #eee;
        i{
          float: right;
          font-size: 20px;
          margin-top: 20px;
          color: #999;
        }
      }
      .new-button{
        border: 1px dashed #999;
        border-radius: 5px;
        margin: 20px 15px 0;
        padding: 20px 0;
        cursor: pointer;
      }
      li{
        line-height: 40px;
        margin: 0 15px;
        border: 1px solid #eee;
        cursor: pointer;
        border-radius: 5px;
        margin-bottom: 20px;
        padding: 10px;
        position: relative;
        h6{
          font-size: 14px;
          color: #444;
        }
        p{
          overflow: hidden;
          line-height: 20px;
          height: 20px;
          color: #666;
          font-size: 13px;
          &.time{
            margin-top: 10px;
          }
        }
        .status{
          position: absolute;
          right: 10px;
          top: 10px;
        }
        &:hover{
          border-color: #409EFF;
        }
        &.active{
          border-color: #409EFF;
        }
      }
    }
  }
  .el-tabs {
    height: calc(100% - 60px);
    & /deep/ .el-tabs__content{
      height: calc(100% - 55px);
      .el-tab-pane{
        height: 100%;
        overflow: auto;
      }
    }
  }
}
.ml-36{
  margin-left: 36px !important;
}
</style>
