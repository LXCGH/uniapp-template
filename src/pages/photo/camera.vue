<template>
  <view class="camera-page">
    <!-- 顶部状态栏和提示 -->
    <view class="camera-header">
      <view class="status-bar">
        <text class="time">{{ currentTime }}</text>
        <view class="camera-info">
          <uni-icons type="camera" size="16" color="#fff" />
          <text class="camera-text">相机</text>
        </view>
        <view class="status-icons">
          <uni-icons type="more-filled" size="16" color="#fff" />
          <uni-icons type="wifi" size="16" color="#fff" />
          <text class="battery">{{ batteryLevel }}%</text>
        </view>
      </view>
      
      <!-- 顶部提示 -->
      <view class="tip-bubble" v-if="showTip">
        <text class="tip-text">{{ tipText }}</text>
      </view>
    </view>

    <!-- 摄像头预览区域 -->
    <camera 
      class="camera-preview"
      device-position="back"
      flash="off"
      @error="onCameraError"
      @initdone="onCameraInit"
    >
      <!-- 人物区域标识边框 -->
      <view class="person-outline">
        <view class="outline-frame"></view>
      </view>
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
const batteryLevel = ref(95)
const showTip = ref(true)
const tipText = ref('站在纯色背景前，拍摄效果最佳')
const photoPath = ref('')
const cameraContext = ref<any>(null)

// 时间更新定时器
let timeTimer: any = null

onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)
  
  // 获取电池信息
  getBatteryInfo()
  
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

// 获取电池信息
function getBatteryInfo() {
  // #ifdef APP-PLUS
  plus.battery.getStatus((status: any) => {
    batteryLevel.value = status.level
  })
  // #endif
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
  // 这里可以通过改变 device-position 来切换前后摄像头
  // 需要重新创建 camera 组件
  uni.showToast({
    title: '切换摄像头功能开发中',
    icon: 'none'
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

// 顶部区域
.camera-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0 24rpx;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  
  .time {
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
  }
  
  .camera-info {
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    .camera-text {
      color: #fff;
      font-size: 24rpx;
    }
  }
  
  .status-icons {
    display: flex;
    align-items: center;
    gap: 16rpx;
    
    .battery {
      color: #fff;
      font-size: 24rpx;
    }
  }
}

// 提示气泡
.tip-bubble {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20rpx;
  padding: 16rpx 24rpx;
  margin: 20rpx auto;
  max-width: 80%;
  
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

// 人物区域标识边框
.person-outline {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  
  .outline-frame {
    width: 400rpx;
    height: 500rpx;
    border: 4rpx solid #ffeb3b;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    box-shadow: 0 0 20rpx rgba(255, 235, 59, 0.3);
    position: relative;
    
    // 添加头部轮廓
    &::before {
      content: '';
      position: absolute;
      top: -20rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 200rpx;
      height: 240rpx;
      border: 4rpx solid #ffeb3b;
      border-radius: 50%;
      box-shadow: 0 0 20rpx rgba(255, 235, 59, 0.3);
    }
  }
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
