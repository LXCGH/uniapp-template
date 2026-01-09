<template>
  <view class="custom-page">
    <!-- 预览区域 -->
    <view class="preview-wrap">
      <view class="ruler-vertical">
        <view class="ruler-line"></view>
        <text class="ruler-text">{{ displayH }}{{ unitLabel }}</text>
        <view class="ruler-line"></view>
      </view>

      <view class="card">
        <image class="photo" :style="{ width: previewW + 'rpx', height: previewH + 'rpx' }" :src="imgSrc"
          mode="aspectFill" />
      </view>

      <view class="ruler-horizontal">
        <view class="ruler-line"></view>
        <text class="ruler-text">{{ displayW }}{{ unitLabel }}</text>
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
          <input class="ipt" type="number" v-model="wStr" placeholder="0" @blur="normalize('w')" />
          <text class="suffix">{{ unitLabel }}</text>
          <view class="label">宽度</view>
        </view>

        <text class="times">×</text>

        <view class="input-item">
          <input class="ipt" type="number" v-model="hStr" placeholder="0" @blur="normalize('h')" />
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
import { ref, computed, watch, onMounted } from 'vue'

const imgSrc = 'https://7072-prod-6g78fa1tc0ccbc21-1328661334.tcb.qcloud.la/photo.png?sign=3c8de54485ef7db41c94ed4e16c78ede&t=1767864354' // 可替换为实际预览图/裁剪后图

// 单位与数值
const unit = ref<'px' | 'mm'>('px')
const dpi = ref(300) // 物理转换用，默认300DPI
const wStr = ref('100')
const hStr = ref('100')

const wNum = computed(() => Number(wStr.value) || 0)
const hNum = computed(() => Number(hStr.value) || 0)
const unitLabel = computed(() => (unit.value === 'px' ? 'px' : 'mm'))

// 显示值（保留整洁格式）
const displayW = computed(() => unit.value === 'px' ? wNum.value : toFixed(hOrW('w', 'mm'), 0))
const displayH = computed(() => unit.value === 'px' ? hNum.value : toFixed(hOrW('h', 'mm'), 0))

function toFixed(n: number, p = 0) {
  const f = Math.pow(10, p)
  return Math.round(n * f) / f
}

// px <-> mm 转换
function px2mm(px: number) {
  return px / dpi.value * 25.4
}
function mm2px(mm: number) {
  return mm / 25.4 * dpi.value
}

// 单位切换时做等值转换，保持“物理尺寸一致”
function switchUnit(target: 'px' | 'mm') {
  if (target === unit.value) return
  if (target === 'mm') {
    wStr.value = toFixed(px2mm(wNum.value), 1).toString() // 保留1位小数
    hStr.value = toFixed(px2mm(hNum.value), 1).toString()
  } else {
    wStr.value = Math.round(mm2px(wNum.value)).toString()
    hStr.value = Math.round(mm2px(hNum.value)).toString()
  }
  unit.value = target
}

const maxW = ref(520)
const maxH = ref(680)

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  const pxPerRpx = sys.windowWidth / 750
  const rpxPerPx = 750 / sys.windowWidth

  uni.createSelectorQuery()
    .select('.preview-wrap').boundingClientRect()
    .select('.form-wrap').boundingClientRect()
    .exec((res: any) => {
      const wrap = res?.[0]
      const form = res?.[1]
      if (!wrap || !form) return

      // 横向：去掉 wrap 内外左右内边距（24rpx*2 + 卡片内边距10rpx*2）
      const usablePxW = wrap.width - (24 * 2 + 10 * 2) * pxPerRpx

      // 纵向：用 form.top - wrap.top 得到中间可用高度，
      // 再减去 wrap 上下内边距(40rpx + 28rpx)、卡片上下内边距(10rpx*2)和标尺/间距预留(32rpx)
      const usablePxH = (form.top - wrap.top) - (40 + 28 + 10 * 2 + 32) * pxPerRpx

      maxW.value = Math.max(1, Math.floor(usablePxW * rpxPerPx))
      maxH.value = Math.max(1, Math.floor(usablePxH * rpxPerPx))
    })
})

// 2) 稳定的等比缩放（先按宽算，再用高裁剪）
const previewW = computed(() => {
  const ratio = safeRatio()
  let w = maxW.value
  let h = w * ratio
  if (h > maxH.value) {
    h = maxH.value
    w = h / ratio
  }
  return Math.max(1, Math.round(w))
})

const previewH = computed(() => {
  const ratio = safeRatio()
  let w = maxW.value
  let h = w * ratio
  if (h > maxH.value) {
    h = maxH.value
    w = h / ratio
  }
  return Math.max(1, Math.round(h))
})

const valid = computed(() => wNum.value > 0 && hNum.value > 0)

function hOrW(which: 'w' | 'h', target: 'mm' | 'px') {
  if (target === 'mm') {
    return which === 'w' ? px2mm(wNum.value) : px2mm(hNum.value)
  } else {
    return which === 'w' ? mm2px(wNum.value) : mm2px(hNum.value)
  }
}

function goNext() {
  if (!valid.value) return
  const params = {
    width: wNum.value,
    height: hNum.value,
    unit: unit.value,
    dpi: dpi.value
  }
  const query = encodeURIComponent(JSON.stringify(params))
  uni.navigateTo({ url: `/pages/photo/edit?custom=${query}` })
}

function safeRatio() {
  if (!wNum.value || !hNum.value) return 1
  return Math.max(0.1, Math.min(10, hNum.value / wNum.value)) // 限制在0.1-10之间
}

// 边界限制
const LIMITS = {
  px: { min: 1, max: 4000 },
  mm: { min: 1, max: 300 } // 扩大毫米上限
}

function tip(msg: string) {
  uni.showToast({ title: msg, icon: 'none' })
}

// 规范化输入（并做边界控制）
function normalize(which: 'w' | 'h') {
  const lim = LIMITS[unit.value]
  let value = which === 'w' ? wNum.value : hNum.value
  let ref = which === 'w' ? wStr : hStr

  if (!value || value <= 0) {
    ref.value = ''
    return
  }

  if (value < lim.min) {
    ref.value = String(lim.min)
    tip(`${which === 'w' ? '宽度' : '高度'}不能小于${lim.min}${unitLabel.value}`)
  } else if (value > lim.max) {
    ref.value = String(lim.max)
    tip(`${which === 'w' ? '宽度' : '高度'}不能大于${lim.max}${unitLabel.value}`)
  } else {
    // 添加精度处理
    ref.value = unit.value === 'mm' ? toFixed(value, 1).toString() : Math.round(value).toString()
  }
}

// 单位切换后也做一次边界钳制
watch(unit, () => {
  normalize('w'); normalize('h')
})
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
  padding: 40rpx 24rpx 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 10rpx;
}

.photo {
  display: block;
  border-radius: 8rpx;
  background: #d8e7ff;
}

/* 标尺 */
.ruler-vertical,
.ruler-horizontal {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aa0a6;
  margin: 16rpx 0;
}

.ruler-vertical .ruler-line,
.ruler-horizontal .ruler-line {
  flex: 1;
  height: 2rpx;
  background: #e5e7eb;
}

.ruler-vertical {
  width: 100%;
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