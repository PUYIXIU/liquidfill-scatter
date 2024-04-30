<script setup>
import {MockProgressTimelineData, colorList} from "./mock/progressTimelineData.js";
import {onMounted, ref} from "vue";
import 'moment/dist/locale/zh-cn.js'
import  'dayjs/locale/zh-cn.js'

import * as vis from "vis-timeline";
import VisData from 'vis-data/dist/esm.js'
import dayjs from "dayjs";
const domId = ref('progress-timeline')

const groupData = new VisData.DataSet()
const itemData = new VisData.DataSet()

let renderedList = [] //已经渲染的列表

let counter = 0
const progressGroupClassName = 'progress-group' // 进度条分组标识
const barGroupClassName = 'bar-group' // 柱状图分组标识
const progressItemClassName = 'progress-item' // 进度条节点标识
const barItemClassName = 'bar-item' // 柱状图节点标识
// 为bar类型的组添加DataSet
function createBarItemData(groupId, params, min, max){

  params.hourList.forEach((day,dayIndex)=>{
    let end = dayjs(day[0]).add(1,'day').format('YYYY-MM-DD')
    let height = (day[1] - min)/(max-min)*100 // 找到最大最小工时，计算百分比
    itemData.add({
      id:counter++,
      className:`${barItemClassName} height-${height} id-${groupId}-${params.id}-${dayIndex}`,
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
  const groups = document.querySelectorAll(`.vis-foreground .vis-group.${barGroupClassName}`)
  for(let i =0; i<groups.length;i++){
    let group = groups[i]

    let color = Array.from(group.classList)
        .find(i=>/color/.test(i))
        .split('-')[1]
    group.style.setProperty('--bar-top-color',setOpacity(color,0.9))
    group.style.setProperty('--bar-bottom-color',setOpacity(color,0.1))

    const nodes = group.querySelectorAll(`.${barItemClassName}`)
    if(!nodes.length) break; // 当前元素没渲染出来
    for(let i =0; i<nodes.length;i++){
      let node = nodes[i]
      let id = Array.from(node.classList).
          find(i=>/id-/.test(i))
      if(renderedList.includes(id)){
        // 已经绘制，检测是否是最后一个元素
        if(i<nodes.length-1){ // 不是最后一个元素但有label
          let label = node.querySelector('.label')
          label && label.remove()
        }
        continue;
      }
      renderedList.push(id)
      let height =Number(
          Array.from(node.classList).
          find(i=>/height/.test(i)).
          split('-')[1]
      )
      node.style.height = `${height}%`

      if(i == nodes.length-1){ // 最后一个
        let info = Array.from(group.classList).find(i=>/person/.test(i)).split('-')
        let name = info[1]
        let hour = info[2]
        let label = getDiv('label')

        label.innerHTML = `${name} ${hour}<span>h</span>`
        node.append(label)
      }
    }
  }
}

// 自定义表头样式
function setHeadStyle(){
// 添加任务进度和任务名称字样
  const node = document.querySelector('.vis-timeline')
  const headWrapper = getDiv('head-wrapper')
  const headTitle = getDiv('head-title')
  const headText = getDiv('head-text')
  headText.innerHTML = '任务名称'
  headWrapper.append(headTitle)
  headTitle.append(headText)
  node.append(headWrapper)
}

function getDiv(className){
  const dom =  document.createElement('div')
  dom.className = className
  return dom
}

function setOpacity(color, opacity){
  return `${color}${Math.ceil(255*opacity).toString(16)}`
}

// 获取进度条Dom
function getProgressDom(param){
  let progressWrapper = getDiv('progress-wrapper')
  let backProgress =  getDiv('back-progress')
  let backRow1 =  getDiv('back-row-1')
  let backRow2 =  getDiv('back-row-2')
  let foreProgress =  getDiv('fore-progress')
  let foreRow1 =  getDiv('fore-row-1')
  let foreRow2 =  getDiv('fore-row-2')
  backProgress.append(backRow1, backRow2) // 进度基底
  foreProgress.append(foreRow1,foreRow2) // 进度前景
  progressWrapper.append(backProgress, foreProgress) // 整个进度容器

  progressWrapper.style.setProperty(
      '--back-row-1-bg',
      setOpacity(param.color.mainColor,0.3)
  )
  progressWrapper.style.setProperty(
      '--back-row-2-bg',
      setOpacity(param.color.mainColor,0.6)
  )
  progressWrapper.style.setProperty(
      '--fore-row-1-bg',
      setOpacity(param.color.mainColor,0.8)
  )
  foreProgress.style.width = `${param.progress}%` // 实际进度百分比
  param.children.forEach(person=>{
    let foreCell = getDiv('fore-cell')
    foreRow2.append(foreCell)
    foreCell.style.width = `${person.percent}%` // 工时占比
    foreCell.style.setProperty(
        '--fore-cell-bg',
        setOpacity(person.color,0.9)
    )
  })

  return progressWrapper
}

// 设置progress类型的样式
function setProgressStyle(){
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

    const label = getDiv('label')
    label.innerHTML = `${data.progress} <span>%</span>`
    node.append(label)
  }
}

// 绑定事件
function addEvent(){
  let content = document.querySelector('.vis-timeline')
  let height = content.style.height; // 原始高度
  content.style.setProperty('--content-height',height)
  content.classList.add('fix-height')
}

// 初始化时间轴表格
function init(){
  const targetDom = document.getElementById(domId.value)
  MockProgressTimelineData.forEach((task,taskIndex)=>{
    // 添加总进度条
    const mainColor = colorList[taskIndex%colorList.length]
    task.color = mainColor
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
    task.children.forEach((person,personIndex)=>{
      const subColor = mainColor.subColor[personIndex % mainColor.subColor.length]
      person.color = subColor
      const groupOption = {
        id:counter++,
        className:`
          ${barGroupClassName}
          person-${person.name}-${person.totalHour}
          color-${person.color}
          `,
        content:``,
      }
      groupData.add(groupOption)
      createBarItemData(groupOption.id, person, minHour, maxHour)
    })
  })
  let options = {
    stack: false, // 堆叠
    onInitialDrawComplete:()=>{  // 绘制结束的回调
      setProgressStyle() // 自定义进度图样式
      setBarStyle() // 自定义柱状图样式
      setHeadStyle() // 自定义表头样式
      addEvent() // 添加事件
    },
    autoResize:true, // 自动缩放
    locale:'zh-cn',
    selectable:false, // 节点可选

    // zoomMax:1000 * 60 * 60 * 24 * 365, // 最大缩放单位
    // zoomMin:1000 * 60 * 60 * 24 * 31, // 最小缩放单位
    timeAxis:{
      scale:'month', // 固定缩放单位月
    },
    // zoomKey: "ctrlKey",
    zoomKey: "shiftKey",
    // height: targetDom.clientHeight,
    start: dayjs().startOf('year').format('YYYY-MM-DD'), // 开始
    min:dayjs().startOf('year').format('YYYY-MM-DD'), // 最小时间
    // end: dayjs().endOf('year').month(5).format('YYYY-MM-DD'), // 结束
    end: dayjs().endOf('year').format('YYYY-MM-DD'), // 结束
    max: dayjs().endOf('year').format('YYYY-MM-DD'), // 最大时间
    snap:null, // 吸附
    margin: {
      item: 10, // minimal margin between items
      axis: 50, // minimal margin between items and the axis
    },
    orientation: "top",
  }
  const timeline = new vis.Timeline(targetDom, itemData, groupData, options)
  // timeline.on('changed',()=>{
  //   // setBarStyle()
  //   let content = document.querySelector('.vis-timeline')
  //   content.style.setProperty('--content-height', '100px')
  //   // content.style.height = contentHeight
  // })
}

onMounted(()=>{
  init()
})
</script>

<template>
  <div :id="domId" class="chart-wrapper"></div>
</template>

<style scoped lang="scss">
$height:392px;
$progress-height:36px; // 进度条高度
.chart-wrapper{
  width:912px;
  height:392px;
  overflow-y: scroll;
  background-color: white;
  &::-webkit-scrollbar{
    width:0px;
  }
}

// 表头
::v-deep(.vis-label){
  border-bottom: none;
  &.progress-group{
    height:$progress-height !important;
    margin-top:1px;
  }
  &.bar-group{
    margin-top:12px;
    height:16px !important;
  }
}

// 表组
::v-deep(.vis-group){
  border-bottom: none ;
  &.progress-group{
    margin-top:1px;
    height:$progress-height !important;
  }
  &.bar-group{
    --bar-top-color:#FB9B61;
    --bar-bottom-color:#FB9B6122;
    height:16px !important;
    margin-top:12px;
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
::v-deep(.vis-item) {
  border-width:0px;
  border-radius: 0px;
  &.bar-item{
    top:initial !important;
    bottom:0px;
    background:
        linear-gradient(
                180deg,
                var(--bar-top-color) 0%,
                var(--bar-bottom-color) 100%);
    .label{
      position:absolute;
      bottom:-3px;
      right:-10px;
      transform:translateX(100%);
      white-space: nowrap;
    }
  }
  // 进度条
  &.progress-item{
    top:5px !important;
    bottom:5px;
    background-color: transparent;
    .label{
      position:absolute;
      top:0;
      right:-10px;
      transform:translateX(100%);
    }
    .vis-item-content{
      width:100%;
      height:80%;
      transform:translateX(0px) !important;
      .progress-wrapper{
        //position:absolute;
        //right:0;
        --back-row-1-bg:#F16A6A33; // 第一行背景色
        --back-row-2-bg:#F16A6A66; // 第二行背景色
        --fore-row-1-bg:#F16A6A; // 第二行背景色
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
            background-color: var(--back-row-1-bg);
          }
          .back-row-2{
            width: 100%;
            height:30%;
            background-color:  var(--back-row-2-bg);
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
          border-image-source:
              linear-gradient(to right,var(--fore-row-1-bg), #ffffff66 50%);
          border-image-slice: 1;

          .fore-row-1{
            width: 100%;
            height:70%;
            background-color:  var(--fore-row-1-bg);
          }
          .fore-row-2{
            width: 100%;
            height:30%;
            display: flex;

            .fore-cell{
              --fore-cell-bg: #D82B39;
              height:100%;
              background-color:  var(--fore-cell-bg);
            }
          }
        }
      }
    }
  }
}


$majar-title-height:30px;
$minor-title-height:26px;
$majar-border-bottom-width:3px;
$majar-margin-bottom:5px;

// 主标题 显示年
::v-deep(.vis-major){
  border-bottom:$majar-border-bottom-width solid #847CF0;
  width: 100%;
  padding:0px;
  height:$majar-title-height;
  z-index:2;
  div{
    height:100%;
    text-align: center;
    line-height:$majar-title-height;
  }
}

//$unit-width:129.994px;
$minor-title-width:61px;
// 副标题 显示月
::v-deep(.vis-text.vis-minor){
  background-color: #ffffff;
  height:$majar-title-height;
  line-height:$minor-title-height;
  //width:$minor-title-width !important;
  overflow: visible ;
  text-align: center;
  padding:0px;
  padding-left:30px;
  display: flex;
  margin-top:calc($majar-margin-bottom + $majar-border-bottom-width);

  &:after{
    content:'123';
    color:transparent;
    display: block;
    width:100%;
    margin-left:30px;
    //width:calc($unit-width - $minor-title-width);
    //transform:translateX($minor-title-width);
    background:linear-gradient(0deg , #EFEEFF 0%, #EFEEFF 40%, transparent 40%, transparent 60%, #EFEEFF 60%, #EFEEFF 100%),
    linear-gradient(
            90deg,
            #EFEEFF 0%, #EFEEFF 25%,
            #C9CADD 25%, #C9CADD 26%, // 1
            #EFEEFF 26%, #EFEEFF 40.5%,
            #C9CADD 40.5%, #C9CADD 41.5%, //2
            #EFEEFF 41.5%, #EFEEFF 59.5%,
            #C9CADD 59.5%, #C9CADD 60.5%,  //3
            #EFEEFF 60.5%, #EFEEFF 75%,
            #C9CADD 75%, #C9CADD 76%, //4
            #EFEEFF 76%, #EFEEFF 100%
    )
  }
}

// 主表体 absolute定位
::v-deep(.vis-center){
  border:none;
  top:calc(
      $majar-title-height +
      $minor-title-height +
      $majar-border-bottom-width +
      $majar-margin-bottom
  ) !important;
  height:calc(100% -
  $majar-title-height -
  $minor-title-height -
  $majar-border-bottom-width -
  $majar-margin-bottom) !important;
}

// 左表体
::v-deep(.vis-left){
  border:none;
  top:calc(
      $majar-title-height +
      $minor-title-height +
      $majar-border-bottom-width +
      $majar-margin-bottom
  ) !important;
  box-shadow:6px 0px 10px rgba(238, 235, 243, 0.16);
}

// 背景
::v-deep(.vis-background){
  &.vis-panel{
    top:calc(
        $minor-title-height +
        $majar-border-bottom-width +
        $majar-margin-bottom
    ) !important;
  }
}
// 表头样式
::v-deep(.vis-top){
  z-index:2;
  box-shadow: 0px 6px 10px rgb(238 235 243 / 60%);
  background: white;
  position:fixed;
  border-left: none;
  height:calc(
      $majar-title-height +
      $minor-title-height +
      $majar-border-bottom-width +
      $majar-margin-bottom
  ) !important;
  .vis-time-axis{
    height:100% !important;
  }
  &.vis-shadow{
    height:1px !important;
  }
}

@mixin heightSet($height){

}

$left-width:154px; // 左侧狼的宽度
::v-deep(.vis-timeline){
  --content-height:0px;
  &.fix-height{
    // 固定高度
    height:var(--content-height) !important;
  }
  .head-wrapper{
    box-shadow: 0px 6px 10px rgb(238 235 243 / 60%);
    position:fixed;
    top:0;
    box-sizing: border-box;
    background: #ffffff;
    width:$left-width;
    height:calc(
        $minor-title-height +
        $majar-border-bottom-width +
        $majar-margin-bottom + $majar-title-height
    );
    .head-title{
      background: #ffffff;
      border-top:$majar-border-bottom-width solid #847CF0;
      margin-top:calc($majar-title-height - $majar-border-bottom-width);
      .head-text{
        background: #ebeafb;
        height:$majar-title-height;
        line-height:$minor-title-height;
        margin-top:$majar-margin-bottom;
        padding-left:45px;
      }
    }
  }
}

::v-deep(.vis-current-time){
  background-color:#847CF0
}

::v-deep(.vis-time-axis .vis-grid.vis-vertical){
  border-left:2px  solid rgba(215, 217, 224, 0.64) !important;
}
</style>
