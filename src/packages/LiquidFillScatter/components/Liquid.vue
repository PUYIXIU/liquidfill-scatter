<script setup>
import {onMounted, nextTick} from "vue";
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const props = defineProps(["data","domId"])

const ColorList = [

  // hsl
  { // 深蓝 0
    color:[244.94, 100, 50],
    h_add:10,
    s_add:0,
    l_add:-10,

  },
  { // 紫色 1
    color:[266.35, 100, 40],
    h_add:0,
    s_add:0,
    l_add:-20
  },
  { //黄色 2
    color:[43.29, 100, 50],
    h_add:0,
    s_add:0,
    l_add:-0
  },
  { // 靛青 3
    color:[169.91, 100, 50],
    h_add:0,
    s_add:0,
    l_add:-15
  },
  { // 红色 4
    color:[354.82, 100, 50],
    h_add:0,
    s_add:0,
    l_add:-5
  },
]

let chart
let option = {
  /** tooltip */
  tooltip:{
    show: false,
    trigger:'item'
  },
  series: []
}

const SeriesOptionTemp = {
  type:'liquidFill',
  data: [0],
  // 整体定位
  center:['50%','50%'], // 中心
  radius:'17%', // 半径
  // 波浪颜色、透明度
  // color:['#6459F4'],
  itemStyle:{
    color:'rgba(52,38,246,0.75)',
    opacity:0.2,
    // shadowBlur:30,
    // shadowColor:'#000'
  },
  emphasis:{
    disabled:true,
    itemStyle:{
      opacity:0.2
    },
  },

  /** 水波动画相关 */
  // waveAnimation:false, // 是否开启波浪动画
  amplitude:5, // 水波曲度
  direction:'right', // 水波方向
  // waveLength:'30%', // 频率
  phase: 0,
  // period: (value, index)=>2000 * index + 1000, // 周期


  /** 背景颜色相关 */
  backgroundStyle:{
    // borderWidth:10,
    // borderColor:'red',
    shadowColor:'rgba(99,88,245,0.7)',
    shadowBlur:40,
    shadowOffsetX:-20,
    shadowOffsetY:40,
    color:'rgba(99,88,245,0.3)',
  },

  /** 外边框 */
  outline:{
    show:false,
    // borderDistance:0,
    // itemStyle:{
    //   borderWidth:10,
    //   borderColor:'#00000000',
    //   shadowColor:'rgba(99,88,245)',
    //   shadowBlur:20,
    // }
  },

  /** 形状 */
  shape:'circle',

  /** 子表 */
  label:{
    position:['50%','50%'],
    formatter:null,
    rich:{
      title:{
        color:'#fff',
        fontSize:12,
        fontWeight:'bold',
        textShadowColor:'rgba(0,0,0,0.75)',
        textShadowBlur:3,
        textShadowOffsetY:1,
        lineHeight:18
      },
      subtitle:{
        color:'#fff',
        fontSize:10,
        textShadowColor:'rgba(0,0,0,0.5)',
        textShadowBlur:5,
        textShadowOffsetY:2,
        lineHeight:18
      },
      percent:{
        color:'#fff',
        fontSize:8,
        textShadowColor:'rgba(0,0,0,0.5)',
        textShadowBlur:5,
        textShadowOffsetY:2,
      }
    }
  },

  /** 动画 */
  animationDuration: 0,
  animationDurationUpdate: 1000,
  animationEasingUpdate: 'cubicOut',
}

function formatter(){
  return `{title|3585h}\n{subtitle|企业员工工时管理平台}\n{subtitle|75}{percent|%}`
}

function initChart(){
  // center
  const targetDom = document.getElementById(props.domId)
  chart = echarts.init(targetDom,'shine')
  getOption()
  chart.setOption(option)
}


function getOption(){
  option.series = []
  props.data.forEach((node,index)=>{
      let seriesOption = JSON.parse(JSON.stringify(SeriesOptionTemp))
      seriesOption.label.formatter = formatter
      /** 计算坐标位置 */
      seriesOption.center = node.center

      /** 计算半径 */
      // 半径范围 15%-45% 为0不展示
      const maxR = 50, minR = 10
      seriesOption.radius = `${(maxR - minR)*node.sizeValue + minR}%`

      /** 计算字体 */
      // 标题字体范围：30-12
      // 副标题字体范围：22-10
      // 百分号字体范围： 12-8
      // lineHeight范围 40-18
      const maxT = 30, minT = 12
      const maxS = 22, minS = 8
      const maxP = 12, minP = 8
      const maxL = 40, minL = 18
      seriesOption.label.rich.title.fontSize = (maxT - minT)*node.sizeValue + minT
      seriesOption.label.rich.subtitle.fontSize = (maxS - minS)*node.sizeValue + minS
      seriesOption.label.rich.percent.fontSize = (maxP - minP)*node.sizeValue + minP

      seriesOption.label.rich.title.lineHeight = (maxL - minL)*node.sizeValue + minL
      seriesOption.label.rich.subtitle.lineHeight = (maxL - minL)*node.sizeValue + minL

      /** 水波进度 */
      seriesOption.data = [node.waveValue]

      /** 波浪颜色 */
      const {color,h_add,s_add,l_add} = ColorList[node.type]
      seriesOption.itemStyle.color = getHLS(color, 100,{h_add,s_add,l_add})
      seriesOption.backgroundStyle.shadowColor = getHLS(color, 80)
      seriesOption.backgroundStyle.color = getHLS(color, 20)

      const baseOption = JSON.parse(JSON.stringify(seriesOption))

    baseOption.backgroundStyle.shadowColor =  getHLS(color, 80)
      baseOption.backgroundStyle.shadowOffsetX = 0
      baseOption.backgroundStyle.shadowOffsetY = 0
      baseOption.backgroundStyle.shadowBlur = 10
      baseOption.label = {show:false}
      baseOption.data = [node.waveValue]

      seriesOption.z = index
      baseOption.z = index
      option.series.push(baseOption)
      option.series.push(seriesOption)
  })
}

function getHLS([h,s,l],a,option={
  h_add:0,
  s_add:0,
  l_add:0
}){
  const h_add = option.h_add || 0
  const s_add = option.s_add || 0
  const l_add = option.l_add || 0
  return `hsl(${h+h_add}deg ${s+s_add}% ${l+l_add}% / ${a}%)`
}

defineExpose({
  initChart
})

</script>

<template>
  <div :id="props.domId" class="liquid-chart"></div>
</template>

<style scoped lang="scss">
.liquid-chart{
  position:absolute;
  top:0;
  left:0;
  width: 100%;
  height:100%;
}
</style>
