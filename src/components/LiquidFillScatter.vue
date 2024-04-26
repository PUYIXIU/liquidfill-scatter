<script setup>
import {onMounted} from "vue";
import * as echarts from 'echarts'
import 'echarts-liquidfill'

let chart

function initChart(){
  chart = echarts.init(document.getElementById('chart-dom'))
  const option = {

    /** tooltip */
    tooltip:{
      show: false,
      trigger:'item'
    },
    series: [{
      type:'liquidFill',
      data: [0.3],

      // 整体定位
      center:['50%','50%'], // 中心
      radius:'70%', // 半径

      // 波浪颜色、透明度
      // color:['#6459F4'],
      itemStyle:{
        color:'rgba(52,38,246,0.75)',
        opacity:0.8,
        // shadowBlur:30,
        // shadowColor:'#000'
      },
      emphasis:{
        itemStyle:{
          opacity:1
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
        // shadowColor:'rgba(99,88,245)',
        // shadowBlur:30,
        // shadowOffsetX:-10,
        // shadowOffsetY:10,
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
        formatter:()=>{
          return `{title|3585h}\n{subtitle|企业员工工时管理平台}\n{subtitle|75}{percent|%}`
        },
        rich:{
          title:{
            color:'#fff',
            fontSize:24,
            fontWeight:'bold',
            textShadowColor:'rgba(0,0,0,0.75)',
            textShadowBlur:3,
            textShadowOffsetY:1,
            lineHeight:30
          },
          subtitle:{
            color:'#fff',
            fontSize:18,
            textShadowColor:'rgba(0,0,0,0.5)',
            textShadowBlur:5,
            textShadowOffsetY:2,
            lineHeight:30
          },
          percent:{
            color:'#fff',
            fontSize:10,
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

    }]
  }
  chart.setOption(option)
}

onMounted(()=>{
  initChart()
})

</script>

<template>
  <div id="chart-dom"></div>
</template>

<style scoped>
#chart-dom{
  width:500px;
  height:500px;
}
</style>
