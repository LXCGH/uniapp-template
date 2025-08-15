<template>
  <view class="spec-detail-page">
    <!-- 拍摄须知卡片 -->
    <view class="instruction-card">
      <view class="card-title">拍摄须知</view>
      <view class="instruction-content">
        <view class="instruction-list">
          <view class="instruction-item" v-for="(item, index) in instructions" :key="index">
            <view class="instruction-number">{{ index + 1 }}</view>
            <text class="instruction-text">{{ item }}</text>
          </view>
        </view>
        <view class="instruction-images">
          <image src="/static/images/photo.png" class="example-image" />
        </view>
      </view>
    </view>

    <!-- 规格详情卡片 -->
    <view class="spec-card">
      <view class="card-title">
        <view class="title-icon"></view>
        {{ specInfo.title }}
      </view>

      <!-- 功能特性 -->
      <view class="features">
        <view class="feature-item" v-for="feature in specInfo.features" :key="feature">
          <uni-icons type="checkmarkempty" size="16" color="var(--color-primary)" />
          <text class="feature-text">{{ feature }}</text>
        </view>
      </view>

      <!-- 规格参数 -->
      <view class="spec-params">
        <view class="param-item" v-for="param in specInfo.params" :key="param.label">
          <text class="param-label">{{ param.label }}</text>
          <text class="param-value">{{ param.value }}</text>
        </view>
      </view>

      <!-- 背景色选择 -->
      <view class="background-colors">
        <text class="param-label">背景颜色</text>
        <view class="color-list">
          <view class="color-item" v-for="color in backgroundColors" :key="color.value"
            :class="{ active: selectedBgColor === color.value }" :style="{ backgroundColor: color.value }"
            @tap="selectBgColor(color.value)"></view>
        </view>
      </view>

      <!-- 其他要求 -->
      <view class="requirements">
        <text class="requirements-title">其他要求</text>
        <text class="requirements-text">{{ specInfo.requirements }}</text>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="action-buttons">
      <button class="btn btn-secondary" @tap="selectFromAlbum">
        <uni-icons type="image" size="20" color="#666" />
        <text>从相册中选取</text>
      </button>
      <button class="btn btn-primary" @tap="startCamera">
        <uni-icons type="camera" size="20" color="#fff" />
        <text>拍摄</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 拍摄须知
const instructions = [
  '站白墙(纯色)前,光线充足均匀',
  '头部居中,正对镜头',
  '露出眉毛和耳朵,面部无遮挡',
  '优先使用后置摄像头拍摄'
]

// 背景色选项
const backgroundColors = [
  { value: '#e55757', label: '红色' },
  { value: '#ffffff', label: '白色' },
  { value: '#ff0000', label: '红色' },
  { value: '#448edb', label: '深蓝' },
  { value: '#74c0fb', label: '浅蓝' },
  { value: '#808080', label: '灰色' },
  { value: '#0074ff', label: '天蓝' },
  { value: '#8b0000', label: '深红' }
]

const selectedBgColor = ref('#dd4238')

// 规格信息
const specInfo = ref({
  title: '教师资格证 (384x512)',
  features: ['支持保存电子照', '支持冲印'],
  params: [
    { label: '打印尺寸', value: '32x43' },
    { label: '像素大小', value: '384x512' },
    { label: '分辨率', value: '300DPI' },
    { label: '文件格式', value: 'JPG' }
  ],
  requirements: '建议不要佩戴眼镜。为了保障您能够顺利报名考试,证件照下单后,请不要直接把证件照保存至手机(会压缩图片大小),用"发送到邮箱"或"提取下载"的方式进行照片下载。下载照片、报名全程电脑操作。'
})

onMounted(() => {
  // 获取路由参数，设置对应的规格信息
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const specItemStr = currentPage.options?.item
  console.log(specItemStr)

  if (specItemStr) {
    // 根据 specId 设置对应的规格信息
    setSpecInfo(specItemStr)
  }
})

type SpecItem = {
  id: string
  title: string
  sizeMM: string
  pixel: string
}

