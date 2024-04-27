<template>
  <div :id="props.domId" class="liquid-pie-chart"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import {onMounted} from "vue";
import {mock_liquidPieData} from "../mock/LiquidPieData";

const props = defineProps(['domId',"color"])

let chart

const liquidColor = props.color.liquid
const PieColor = props.color.pie
console.log(getHLS(liquidColor.color, 100, liquidColor))
let liquidFillSeriesOption = [
  {
    type:'liquidFill',
    data:[0.3],
    center:['50%','50%'],
    radius:'42%',
    outline:{show:false},
    itemStyle:{
      color:getHLS(liquidColor.color,100, liquidColor),
      opacity:0.2,
    },
    amplitude:5, // 水波曲度
    direction:'right', // 水波方向
    phase: 0,
    /** 背景颜色相关 */
    backgroundStyle:{
      shadowColor:getHLS(liquidColor.color,100),
      shadowBlur:40,
      shadowOffsetX:-20,
      shadowOffsetY:40,
      color:getHLS(liquidColor.color,15),
    },
    label:{
      position:['50%','50%'],
      formatter:()=>{
        return `{title|3585h}\n{subtitle|企业员工工时管理平台}\n{subtitle|75}{percent|%}`
      },
      rich:{
        title:{
          color:'#fff',
          fontSize:30,
          fontWeight:'bold',
          textShadowColor:'rgba(0,0,0,0.75)',
          textShadowBlur:3,
          textShadowOffsetY:1,
          lineHeight:40
        },
        subtitle:{
          color:'#fff',
          fontSize:20,
          textShadowColor:'rgba(0,0,0,0.5)',
          textShadowBlur:5,
          textShadowOffsetY:2,
          lineHeight:40
        },
        percent:{
          color:'#fff',
          fontSize:12,
          textShadowColor:'rgba(0,0,0,0.5)',
          textShadowBlur:5,
          textShadowOffsetY:2,
        }
      }
    },
  },
  {
    type:'liquidFill',
    data:[0.3],
    center:['50%','50%'],
    radius:'42%',
    outline:{show:false},
    itemStyle:{
      shadowColor:getHLS(liquidColor.color,100, liquidColor),
      opacity:0.2,
    },
    amplitude:5, // 水波曲度
    direction:'right', // 水波方向
    phase: 0,
    /** 背景颜色相关 */
    backgroundStyle:{
      shadowColor:getHLS(liquidColor.color,80),
      shadowBlur:10,
      shadowOffsetX:0,
      shadowOffsetY:0,
      color:getHLS(liquidColor.color,15),
    },
    label:{show:false}
  }
]
const pieSeriesOptionTemp = {
  type:'pie',
  center:['50%','50%'],
  radius:['50%','65%'],
  startAngle:80,
  data:[{
    name:'张杰',
    radiusValue:120,
    value:50,
  }],
  endAngle:0,
  itemStyle:{
    color:{
      type: 'linear',
      x: 0, y: 0,
      x2: 1, y2: 1,
      colorStops: [{
        offset: 0, color: '#7703bf' // 外圈颜色
      }, {
        offset: 1, color: '#7703bf33' // 内圈颜色
      }],
    }
  },
  label:{
    position:'inner',
    rotate:'tangential',
    color:'#fff',
    formatter:(param)=>`{num|120}{unit|h} {name|${param.name}}`,
    rich:{
      num:{},
      unit:{},
      name:{}
    }
  },
  labelLine:{
    show:false
  },
  labelLayout:{

  }
}
let pieSeriesOption = []

let option = {
  series:[]
}
function initChart(){
  const chartDom = document.getElementById(props.domId)
  chartDom && (chart = echarts.init(chartDom))
  getOption()
  chart.setOption(option)
}
function getOption(){
  pieSeriesOption = []
  const gap = 3 // 角度间隔
  const r_gap = 2 // 边缘间隔
  const r_width = 4 // 边沿宽度
  const pieNum = mock_liquidPieData.length // 弧形个数
  const start = 80  // 开始角度
  const angle = 360 / pieNum - gap // 一个弧形的弧度
  const minR = 55, maxR = 100 // 半径范围
  mock_liquidPieData.forEach((node,index)=>{
    let temp = [0,1].includes(index)?(index+1):index
    const i = (temp+1)%PieColor.length
    const color = PieColor[i]

    const pieOption = JSON.parse(JSON.stringify(pieSeriesOptionTemp))

    /** 计算label */
    pieOption.label.formatter = (param)=>`{num|120}{unit|h} {name|${node.name}}`

    /** 计算外半径 */
    const outerRadius = node.radiusValue*(maxR - minR) + minR
    pieOption.radius[1] = `${outerRadius}%`

    /** 计算起始角度 */
    pieOption.startAngle = -index * (angle + gap)
    pieOption.endAngle = -index * (angle + gap) - angle
    let middle = (pieOption.endAngle + pieOption.startAngle)/2

    /** 计算渐变 */
    let x = Math.cos(-middle/180*Math.PI)
    let y = Math.sin(-middle/180*Math.PI)
    pieOption.itemStyle.color.x = x/2+0.5
    pieOption.itemStyle.color.y = y/2+0.5
    pieOption.itemStyle.color.x2 = -x/2+0.5
    pieOption.itemStyle.color.y2 = -y/2+0.5
    // 外圈颜色
    pieOption.itemStyle.color.colorStops[0].color = getHLS(color.color, 100)
    // 内圈颜色
    pieOption.itemStyle.color.colorStops[1].color = getHLS(color.color, 30)
    const borderOption = JSON.parse(JSON.stringify(pieOption))
    borderOption.itemStyle.color = getHLS(color.color, color.alpha)
    console.log(borderOption.itemStyle.color)
    borderOption.radius = [
        `${outerRadius + r_gap}%`,
        `${outerRadius + r_gap + r_width}%`,
    ]
    borderOption.label = {show:false}
    pieSeriesOption.push(borderOption)
    pieSeriesOption.push(pieOption)
  })
  option.series = [
      ...liquidFillSeriesOption,
      ...pieSeriesOption
  ]

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


onMounted(()=>{
  initChart()
})
</script>

<style scoped lang="scss">
.liquid-pie-chart{
  position:absolute;
  top:0;
  left:0;
  width: 100%;
  height:90%;
}
</style>
