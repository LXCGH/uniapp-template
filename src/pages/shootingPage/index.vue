<template>
  <view class="camera-page">
    <view class="tip-bubble" v-if="showTip">
      <text class="tip-text">{{ tipText }}</text>
    </view>

    <!-- 摄像头预览区域 -->
    <camera class="camera-preview" :device-position="cameraPosition" flash="off" @error="onCameraError"
      @initdone="onCameraInit">
      <!-- 人物区域标识边框 -->
      <cover-image src="https://img-blog.csdnimg.cn/20210126152753150.png"
        style="width: 90%; height: 680rpx;margin:160rpx auto;" mode="widthFix"></cover-image>
    </camera>

    <!-- 底部控制栏 -->
    <view class="camera-controls">
      <view class="control-left">
        <!-- 可以添加其他控制按钮 -->
      </view>

      <!-- 拍照按钮 -->
      <view class="shutter-button" @tap="takePhoto">
        <view class="shutter-outer"></view>
        <view class="shutter-inner"></view>
      </view>

      <!-- 切换摄像头按钮 -->
      <view class="control-right">
        <view class="switch-camera" @tap="switchCamera">
          <uni-icons type="loop" size="20" color="#fff" />
          <text class="switch-text">切换</text>
        </view>
      </view>
    </view>

    <!-- 拍照结果预览 -->
    <view class="photo-preview" v-if="photoPath" @tap="hidePreview">
      <image :src="photoPath" mode="aspectFit" class="preview-image" />
      <view class="preview-actions">
        <button class="action-btn retake" @tap="retakePhoto">重拍</button>
        <button class="action-btn confirm" @tap="confirmPhoto">确认</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentTime = ref('')
const showTip = ref(true)
const tipText = ref('站在纯色背景前，拍摄效果最佳')
const photoPath = ref('')
const cameraContext = ref<any>(null)
const cameraPosition = ref<'front' | 'back'>('back')

// 时间更新定时器
let timeTimer: any = null

onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)

  // 创建摄像头上下文
  cameraContext.value = uni.createCameraContext()
})

onUnmounted(() => {
  if (timeTimer) {
    clearInterval(timeTimer)
  }
})

// 更新时间
function updateTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// 摄像头初始化完成
function onCameraInit() {
  console.log('摄像头初始化完成')
}

// 摄像头错误处理
function onCameraError(e: any) {
  console.error('摄像头错误:', e.detail)
  uni.showToast({
    title: '摄像头启动失败',
    icon: 'error'
  })
}

// 拍照
function takePhoto() {
  if (!cameraContext.value) return

  cameraContext.value.takePhoto({
    quality: 'high',
    success: (res: any) => {
      console.log('拍照成功:', res.tempImagePath)
      photoPath.value = res.tempImagePath
    },
    fail: (err: any) => {
      console.error('拍照失败:', err)
      uni.showToast({
        title: '拍照失败',
        icon: 'error'
      })
    }
  })
}

// 切换摄像头
function switchCamera() {
  // 切换摄像头位置
  cameraPosition.value = cameraPosition.value === 'back' ? 'front' : 'back'

  // 重新创建摄像头上下文
  setTimeout(() => {
    cameraContext.value = uni.createCameraContext()
  }, 100)

  // 显示切换提示
  uni.showToast({
    title: cameraPosition.value === 'front' ? '已切换到前置摄像头' : '已切换到后置摄像头',
    icon: 'none',
    duration: 1000
  })
}

// 隐藏预览
function hidePreview() {
  photoPath.value = ''
}

// 重拍
function retakePhoto() {
  photoPath.value = ''
}

// 确认照片
function confirmPhoto() {
  if (!photoPath.value) return

  // 跳转到编辑页面，传递照片路径和背景色
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const bgColor = currentPage.options?.bgColor || '#dd4238'

  uni.navigateTo({
    url: `/pages/photo/edit?image=${photoPath.value}&bgColor=${bgColor}`
  })
}
</script>

<style scoped lang="scss">
.camera-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
}

// 提示气泡
.tip-bubble {
  position: absolute;
  top: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  width: 400rpx;
  text-align: center;
  z-index: 10;

  .tip-text {
    color: #fff;
    font-size: 26rpx;
    text-align: center;
    line-height: 1.4;
  }
}

// 摄像头预览
.camera-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

// 底部控制栏
.camera-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48rpx;
  z-index: 10;
}

.control-left {
  width: 120rpx;
}

.control-right {
  width: 120rpx;
  display: flex;
  justify-content: flex-end;
}

// 拍照按钮
.shutter-button {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .shutter-outer {
    width: 100%;
    height: 100%;
    border: 6rpx solid #fff;
    border-radius: 50%;
    position: absolute;
  }

  .shutter-inner {
    width: 80rpx;
    height: 80rpx;
    background: #fff;
    border-radius: 50%;
    position: absolute;
  }

  &:active {
    transform: scale(0.95);

    .shutter-inner {
      background: #f0f0f0;
    }
  }
}

// 切换摄像头按钮
.switch-camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;

  .switch-text {
    color: #fff;
    font-size: 24rpx;
  }
}

// 照片预览
.photo-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.preview-image {
  flex: 1;
  width: 100%;
}

.preview-actions {
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 48rpx;
  background: rgba(0, 0, 0, 0.8);
}

.action-btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;

  &.retake {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  &.confirm {
    background: var(--color-primary);
    color: #fff;
  }
}
</style>