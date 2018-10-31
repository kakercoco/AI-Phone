<template>
  <div :style="{height: height}">
    <div id="myChart1"></div>
    <div id="myChart3"></div>
    <div id="myChart2"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { selectCallDetailOption } from '@/api/callTask'
export default {
  name: 'graph',
  props: {
    callTaskId: {
      type: Number
    },
    height: {
      type: String
    }
  },
  data() {
    return {

    }
  },
  methods: {
    drawCharts(option, dom) {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(dom))
      this.chart.clear()
      // 绘制图表
      this.chart.setOption(
        option
      )
    },
    getSelectCallDetailOption() {
      if (this.callTaskId == null) {
        return false
      }
      const data = {
        callTaskId: this.callTaskId
      }
      selectCallDetailOption(data)
        .then(res => {
          this.drawCharts(res.data.result.callLengthOption, 'myChart1')
          this.drawCharts(res.data.result.customerIntentOption, 'myChart2')
          this.drawCharts(res.data.result.dialogueAmountOption, 'myChart3')
        })
    }
  },
  watch: {
    callTaskId() {
      if (this.callTaskId != null) {
        this.getSelectCallDetailOption()
      }
    }
  },
  mounted() {
    this.getSelectCallDetailOption()
  }
}
</script>

<style  rel='stylesheet/scss' lang='scss' scoped >
#myChart1{
  width: 33.33%;
  height: 100%;
  float: left;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
}
#myChart2{
  width: 33.33%;
  height: 100%;
  float: left;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
}
#myChart3{
  width: 33.33%;
  height: 100%;
  float: left;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
}
</style>
