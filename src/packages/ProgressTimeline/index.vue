<script setup>
import {MockProgressTimelineData} from "./mock/progressTimelineData.js";
import {onMounted, ref} from "vue";
import 'moment/dist/locale/zh-cn.js'
import  'dayjs/locale/zh-cn.js'

import * as vis from "vis-timeline";
import VisData from 'vis-data/dist/esm.js'
import dayjs from "dayjs";
const domId = ref('progress-timeline')

const groupData = new VisData.DataSet()
const itemData = new VisData.DataSet()

let counter = 0
const progressGroupClassName = 'progress-group' // 进度条分组标识
const barGroupClassName = 'bar-group' // 柱状图分组标识
const progressItemClassName = 'progress-item' // 进度条节点标识
const barItemClassName = 'bar-item' // 柱状图节点标识
// 为bar类型的组添加DataSet
function createBarItemData(groupId, params, min, max){

  params.hourList.forEach(day=>{
    let end = dayjs(day[0]).add(1,'day').format('YYYY-MM-DD')
    let height = (day[1] - min)/(max-min)*100
    itemData.add({
      id:counter++,
      className:`${barItemClassName} height-${height}`,
      group:groupId,
      start:day[0],
      end:end,
      content:''
    })
  })
}

// 为progress类型的组添加DataSet
function createProgressItemData(groupId, params){
  let end = dayjs(params.endTime).add(1,'day').format('YYYY-MM-DD')

  itemData.add({
    id:counter++,
    className:`${progressItemClassName}  task-${params.id}`,
    group:groupId,
    start:params.startTime,
    end:end,
    content:""
  })
}

// 设置bar类型的样式
function setBarStyle(){
  const nodes = document.querySelectorAll(`.${barItemClassName}`)
  for(let i =0; i<nodes.length;i++){
    let node = nodes[i]
    let height =Number(
        Array.from(node.classList).
        find(i=>/height/.test(i)).
        split('-')[1]
    )
    node.style.height = `${height}%`
  }

  // const groups = document.querySelectorAll(`.vis-foreground .vis-group.${barGroupClassName}`)
  // for(let i =0; i<groups.length;i++){
  //   let group = groups[i]
  //
  //   // 获取最后一个子元素的偏移量
  //   const lastNode = group.children[group.children.length-1]
  //
  //
  //   let x = Number(lastNode.style.transform.match(/\d+(\.\d+)*/)[0])
  //
  //   let info = Array.from(group.classList).find(i=>/person/.test(i)).split('-')
  //   let name = info[1]
  //   let hour = info[2]
  //   let label = group.querySelector('.label') || getDiv('group-label')
  //   label.style.transform = `translateX(${x+20}px)`
  //
  //   console.log(x+50,label.style.transform)
  //   label.innerHTML = `${name} ${hour}<span>h</span>`
  //   group.append(label)
  // }
}

function getDiv(className){
  const dom =  document.createElement('div')
  dom.className = className
  return dom
}

// 获取进度条Dom
function getProgressDom(param){
  let progressWrapper = getDiv('progress-wrapper')
  let label = getDiv('label')
  let backProgress =  getDiv('back-progress')
  let backRow1 =  getDiv('back-row-1')
  let backRow2 =  getDiv('back-row-2')
  let foreProgress =  getDiv('fore-progress')
  let foreRow1 =  getDiv('fore-row-1')
  let foreRow2 =  getDiv('fore-row-2')
  // let foreCell1 =  getDiv('fore-cell fore-cell-1')
  // let foreCell2 =  getDiv('fore-cell fore-cell-2')
  backProgress.append(backRow1, backRow2) // 进度基底
  foreProgress.append(foreRow1,foreRow2) // 进度前景
  label.innerHTML = `${param.progress} <span>%</span>`
  progressWrapper.append(backProgress, foreProgress,label) // 整个进度容器


  foreProgress.style.width = `${param.progress}%` // 实际进度百分比
  param.children.forEach(person=>{
    let foreCell = getDiv('fore-cell')
    foreRow2.append(foreCell)
    foreCell.style.width = `${person.percent}%` // 工时占比
  })

  return progressWrapper
}

// 设置progress类型的样式
function setProgressStyle(){
  // const bars = document.querySelectorAll('.task-bar .vis-item-content')
  // for(let i =0; i<bars.length;i++){
  //   let bar = bars[i]
  // }
  const nodes = document.querySelectorAll(`.${progressItemClassName}`)
  for(let i =0; i<nodes.length;i++){
    let node = nodes[i]
    let id =Array.from(node.classList).
        find(i=>/task/.test(i)).
        split('-')[1]
    let data = MockProgressTimelineData.find(i=>i.id == id) // 找到对应数据
    const nodeContent = node.querySelector('.vis-item-content')
    const content = getProgressDom(data)
    nodeContent.innerHTML = ''
    nodeContent.append(content)

  }
}

