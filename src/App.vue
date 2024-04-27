<script setup>
import LiquidFillScatter from './packages/LiquidFillScatter/index.vue'
import LiquidPie from './packages/LiquidPie/index.vue'
import {liquidPieColor} from "./packages/LiquidPie/mock/LiquidPieData";
</script>

<template>
  <LiquidPie dom-id="chart-1" :color="liquidPieColor[0]" />
  <LiquidFillScatter/>
</template>

<style scoped>
</style>
