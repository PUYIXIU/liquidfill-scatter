<template>
  <div class="chart-wrapper">
    <Axis
        ref="AxisRef"
        :dom-id="axisId"
        class="axis-box"
        :grid="grid"
    />
    <Liquid ref="LiquidRef" :dom-id="liquidId" :data="data" class="liquid-box" />
  </div>
</template>

<script setup>

import Axis from './components/Axis.vue'
import Liquid from './components/Liquid.vue'
import {mock_liquidData} from './mock/LiquidData.js'
import {ref, getCurrentInstance, onMounted} from 'vue'

const { proxy } = getCurrentInstance()
  const axisId = ref('axesId')
const liquidId = ref('liquidId') // 水球图id
const data = ref(mock_liquidData)

const grid = ref({
  top:30,
  bottom:30,
  left:30,
  right:30,
})

onMounted(()=>{
  data.value = proxy.$refs.AxisRef.convertAxisToPixel(data.value)
  proxy.$refs.LiquidRef.initChart()
})

</script>

<style scoped lang="scss">
.chart-wrapper{
  position:relative;
  width: 1200px;
  height:700px;
  background-color: #fff;
}
.axis-box{
  z-index:0;
}
.liquid-box{
  z-index:1;
  filter:saturate(1.4) contrast(1);
}
</style>
