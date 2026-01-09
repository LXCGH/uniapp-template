<template>
  <view class="personal-container">
    <!-- Header Background -->
    <view class="header-bg">
      <view class="bg-shape-1"></view>
      <view class="bg-shape-2"></view>
    </view>

    <!-- Custom Navigation Placeholder -->
    <view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>

    <!-- User Profile Section -->
    <view class="user-card" @click="handleUserClick">
      <view class="avatar-wrapper">
        <image class="avatar" :src="userAvatar" mode="aspectFill" />
        <view v-if="authStore.isAuthenticated" class="status-badge"></view>
      </view>
      <view class="user-info">
        <view class="name-row">
          <text class="username">{{ userName }}</text>
          <view v-if="authStore.isAuthenticated" class="vip-tag">
            <text class="vip-text">VIP会员</text>
          </view>
        </view>
        <text class="user-desc">{{ authStore.isAuthenticated ? '点击查看个人档案' : '登录开启精彩旅程' }}</text>
      </view>
      <view class="arrow-btn">
        <text class="arrow-icon">></text>
      </view>
    </view>

    <!-- Stats Row -->
    <view class="stats-row">
      <view class="stat-item">
        <text class="stat-num">0</text>
        <text class="stat-label">优惠券</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">10</text>
        <text class="stat-label">积分</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">0.00</text>
        <text class="stat-label">余额</text>
      </view>
    </view>

    <!-- Main Content Area -->
    <view class="content-body">

      <!-- Features Coming Soon -->
      <view class="menu-card">
        <view class="card-header">
          <text class="card-title">下版本预计上线</text>
          <text class="card-more">敬请期待</text>
        </view>
        <view class="feature-grid">
          <view class="grid-item">
            <view class="icon-box purple">
              <uni-icons type="videocam-filled" size="32" color="#7B1FA2" />
            </view>
            <text class="grid-text">视频换背景</text>
          </view>
          <view class="grid-item">
            <view class="icon-box orange">
              <uni-icons type="images-filled" size="32" color="#FD5B38" />
            </view>
            <text class="grid-text">老照片修复</text>
          </view>
          <view class="grid-item">
            <view class="icon-box blue">
              <uni-icons type="color-filled" size="32" color="#2979FF" />
            </view>
            <text class="grid-text">黑白上色</text>
          </view>
          <view class="grid-item">
            <view class="icon-box green">
              <uni-icons type="camera-filled" size="32" color="#00C853" />
            </view>
            <text class="grid-text">形象照生成</text>
          </view>
        </view>
      </view>

      <!-- Recommended Tools -->
      <view class="menu-card">
        <view class="card-header">
          <text class="card-title">小程序工具推荐</text>
        </view>
        <view class="list-item" @click="handleToolJump('pdf')">
          <view class="item-left">
            <uni-icons type="paperclip" size="22" color="#FF5722" class="item-icon-uni" />
            <text class="item-text">全能PDF转换助手</text>
          </view>
          <text class="arrow">></text>
        </view>
        <view class="list-item" @click="handleToolJump('remove')">
          <view class="item-left">
            <uni-icons type="image-filled" size="22" color="#2196F3" class="item-icon-uni" />
            <text class="item-text">智能一键抠图</text>
          </view>
          <text class="arrow">></text>
        </view>
      </view>

      <!-- Function Menu -->
      <view class="menu-card">
        <view class="list-item" @click="handleSignIn">
          <view class="item-left">
            <text class="item-icon">🎁</text>
            <text class="item-text">签到有礼</text>
          </view>
          <text class="arrow">></text>
        </view>
        <view class="list-item" @click="handleFAQ">
          <view class="item-left">
            <text class="item-icon">❓</text>
            <text class="item-text">常见问题</text>
          </view>
          <text class="arrow">></text>
        </view>
        <button class="list-item btn-reset" open-type="contact">
          <view class="item-left">
            <text class="item-icon">💬</text>
            <text class="item-text">联系客服</text>
          </view>
          <text class="arrow">></text>
        </button>
        <button class="list-item btn-reset" open-type="share">
          <view class="item-left">
            <text class="item-icon">📤</text>
            <text class="item-text">分享应用</text>
          </view>
          <text class="arrow">></text>
        </button>
      </view>

      <!-- Settings / Logout -->
      <view class="menu-card">
        <view class="list-item" @click="handleFeedback">
          <view class="item-left">
            <text class="item-icon">⚙️</text>
            <text class="item-text">设置与反馈</text>
          </view>
          <text class="arrow">></text>
        </view>
      </view>

      <view class="version-info">
        <text>Version 1.0.0</text>
      </view>

      <!-- Safe Area -->
      <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../store/useAuthStore'
import { onShareAppMessage } from '@dcloudio/uni-app'

const authStore = useAuthStore()
const statusBarHeight = ref(20)

// Get system info
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 20
  }
})

