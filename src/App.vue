<script setup>
import LiquidFillScatter from './packages/LiquidFillScatter/index.vue'
import LiquidPie from './packages/LiquidPie/index.vue'
import {liquidPieColor} from "./packages/LiquidPie/mock/LiquidPieData";
// import CustomTimline from './packages/CustomTimeline/index.vue'
import ProgressTimeline from './packages/ProgressTimeline/index.vue'
</script>

<template>
<!--  <LiquidPie dom-id="chart-1" :color="liquidPieColor[0]" />-->
<!--  <LiquidFillScatter/>-->
<!--  <CustomTimline/>-->
  <ProgressTimeline/>
</template>

<style scoped>
</style>
