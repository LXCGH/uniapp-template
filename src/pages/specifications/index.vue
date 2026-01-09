<template>
  <view class="spec-page">
    <!-- Custom Nav Bar -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <image src="/static/images/left-back.png" mode="aspectFit" class="back-icon" />
        </view>
        <text class="nav-title">规格参数</text>
      </view>
    </view>

    <!-- Main Scroll Content -->
    <scroll-view class="main-content" scroll-y :style="{ paddingTop: (statusBarHeight + 44) + 'px' }">

      <!-- Top Card: Title & Specs -->
      <view class="header-card">
        <view class="title-row">
          <text class="spec-title">{{ specInfo.title }}</text>
          <view class="tag-row">
            <text class="feature-tag" v-for="(feat, idx) in specInfo.features" :key="idx">{{ feat }}</text>
          </view>
        </view>

        <view class="param-grid">
          <view class="param-item">
            <text class="label">尺寸(mm)</text>
            <text class="value">{{ specInfo.params[0].value }}</text>
          </view>
          <view class="param-item">
            <text class="label">像素(px)</text>
            <text class="value">{{ specInfo.params[1].value }}</text>
          </view>
          <view class="param-item">
            <text class="label">分辨率</text>
            <text class="value">{{ specInfo.params[2].value }}</text>
          </view>
          <view class="param-item">
            <text class="label">文件格式</text>
            <text class="value">{{ specInfo.params[3].value }}</text>
          </view>
        </view>
      </view>

      <!-- Color Selection -->
      <view class="section-card">
        <text class="section-title">推荐背景色</text>
        <ColorPickerPanel v-model="selectedBgColor" @custom="selectBgColor('custom')" />
      </view>

      <!-- Instructions "Tips" -->
      <view class="section-card">
        <view class="card-header">
          <text class="section-title">拍摄须知</text>
          <text class="link-btn" @click="showExample">查看示例 ></text>
        </view>

        <!-- Example Photo Display -->
        <!-- Example Photo Display -->
        <view class="example-area">
          <view class="image-wrapper" :style="{ backgroundColor: selectedBgColor }">
            <image
              src="https://7072-prod-6g78fa1tc0ccbc21-1328661334.tcb.qcloud.la/photo.png?sign=3c8de54485ef7db41c94ed4e16c78ede&t=1767864354"
              class="example-img" mode="aspectFit" />
          </view>
          <text class="example-tip">预览效果：实际制作时AI会自动抠图去除原背景</text>
        </view>
        <view class="instruction-row">
          <view class="instruction-step">
            <view class="icon-box">
              <uni-icons type="info-filled" size="32" color="#FD5B38" />
            </view>
            <text class="step-text">光线充足</text>
          </view>
          <view class="arrow-divider">></view>
          <view class="instruction-step">
            <view class="icon-box">
              <uni-icons type="person-filled" size="32" color="#FD5B38" />
            </view>
            <text class="step-text">正对镜头</text>
          </view>
          <view class="arrow-divider">></view>
          <view class="instruction-step">
            <view class="icon-box">
              <uni-icons type="eye-filled" size="32" color="#FD5B38" />
            </view>
            <text class="step-text">不戴眼镜</text>
          </view>
        </view>
        <view class="tips-box">
          <text class="tips-content">{{ specInfo.requirements }}</text>
        </view>
      </view>

      <!-- Bottom Spacer -->
      <view class="safe-area-bottom"></view>
    </scroll-view>

    <!-- Bottom Action Bar -->
    <view class="bottom-bar safe-area-padding">
      <button class="action-btn album-btn" @click="selectFromAlbum">
        <text>相册上传</text>
      </button>
      <button class="action-btn camera-btn" @click="startCamera">
        <text>直接拍摄</text>
      </button>
    </view>
    <!-- Custom Color Picker Modal -->
    <ColorPickerModal v-model="showColorPicker" :initial-color="selectedBgColor" @confirm="onConfirmCustomColor" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ColorPickerPanel from '@/components/ColorPickerPanel.vue'
import ColorPickerModal from '@/components/ColorPickerModal.vue'

const statusBarHeight = ref(20)
const selectedBgColor = ref('#438edb') // Default blue usually
const showColorPicker = ref(false)

// Data Structure
const specInfo = ref({
  title: '加载中...',
  features: ['高清无损', '智能排版'],
  params: [
    { label: '打印尺寸', value: '--' },
    { label: '像素大小', value: '--' },
    { label: '分辨率', value: '300DPI' },
    { label: '文件格式', value: 'JPG' }
  ],
  requirements: '请站在白墙或纯色背景前拍摄；头部居中，露出双耳和眉毛；光线均匀，避免阴阳脸。'
})

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 20
    }
  })

  // Parse params
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const specItemStr = currentPage.options?.item
  if (specItemStr) {
    const item = JSON.parse(specItemStr)
    specInfo.value.title = item.title
    specInfo.value.params[0].value = item.sizeMM
    specInfo.value.params[1].value = item.pixel

    // Auto select color based on type if possible, else default blue
    if (item.title.includes('签证')) selectedBgColor.value = '#ffffff'
    else if (item.title.includes('结婚')) selectedBgColor.value = '#d9001b'
  }
})