const userAvatar = computed(() => {
  return authStore.user?.avatar || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
})

const userName = computed(() => {
  return authStore.user?.name || '立即登录'
})

const handleUserClick = () => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages/login/index' })
  } else {
    // Navigate to profile details if needed
    uni.showToast({ title: '已登录', icon: 'none' })
  }
}

const handleToolJump = (type: string) => {
  // Placeholder for future mini-program navigation
  const tools: Record<string, string> = {
    pdf: '全能PDF转换助手',
    remove: '智能一键抠图'
  }
  const name = tools[type] || '该工具'
  uni.showToast({
    title: `即将跳转：${name}`,
    icon: 'none'
  })
  // Example code for future use:
  // uni.navigateToMiniProgram({ appId: '...' })
}

const handleSignIn = () => {
  if (!authStore.isAuthenticated) {
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }
  uni.showToast({ title: '签到功能开发中', icon: 'none' })
}

const handleFAQ = () => {
  uni.showToast({ title: '常见问题整理中', icon: 'none' })
}

const handleFeedback = () => {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}

// Share configuration
onShareAppMessage(() => {
  return {
    title: '快来体验这个很棒的小程序！',
    path: '/pages/index/index'
  }
})
</script>

<style lang="scss" scoped>
.personal-container {
  min-height: 100vh;
  background-color: #F6F7F9;
  position: relative;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 560rpx;
  background: linear-gradient(135deg, #FD5B38 0%, #FF8F70 100%);
  z-index: 0;
  overflow: hidden;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;

  .bg-shape-1 {
    position: absolute;
    top: -50rpx;
    right: -50rpx;
    width: 300rpx;
    height: 300rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .bg-shape-2 {
    position: absolute;
    bottom: -20rpx;
    left: -100rpx;
    width: 400rpx;
    height: 400rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
  }
}

.user-card {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  padding: 20rpx 40rpx;
  margin-top: 20rpx;

  .avatar-wrapper {
    position: relative;
    margin-right: 30rpx;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.8);
      background: #eee;
    }

    .status-badge {
      position: absolute;
      bottom: 4rpx;
      right: 4rpx;
      width: 24rpx;
      height: 24rpx;
      background: #00C853;
      border: 4rpx solid #fff;
      border-radius: 50%;
    }
  }

  .user-info {
    flex: 1;

    .name-row {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .username {
        font-size: 40rpx;
        font-weight: bold;
        color: #fff;
        margin-right: 16rpx;
      }

      .vip-tag {
        padding: 4rpx 12rpx;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 20rpx;
        border: 1rpx solid rgba(255, 255, 255, 0.3);

        .vip-text {
          font-size: 20rpx;
          color: #FFD700;
          font-weight: 600;
        }
      }
    }

    .user-desc {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .arrow-btn {
    .arrow-icon {
      color: rgba(255, 255, 255, 0.6);
      font-size: 32rpx;
    }
  }
}

.stats-row {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  margin-top: 40rpx;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-num {
      font-size: 40rpx;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8rpx;
    }

    .stat-label {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

.content-body {
  position: relative;
  z-index: 10;
  padding: 0 30rpx;
  margin-top: 40rpx;
}

.menu-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 0;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 30rpx 20rpx 30rpx;

  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .card-more {
    font-size: 24rpx;
    color: #999;
    display: flex;
    align-items: center;

    .arrow {
      margin-left: 6rpx;
      font-size: 22rpx;
    }
  }
}

.feature-grid {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0 30rpx 0;

  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon-box {
      width: 80rpx;
      height: 80rpx;
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;

      &.orange {
        background: rgba(253, 91, 56, 0.1);
      }

      &.blue {
        background: rgba(41, 121, 255, 0.1);
      }

      &.green {
        background: rgba(0, 200, 83, 0.1);
      }

      &.purple {
        background: rgba(123, 31, 162, 0.1);
      }

      &.gray {
        background: rgba(153, 153, 153, 0.1);
      }

      .grid-icon {
        font-size: 40rpx;
      }
    }

    .grid-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f9f9f9;
  }

  .item-left {
    display: flex;
    align-items: center;

    .item-icon {
      margin-right: 20rpx;
      font-size: 36rpx;
      width: 40rpx;
      text-align: center;
    }

    .item-icon-uni {
      margin-right: 20rpx;
      width: 40rpx;
      text-align: center;
      display: flex;
      justify-content: center;
    }

    .item-text {
      font-size: 28rpx;
      color: #333;
    }
  }

  .arrow {
    color: #ccc;
    font-size: 24rpx;
  }
}

.btn-reset {
  margin: 0;
  padding: 32rpx 30rpx;
  background-color: #fff;
  border-radius: 0;
  line-height: inherit;

  &::after {
    border: none;
  }
}

.version-info {
  text-align: center;
  padding: 40rpx 0;

  text {
    font-size: 24rpx;
    color: #ccc;
  }
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>