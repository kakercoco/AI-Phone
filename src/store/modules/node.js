const node = {
  state: {
    sceneId: '', // 场景id
    sceneNodeId: '', // 场景节点id
    sceneNodeProcessorList: [], // 当前节点列表详细
    open: false, // 侧边栏编辑
    nodeList: [], // 处理过后的node列表
    openType: 1, // 打开的话术类型，1 为普通话术，2为跳转话术
    nodeTransfer: {}, // 编辑中的中转node块
    nodeTransferIndex: null, // 编辑中的中转node块的下标
    sortList: [] // 话术下的分类列表
  },
  mutations: {
    SET_SCENEID: (state, sceneId) => {
      state.sceneNodeId = sceneId
    },
    SET_SCENENODEID: (state, sceneNodeId) => {
      state.sceneId = sceneNodeId
    },
    SET_SCENENODEPROCESSORLIST: (state, sceneNodeProcessorList) => {
      state.sceneNodeProcessorList = sceneNodeProcessorList
    }
  }
}
export default node