const goBack = () => {
  uni.navigateBack()
}

const selectBgColor = (val: string) => {
  if (val === 'custom') {
    showColorPicker.value = true
  } else {
    selectedBgColor.value = val
  }
}

const onConfirmCustomColor = (hex: string) => {
  selectedBgColor.value = hex
}

const showExample = () => {
  uni.previewImage({
    urls: ['/static/images/photo.png']
  })
}

const selectFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original'],
    sourceType: ['album'],
    success: (res) => {
      const path = res.tempFilePaths[0]
      uni.navigateTo({
        url: `/pages/photo/edit?image=${path}&bgColor=${selectedBgColor.value}`
      })
    }
  })
}

const startCamera = () => {
  const finalColor = selectedBgColor.value === 'custom' ? '#ffffff' : selectedBgColor.value // Fallback if still 'custom' string (shouldn't happen with logic)
  uni.navigateTo({
    url: `/pages/shootingPage/index?bgColor=${finalColor}`
  })
}
</script>

<style lang="scss" scoped>
.spec-page {
  min-height: 100vh;
  background-color: #F6F7F9;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 100;

  .nav-content {
    height: 44px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10rpx;

    .back-btn {
      position: absolute;
      left: 10rpx;
      top: 0;
      bottom: 0;
      width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;

      .back-icon {
        width: 32rpx;
        height: 32rpx;
      }
    }

    .nav-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

  }
}

.main-content {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
  padding-bottom: 200rpx; // Space for bottom bar
}

.header-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);

  .title-row {
    text-align: center;
    margin-bottom: 40rpx;

    .spec-title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 16rpx;
    }

    .tag-row {
      display: flex;
      justify-content: center;
      gap: 12rpx;

      .feature-tag {
        font-size: 20rpx;
        color: #FD5B38;
        background: rgba(253, 91, 56, 0.1);
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
      }
    }
  }

  .param-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24rpx;
    background: #FAFAFA;
    padding: 24rpx;
    border-radius: 16rpx;

    .param-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .label {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .value {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
      }
    }
  }
}

.section-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.02);

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
}

.color-scroll {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;

  .color-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .color-circle {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      margin-bottom: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);

      /* Spectrum/Rainbow Effect for Custom Option */
      &.is-custom {
        background: conic-gradient(red, orange, yellow, green, blue, indigo, violet, red);
      }

      /* Reset icon line-height to prevent vertical offset */
      :deep(.uni-icons) {
        line-height: 1;
        display: flex;
      }
    }

    .color-name {
      font-size: 24rpx;
      color: #666;
    }

    &.active {
      .color-circle {
        transform: scale(1.1);
        box-shadow: 0 8rpx 16rpx rgba(253, 91, 56, 0.2);
      }

      .color-name {
        color: #FD5B38;
        font-weight: 500;
      }
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;

  .section-title {
    margin-bottom: 0;
  }

  .link-btn {
    font-size: 24rpx;
    color: #FD5B38;
  }
}

.instruction-row {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 30rpx;

  .instruction-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;
    /* Ensure equal width for centering */

    .icon-box {
      width: 64rpx;
      height: 64rpx;
      margin-bottom: 16rpx;
      /* Increased margin as requested */
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FFF5E5;
      /* Light orange bg for icon */
      border-radius: 50%;
    }

    .step-text {
      font-size: 24rpx;
      color: #333;
      text-align: center;
    }
  }

  .arrow-divider {
    color: #e0e0e0;
    font-size: 32rpx;
    font-weight: 300;
    margin-top: 68rpx;
  }
}

.example-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;

  .image-wrapper {
    width: 240rpx;
    height: 320rpx;
    border-radius: 20rpx;
    overflow: hidden;
    /* Clip the image to radius */
    transition: background-color 0.3s ease;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);

    .example-img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .example-tip {
    font-size: 22rpx;
    color: #999;
    margin-top: 16rpx;
    background: #F5F7FA;
    padding: 6rpx 20rpx;
    border-radius: 20rpx;
  }
}

.tips-box {
  background: #FFF5E5;
  padding: 24rpx;
  border-radius: 12rpx;

  .tips-content {
    font-size: 24rpx;
    color: #B9761E;
    line-height: 1.6;
    text-align: justify;
  }
}

.safe-area-bottom {
  height: 40rpx;
  width: 100%;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .action-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-size: 30rpx;
    font-weight: 600;

    &::after {
      border: none;
    }

    &.album-btn {
      background: #F5F7FA;
      color: #333;
      margin-right: 24rpx;
    }

    &.camera-btn {
      background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);
      color: #fff;
      box-shadow: 0 8rpx 20rpx rgba(253, 91, 56, 0.3);
    }

    &:active {
      opacity: 0.9;
    }
  }
}
</style>
