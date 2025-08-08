<template>
  <view v-if="loading"
    class=" absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-30 backdrop-blur-md">
    <view class="loader"></view>
  </view>


</template>

<script setup lang="ts">

import { defineProps, toRefs } from 'vue';

const props = defineProps<{
  loading: boolean
}>();

const { loading } = toRefs(props);

</script>

<style>

.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {to{transform: rotate(1turn)}}


</style>