/* eslint-disable */
import $ from './jquery-ui'
import store from '@/store/'

var node = store.state.node
var clickTag

class Node {
  constructor(id, knowledge, processorName) {
    this.id = id
    this.knowledge = knowledge
    this.processorName = processorName
    this.acceptBreak = null
    this.concern = null
    this.customerIntent = null
    this.jumpNodeId = null
    this.knowledgeMp3Url = null
    this.knowledgeTtsUrl = null
    this.positionX = null
    this.positionY = null
    this.processorType = null
    this.responseTags = null
    this.smsTemplateId = null
    this.tagsMap = null
  }

  nodeDbclick(index) {
    node.openType = this.processorType
    node.open = true

    var tmp = {}
    copyJson(this, tmp)
    node.nodeTransfer = JSON.parse(JSON.stringify(tmp))
    node.nodeTransferIndex = index
    $('.node-block').removeClass('active')
    $(`#${this.id}`).addClass('active')
  }

  nodeClick(index) {
    $('.node-block').removeClass('active')
    $(`#${this.id}`).addClass('active')
  }

  nodeDrag() {
    var that = this
    $(`#${this.id}`).draggable({
      containment: '#content',
      scroll: true,
      cursor: 'move',
      drag: function (event, ui) {
        if (that.parents != null) {
          for (const tag of that.parents) {
            if (tag.childNodeId != null) {
              drawLine(tag.line)
            }
          }
        }
        for (const tag of that.tagsMap) {
          if (tag.childNodeId != null) {
            drawLine(tag.line)
          }
        }
      },
      stop: function (event, ui) {
        that.positionX = ui.position.top
        that.positionY = ui.position.left
      }
    })
  }

  nodeMouseUp(e) {
    if ((e.target.parentNode.tagName === 'LI' || e.target.tagName === 'LI') && clickTag != null) {
      addLine(clickTag, this)
    }
    clickTag = null
  }

  deleteNode() {
    for (const tag of this.tagsMap) {
      if (tag.line) {
        removeLine(tag.line)
      }
      if (tag.child != null) {
        deleteById(tag.child.parents, tag.id)
      }
    }
    if (this.parents != null) {
      for (const parent of this.parents) {
        if (parent.line) {
          removeLine(parent.line)
        }
        parent.child = null
        parent.childNodeId = null
      }
    }
    deleteById(node.nodeList, this.id)
  }
}

class NodeTag {
  constructor(id, tagName, checked, questions, nodeId, childNodeId) {
    this.id = id
    this.tagName = tagName
    this.checked = checked
    this.questions = questions
    this.nodeId = nodeId
    this.childNodeId = null || childNodeId
  }

  nodeTagMouseDown() {
    clickTag = this
  }
}

function copyJson(src, dst, parentKey) {
  for (const key in src) {
    if (key === 'line' || key === 'child' || key === 'responseTags') {
      continue
    }
    if (src[key] instanceof Array) {
      if (dst[key] == null) {
        dst[key] = []
      }
      copyJson(src[key], dst[key], key)
    } else if (src[key] instanceof Object) {
      if (dst[key] == null) {
        if (parentKey != null && parentKey === 'tagsMap') {
          dst[key] = new NodeTag()
        } else {
          dst[key] = {}
        }
      }
      copyJson(src[key], dst[key], key)
    } else {
      dst[key] = src[key]
    }
  }
}

function copyJsonWithPure(src, dst) {
  for (var key in src) {
    if (key === 'line' || key === 'child') {
      continue
    }
    if (src[key] instanceof Array) {
      dst[key] = []
      copyJsonWithPure(src[key], dst[key])
    } else if (src[key] instanceof Object) {
      if (dst[key] == null) {
        dst[key] = {}
      }
      copyJsonWithPure(src[key], dst[key]);
    } else {
      dst[key] = src[key]
    }
  }
}

function removeLine(line) {
  $(line.cav).remove()
}

function addLine(nodeTag, node, init) {
  if (nodeTag.line != null) {
    //todo 删除线
    removeLine(nodeTag.line)
  }
  if (nodeTag.child != null) {
    deleteById(nodeTag.child.parents, nodeTag.id)
  }
  if (nodeTag.nodeId === node.id) return
  if (!init) {
    nodeTag.childNodeId = node.id
    nodeTag.line = null
  }
  nodeTag.child = node

  if (node.parents == null) {
    node.parents = []
  }
  pushToList(node.parents, nodeTag)
  var line = {}
  line.srcId = nodeTag.id
  line.destId = node.id
  nodeTag.line = line
  var cav = document.createElement('canvas')
  var ctx = cav.getContext('2d')
  line.cav = cav
  line.ctx = ctx
  drawLine(line)
  $('#content').append(line.cav)
}