function setSpecInfo(specItemStr: string) {
  const specItem = JSON.parse(specItemStr) as SpecItem
  if (specItem) {
    specInfo.value = {
      title: specItem.title,
      features: ['支持保存电子照', '支持冲印'],
      params: [
        { label: '打印尺寸', value: specItem.sizeMM },
        { label: '像素大小', value: specItem.pixel },
        { label: '分辨率', value: '300DPI' },
        { label: '文件格式', value: 'JPG' }
      ],
      requirements: '建议不要佩戴眼镜。为了保障您能够顺利报名考试,证件照下单后,请不要直接把证件照保存至手机(会压缩图片大小),用"发送到邮箱"或"提取下载"的方式进行照片下载。下载照片、报名全程电脑操作。'
    }
  }
}

function selectBgColor(color: string) {
  selectedBgColor.value = color
}

function selectFromAlbum() {
  uni.chooseImage({
    count: 1,
    sizeType: ['original'],
    sourceType: ['album'],
    success: (res) => {
      // 处理选择的图片
      console.log('选择的图片:', res.tempFilePaths[0])
      // 跳转到编辑页面
      uni.navigateTo({
        url: `/pages/photo/edit?image=${res.tempFilePaths[0]}&bgColor=${selectedBgColor.value}`
      })
    }
  })
}

function startCamera() {
  // uni.chooseImage({
  //   count: 1,
  //   sizeType: ['original'],
  //   sourceType: ['camera'],
  //   success: (res) => {
  //     // 处理拍摄的图片
  //     console.log('拍摄的图片:', res.tempFilePaths[0])
  //     // 跳转到编辑页面
  //     uni.navigateTo({
  //       url: `/pages/photo/edit?image=${res.tempFilePaths[0]}&bgColor=${selectedBgColor.value}`
  //     })
  //   }
  // })
  uni.navigateTo({
    url: `/pages/shootingPage/index?bgColor=${selectedBgColor.value}`
  })
}
</script>

<style scoped lang="scss">
.spec-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24rpx;
  padding-bottom: 120rpx;
}

// 卡片通用样式
.instruction-card,
.spec-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;

  .title-icon {
    width: 8rpx;
    height: 32rpx;
    background: var(--color-primary);
    border-radius: 4rpx;
    margin-right: 16rpx;
  }
}

// 拍摄须知样式
.instruction-content {
  display: flex;
  gap: 32rpx;
}

.instruction-list {
  flex: 1;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.instruction-number {
  width: 40rpx;
  height: 40rpx;
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 500;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.instruction-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

.instruction-images {
  width: 200rpx;
  flex-shrink: 0;
}

.example-image {
  width: auto;
  height: 240rpx;
  border-radius: 12rpx;
  // background: var(--color-primary);
}

// 功能特性样式
.features {
  display: flex;
  gap: 32rpx;
  margin-bottom: 32rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.feature-text {
  font-size: 26rpx;
  color: #666;
}

// 规格参数样式
.spec-params {
  margin-bottom: 32rpx;
}

.param-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.param-label {
  font-size: 28rpx;
  color: #666;
}

.param-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

// 背景色选择样式
.background-colors {
  margin-bottom: 32rpx;
}

.color-list {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
  flex-wrap: wrap;
}

.color-item {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 4rpx solid transparent;
  transition: all 0.2s ease;

  &.active {
    border-color: var(--color-primary);
    transform: scale(1.1);
  }
}

// 其他要求样式
.requirements {
  background: #f8f8f8;
  padding: 24rpx;
  border-radius: 12rpx;
}

.requirements-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 12rpx;
  display: block;
}

.requirements-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

// 底部操作按钮样式
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24rpx;
  display: flex;
  gap: 24rpx;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
  transition: all 0.2s ease;

  &.btn-primary {
    background: var(--color-primary);
    color: #fff;

    &:active {
      background: rgba(221, 66, 56, 0.8);
    }
  }

  &.btn-secondary {
    background: #fff;
    color: #666;
    border: 2rpx solid #e0e0e0;

    &:active {
      background: #f5f5f5;
    }
  }
}
</style>
