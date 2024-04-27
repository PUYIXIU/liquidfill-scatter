<template>
  <div :id="props.domId" class="chart-wrapper">
    <Axis
        ref="AxisRef"
        :dom-id="axisId"
        class="axis-box"
        :grid="grid"
    />
    <LiquidPieChart :dom-id="chartId" :color="props.color"/>
  </div>
</template>

<script setup>
import Axis from './components/Axis.vue'
import LiquidPieChart from './components/LiquidPieChart.vue'
import {ref} from "vue";
const props = defineProps(["domId", "color"])
const axisId = ref(`${props.domId}-axesId`)
const chartId = ref(`${props.domId}-liquid-pie-chartId`)

const grid = ref({
  top:30,
  bottom:30,
  left:30,
  right:30,
})

</script>

<style scoped lang="scss">
.chart-wrapper{
  position:relative;
  width: 1200px;
  height:700px;
  background-color: #fff;
}
</style>
