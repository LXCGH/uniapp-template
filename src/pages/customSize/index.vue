<template>
  <view class="custom-page">
    <!-- 预览区域 -->
    <view class="preview-wrap">
      <view class="preview-row">
        <view class="ruler-vertical" style="margin-left: -40rpx;">
          <view class="ruler-line"></view>
          <text class="ruler-text">{{ hStr }}px</text>
          <view class="ruler-line"></view>
        </view>
        <scroll-view class="card" scroll-x="true" scroll-y="true">
          <view class=""></view>
          <image class="photo" :style="{ width: previewW + 'px', height: previewH + 'px' }" :src="imgSrc" />
        </scroll-view>
      </view>
      <view class="ruler-horizontal">
        <view class="ruler-line"></view>
        <text class="ruler-text">{{ wStr }}px</text>
        <view class="ruler-line"></view>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-wrap">
      <view class="tabs">
        <view class="tab" :class="{ active: unit === 'px' }" @tap="switchUnit('px')">像素</view>
        <view class="tab" :class="{ active: unit === 'mm' }" @tap="switchUnit('mm')">毫米</view>
      </view>
      <view class="inputs">
        <view class="input-item">
          <input class="ipt" type="number" v-model="wStr" placeholder="0" />
          <text class="suffix">{{ unitLabel }}</text>
          <view class="label">宽度</view>
        </view>

        <text class="times">×</text>

        <view class="input-item">
          <input class="ipt" type="number" v-model="hStr" placeholder="0" />
          <text class="suffix">{{ unitLabel }}</text>
          <view class="label">高度</view>
        </view>
      </view>

      <button class="next-btn" :class="{ disabled: !valid }" :disabled="!valid" @tap="goNext">
        下一步
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const imgSrc = '/static/images/photo.png'

const valid = ref(true)
const defaultW = ref(295)
const defaultH = ref(413)
const wStr = ref(defaultW.value)
const hStr = ref(defaultH.value)

// 预览尺寸：固定按 1/2 比例显示（px）
const SCALE = 0.5
const previewW = computed(() => Math.max(1, Math.round(wStr.value * SCALE)))
const previewH = computed(() => Math.max(1, Math.round(hStr.value * SCALE)))

onMounted(() => {

});

const normalize = (which: 'w' | 'h') => {
  // if (which === 'w') {
  //   wStr.value = Math.max(1, Math.round(wStr.value * SCALE))
  // } else {
  //   hStr.value = Math.max(1, Math.round(hStr.value * SCALE))
  // }
}

const unit = ref<'px' | 'mm'>('px')
const dpi = ref(300) // 物理转换用，默认300DPI
const unitLabel = computed(() => (unit.value === 'px' ? 'px' : 'mm'))

function switchUnit(target: 'px' | 'mm') {
  unit.value = target
}


function goNext() {
  const params = {
    width: 0,
    height: 0,
    unit: 'px'
  }
  const query = encodeURIComponent(JSON.stringify(params))
  uni.navigateTo({ url: `/pages/photo/edit?custom=${query}` })
}
</script>

<style scoped lang="scss">
.custom-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.preview-wrap {
  margin-top: 24rpx;
  border-radius: 20rpx;
  padding: 10rpx 0 28rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 10rpx;
  overflow: auto;
  max-height: 900rpx;
  width: 100%;
  max-width: 100%;
  flex: 1;
  min-width: 0;
  -webkit-overflow-scrolling: touch;
}

.photo {
  margin: 0 auto;
  display: block;
  border-radius: 8rpx;
  background: #d8e7ff;
  max-width: none;
}

/* 标尺 */
.ruler-vertical,
.ruler-horizontal {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aa0a6;
  margin: 0;
}

.ruler-vertical .ruler-line,
.ruler-horizontal .ruler-line {
  flex: 1;
  height: 2rpx;
  background: #e5e7eb;
}

.ruler-vertical {
  width: 100%;
  flex-direction: column;
  width: 60rpx;
  height: 100%;
  min-height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ruler-vertical .ruler-line {
  width: 2rpx;
  height: 40rpx;
  background: #e5e7eb;
  flex: 1;
}

.ruler-vertical .ruler-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  margin: 8rpx 0;
  color: #666;
  font-size: 26rpx;
}

.ruler-horizontal {
  width: 70%;
}

.ruler-text {
  margin: 0 16rpx;
  color: #666;
  font-size: 26rpx;
}

/* 表单 */
.form-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 24rpx 80rpx;
}

.tabs {
  display: flex;
  background: #f6f6f6;
  border-radius: 16rpx;
  padding: 6rpx;
  width: 360rpx;
  margin: 0 auto 24rpx;
}

.tab {
  flex: 1;
  text-align: center;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 12rpx;
  color: #666;
  font-weight: 500;
}

.tab.active {
  background: rgba(221, 66, 56, 0.12);
  color: var(--color-primary, #dd4238);
}

.inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  margin: 20rpx 0 32rpx;
}

.times {
  color: #999;
  font-size: 34rpx;
}

.input-item {
  position: relative;
  width: 280rpx;
  height: 88rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx 0 20rpx;
  box-sizing: border-box;
}

.ipt {
  flex: 1;
  height: 100%;
  font-size: 30rpx;
}

.suffix {
  color: #999;
  margin-left: 8rpx;
}

.label {
  width: 100%;
  position: absolute;
  left: 20rpx;
  bottom: -40rpx;
  color: #888;
  font-size: 24rpx;
  text-align: center;
}

.next-btn {
  width: 100%;
  margin-top: 60rpx;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  font-size: 32rpx;
  color: #fff;
  background: var(--color-primary, #dd4238);
  border: none;
}

.next-btn.disabled {
  background: #e5e5e5;
  color: #bbb;
}
</style>