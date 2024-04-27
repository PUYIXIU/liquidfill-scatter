<template>
  <div :id="domId" class="axis-chart"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import {onMounted} from "vue";
const props = defineProps(['domId','grid'])

let chart
let option
function initChart(){
  chart = echarts.init(document.getElementById(props.domId))
  option = {
    grid:{
      ...props.grid
    },
    xAxis:[{
      type:'value',
      min:0,
      max:44,
      interval:2,
    }],
    yAxis:[{
      type:'value',
      min:0,
      max:28,
      interval:2,
    }]
  }
  chart.setOption(option)
}

// 将气泡在坐标系中对应的坐标转换为dom容器下的坐标
function convertAxisToPixel(data){
  return data.map(node=>{
    node.center = chart.convertToPixel(
        {xAxisIndex:0, yAxisIndex:0},
        [node.xValue, node.yValue]
    )
    return node
  })
}

defineExpose({convertAxisToPixel})

onMounted(()=>{
  initChart()
})
</script>

<style scoped lang="scss">
.axis-chart{
  position:absolute;
  top:0;
  left:0;
  width: 100%;
  height:100%;
}
</style>
