/*
 * @Author: kaker.xutianxing 
 * @Date: 2018-05-09 15:26:21 
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-05-23 15:43:18
 */
<template>
    <div class="list_state">
        <span v-for="(val,i) in option" :key="i" :style="{
      background:val.background ? val.background : 'transparent',
      borderColor:val.color ? val.color : '#333',
      color:val.color ? val.color : '#333',
    }" v-if="val.value == state">{{val.label}}</span>
    </div>
</template>

<script>
// 默认配置：
/*
   [
   {value:'1',label:'已驳回',color:'#fb4c4c'},
   {value:'2',label:'审核中',color:'#4c89fc'},
   {value:'3',label:'审核通过',color:'#5ae389'},
   {value:'4',label:'已投放',color:'#9092a5'}
   ]
   value:传入的状态值，必须字符串
   label：状态的文字
   color：文字颜色，可不传
   background：背景颜色，可不传
  * */

/*
  * <my-state :state="scope.row.state" :option="[
   {value:'1',label:'已驳回',color:'#fb4c4c'},
   {value:'2',label:'审核中',color:'#4c89fc'},
   {value:'3',label:'审核通过',color:'#5ae389'},
   {value:'4',label:'已投放',color:'#9092a5'}
   ]"></my-state>
  * */
export default {
  name: 'module_state',
  props: {
    state: {
      type: Number,
      default: 1
    },
    option: {
      type: Array,
      default: function() {
        return [
          {
            value: '1',
            label: '已终止',
            background: '#fef0f0',
            color: 'rgb(247, 141, 141)'
          },
          {
            value: '2',
            label: '进行中',
            background: '#eef3ff',
            color: 'rgb(85, 132, 255)'
          },
          {
            value: '3',
            label: '已完成',
            background: '#f0fae6',
            color: 'rgb(102, 204, 0)'
          }
        ]
      }
    }
  },
  data() {
    return {}
  },
  components: {},
  computed: {},
  watch: {},
  methods: {},

  mounted() {}
}
</script>

<style scoped>
.list_state span {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid;
  display: inline-block;
  height: 25px;
  line-height: 15px;
}
</style>
