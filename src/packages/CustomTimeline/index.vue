<script setup>
import * as vis from "vis-timeline";
import visData from 'vis-data/dist/esm.js'
import {onMounted} from "vue";


const itemNumber = 3
const groupNumber = 4
const groups = new visData.DataSet()
const items = new visData.DataSet()
function init(){

  // 创建分组
  for(let i = 0;i<groupNumber;i++){
    groups.add({
      className:'test-group',
      id:i,
      content:`group-${i}`
    })
    if(i%2==1){
      loadItemData(i)
    }else{
      loadProgressData(i)
    }
  }

  let options = {
    stack: false,
    horizontalScroll: true,
    zoomKey: "ctrlKey",
    maxHeight: 400,
    start: new Date(),
    end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
    editable: true,
    // margin: {
    //   item: 10, // minimal margin between items
    //   axis: 5, // minimal margin between items and the axis
    // },
    orientation: "top",
    onInitialDrawComplete:()=>{
      changeHeight()
      addProgress()
    }
  };
  let container = document.getElementById("visualization");
  let timeline = new vis.Timeline(container, items, groups, options);

}

// 添加进度
function addProgress(){
  const bars = document.querySelectorAll('.task-bar .vis-item-content')
  for(let i =0; i<bars.length;i++){
    let bar = bars[i]
  }
}

// 修改高度
function changeHeight(){
  const bars = document.querySelectorAll('.test-bar')
  for(let i =0; i<bars.length;i++){
    let bar = bars[i]
    let height =Number(Array.from(bars[i].classList).find(i=>/height/.test(i)).split('-')[1])
    bar.style.height = `${height+ Math.random()*11}px`
  }
}

function loadItemData(groupId){
  let date = new Date()
  date.setHours(date.getHours() + groupId + 4 * (Math.random() < 0.2));
  let start = new Date(date);
  date.setHours(date.getHours() + groupId + 2 + Math.floor(Math.random() * 4));
  let end = new Date(date);
  let sliceNumber = 10
  let slice = (end-start)/sliceNumber
  // 添加内容物


  // 柱状图
  let count = new Date(start).valueOf();
  let index = 1
  while(count<end){
    items.add({
      className:`test-bar height-${index}`,
      id: index + (sliceNumber+1) * groupId,
      group: groupId,
      start: new Date(count),
      end: new Date(count+slice),
      content: "",
    })
    count+=slice
    index++
  }
}

function loadProgressData(groupId){
  let date = new Date()
  date.setHours(date.getHours() + groupId+ 4 + 4 * (Math.random() < 0.2));
  let start = new Date(date);
  date.setHours(date.getHours() + groupId+4 + 2 + Math.floor(Math.random() * 4));
  let end = new Date(date);
  // 添加内容物

  items.add({
    className:`task-${100*groupId} task-bar`,
    id: 0 + 100 * groupId,
    group: groupId,
    start: start,
    end: end,
    content: "",
  })

}

onMounted(()=>{
  init()
})
</script>

<template>
  <div id="visualization"></div>
</template>

<style scoped lang="scss">

.test-group .vis-item{

}

::v-deep(.task-bar .vis-item-content){
  width:100% !important;
  padding:5px !important;
}
::v-deep(.vis-item.test-bar){
  background: linear-gradient( 180deg, #FB9B61 0%, #FFE3D1 100%);;
  border-width: 0;
  border-radius: 0;
  top:initial !important;
  bottom:5px;
  height:20px;
}
</style>