// 初始化时间轴表格
function init(){
  const targetDom = document.getElementById(domId.value)
  MockProgressTimelineData.forEach(task=>{
    // 添加总进度条
    const groupOption = {
      id:counter++,
      className:`${progressGroupClassName}`,
      content:task.taskName,
    }
    groupData.add(groupOption)
    createProgressItemData(groupOption.id, task)

    // 获取所有人员中最大单日工时，最小单日工时
    let allHourData = task.children.map(i=>i.hourList.map(o=>o[1])).flat().sort()
    let maxHour = allHourData[allHourData.length-1]
    let minHour = allHourData[0]
    // 添加参与人员柱状图
    task.children.forEach(person=>{
      const groupOption = {
        id:counter++,
        className:`${barGroupClassName} person-${person.name}-${person.totalHour}`,
        content:``,
      }
      groupData.add(groupOption)
      createBarItemData(groupOption.id, person, minHour, maxHour)
    })
  })
  let options = {
    stack: false, // 堆叠
    onInitialDrawComplete:()=>{  // 绘制结束的回调
      setProgressStyle()
      setBarStyle()
    },
    autoResize:true, // 自动缩放
    // locales:dayjs.locale('zh-cn'),
    locale:'zh-cn',
    // format:{
    //   majorLabels: {
    //     millisecond:'HH:mm:ss',
    //     second:     'D MMMM HH:mm',
    //     minute:     'ddd D MMMM',
    //     hour:       'ddd D MMMM',
    //     weekday:    'MMMM YYYY',
    //     day:        'MMMM YYYY',
    //     week:       'MMMM YYYY',
    //     month:      'YYYY',
    //     year:       '12'
    //   }
    // }, // 格式化
    selectable:false, // 节点可选

    zoomMax:1000 * 60 * 60 * 24 * 365, // 最大缩放单位
    zoomMin:1000 * 60 * 60 * 24 * 31, // 最小缩放单位
    timeAxis:{
      scale:'month', // 固定缩放单位月
    },
    zoomKey: "ctrlKey",
    maxHeight: targetDom.height,
    start: dayjs().startOf('year').format('YYYY-MM-DD'), // 开始
    min:dayjs().startOf('year').format('YYYY-MM-DD'), // 最小时间
    end: dayjs().endOf('year').month(5).format('YYYY-MM-DD'), // 结束
    max: dayjs().endOf('year').format('YYYY-MM-DD'), // 最大时间

    height:500,
    margin: {
      item: 10, // minimal margin between items
      axis: 50, // minimal margin between items and the axis
    },
    orientation: "top",
  }
  console.log(dayjs().month(0).day(0).format('YYYY-MM-DD'))
  const timeline = new vis.Timeline(targetDom, itemData, groupData, options)

}

onMounted(()=>{
  init()
})
</script>

<template>
  <div :id="domId" class="chart-wrapper"></div>
</template>

<style scoped lang="scss">
.chart-wrapper{
  padding-top:30px;
  width:912px;
  height:392px;
  background-color: white;
}

// 表头
::v-deep(.vis-label){
  border-bottom: none;
}

// 表组
::v-deep(.vis-group){
  border-bottom: none ;

  &.bar-group{
    .group-label{
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      word-spacing: 5px;
      span{
        font-size: 10px;
      }
    }
  }
}

// 节点
::v-deep(.vis-item){
  border-width:0px;
  border-radius: 0px;
  &.bar-item{
    top:initial !important;
    bottom:0px;
    background: linear-gradient( 180deg, #FB9B61 0%, #FFE3D1 100%);
  }
  // 进度条
  &.progress-item{
    top:5px !important;
    bottom:5px;
    background-color: transparent;
    .vis-item-overflow{
      overflow: visible !important;
    }
    .vis-item-content{
      width:100%;
      height:100%;
      padding:0px;
      .progress-wrapper{
        width: 100%;
        height:100%;
        .label{
          font-size: 14px;
          position:absolute;
          right:-10px;
          top:50%;
          transform: translateX(100%) translateY(-50%);
          span{
            font-size: 10px;
          }
        }
        .back-progress{
          z-index:0;
          position: absolute;
          top:0;
          left:0;
          width: 100%;
          height:100%;
          .back-row-1{
            width: 100%;
            height:70%;
            background-color: #F16A6A33;
          }
          .back-row-2{
            width: 100%;
            height:30%;
            background-color: #F16A6A66;
          }
        }
        .fore-progress{
          z-index:1;
          position: absolute;
          top:0;
          left:0;
          height:100%;
          border-top:2px solid #ffffff66;
          border-right:2px solid #ffffff66;
          box-sizing: border-box;
          border-image-source: linear-gradient(to right,#F16A6A, #ffffff66 50%);
          border-image-slice: 1;

          .fore-row-1{
            width: 100%;
            height:70%;
            background-color: #F16A6A;
          }
          .fore-row-2{
            width: 100%;
            height:30%;
            display: flex;

            .fore-cell{
              height:100%;
              background-color: #D82B39;
              &:nth-child(2n){
                background-color: #FB9B61;
              }
            }
          }
        }
      }
    }
  }
}

// 主标题
::v-deep(.vis-major){
  width: 100%;
  padding:0px;
  height:calc(21px + 8px);
  div{
    background-color: #e4e4e4;
    text-align: center;

  }
}
</style>