function drawLine(line) {
  const dst = document.getElementById(line.destId)
  const src = document.getElementById(line.srcId)
  line.ctx.clearRect(0, 0, line.cav.width, line.cav.height)
  var dx = dst.offsetLeft + dst.offsetWidth / 2
  var dy = dst.offsetTop
  var sx =
    src.offsetLeft +
    src.parentElement.offsetLeft +
    src.offsetWidth / 2
  var sy =
    src.offsetTop +
    src.parentElement.offsetTop + 25
  // line.src.offsetWidth / 2
  var w = Math.abs(dx - sx)
  var h = Math.abs(dy - sy)
  $(line.cav).attr('width', w > 20 ? w : 20)
  $(line.cav).attr('height', h > 40 ? h + 30 : 70)
  $(line.cav).css('position', 'absolute')
  $(line.cav).css('left', Math.min(dx, sx))
  $(line.cav).css('top', Math.min(dy, sy) - 15)
  if (dx > sx && dy > sy) {
    line.ctx.moveTo(2, 15)
    line.ctx.lineTo(2, 30)
    if (w < 20) {
      line.ctx.lineTo(4, h - 15)
      line.ctx.lineTo(4, h + 15)
      line.ctx.lineTo(0, h + 8)
      line.ctx.lineTo(4, h + 15)
      line.ctx.lineTo(8, h + 8)
    } else {
      line.ctx.lineTo(w - 5, h)
      line.ctx.lineTo(w - 5, h + 15)
      line.ctx.lineTo(w, h + 8)
      line.ctx.lineTo(w - 5, h + 15)
      line.ctx.lineTo(w - 10, h + 8)
    }
  } else if (dx < sx && dy > sy) {
    if (w < 4) {
      line.ctx.moveTo(2, 15)
      line.ctx.lineTo(2, 30)
    } else {
      line.ctx.moveTo(w - 2, 15)
      line.ctx.lineTo(w - 2, 30)
    }
    line.ctx.lineTo(5, h)
    line.ctx.lineTo(5, h + 15)
    line.ctx.lineTo(0, h + 8)
    line.ctx.lineTo(5, h + 15)
    line.ctx.lineTo(10, h + 8)
  } else if (dx > sx && dy < sy) {
    line.ctx.moveTo(2, h + 15)
    line.ctx.lineTo(2, h + 30)
    if (w < 20) {
      line.ctx.lineTo(4, 0)
      line.ctx.lineTo(4, 15)
      line.ctx.lineTo(0, 8)
      line.ctx.lineTo(4, 15)
      line.ctx.lineTo(8, 8)
    } else {
      line.ctx.lineTo(w - 5, 0)
      line.ctx.lineTo(w - 5, 15)
      line.ctx.lineTo(w, 8)
      line.ctx.lineTo(w - 5, 15)
      line.ctx.lineTo(w - 10, 8)
    }
  } else if (dx < sx && dy < sy) {
    line.ctx.moveTo(w - 2, h + 15)
    line.ctx.lineTo(w - 2, h + 30)
    line.ctx.lineTo(5, 0)
    line.ctx.lineTo(5, 15)
    line.ctx.lineTo(0, 8)
    line.ctx.lineTo(5, 15)
    line.ctx.lineTo(10, 8)
  }
  line.ctx.strokeStyle = '#409EFF'
  line.ctx.lineWidth = '2'
  line.ctx.stroke()
}


function selectById(list, id) {
  for (const listElement of list) {
    if (listElement.id === id) {
      return listElement
    }
  }
}

function deleteById(list, id) {
  for (const key in list) {
    if (list[key].id === id) {
      list.splice(key, 1)
      return
    }
  }
}

function pushToList(list, node) {
  for (const listElement of list) {
    if (listElement.id === node.id) {
      return
    }
  }
  list.push(node)
}

function existInList(list, node) {
  for (const listElement of list) {
    if (listElement.id === node.id) {
      return true
    }
  }
  return false
}

export {
  Node,
  NodeTag,
  copyJson,
  copyJsonWithPure,
  deleteById,
  drawLine,
  selectById,
  pushToList,
  addLine
}
