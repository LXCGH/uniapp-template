<template>
  <view class="login-container">
    <!-- Back Button / Header -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <uni-icons type="closeempty" size="24" color="#333" />
        </view>
      </view>
    </view>

    <!-- Main Content -->
    <view class="content-area" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }">

      <!-- Logo / Title Area -->
      <view class="logo-section">
        <view class="logo-box">
          <uni-icons type="camera-filled" size="60" color="#fff" />
        </view>
        <text class="app-name">AI证件照</text>
        <text class="app-slogan">一键生成 · 智能美颜 · 快速换装</text>
      </view>

      <!-- Action Area -->
      <view class="action-section">
        <!-- Phone Login Button -->
        <view class="btn-wrapper">
          <button class="login-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" hover-class="btn-hover">
            <view class="icon-wrapper">
              <uni-icons type="phone-filled" size="22" color="#fff" />
            </view>
            <text>手机号快捷登录</text>
          </button>

          <!-- Mask for privacy check interception -->
          <view v-if="!isPrivacyChecked" class="privacy-mask" @click="handlePrivacyCheck"></view>
        </view>

        <!-- Privacy Checkbox -->
        <view class="privacy-row">
          <view class="checkbox-area" @click="togglePrivacy">
            <view class="checkbox" :class="{ checked: isPrivacyChecked }">
              <uni-icons v-if="isPrivacyChecked" type="checkmarkempty" size="12" color="#fff" />
            </view>
          </view>
          <view class="privacy-text-wrapper">
            <text class="text-gray">登录即代表您同意</text>
            <text class="text-link" @click="openPrivacyContract">《用户协议》</text>
            <text class="text-gray">和</text>
            <text class="text-link" @click="openPrivacyContract">《隐私政策》</text>
          </view>
        </view>
      </view>

      <!-- Footer -->
      <view class="footer">
        <text class="cancel-text" @click="goBack">暂不登录</text>
      </view>
    </view>

    <!-- Privacy Modal Component Placeholder (Assuming it exists or handled by system) -->
    <!-- In UniApp/Wechat, we often use the system privacy popup or a custom one if needed -->
    <privacyModal ref="privacyModalRef" @privacyAuthorization="onPrivacyAuth"></privacyModal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { login } from '@/api/index'

const statusBarHeight = ref(20)
const isPrivacyChecked = ref(false)
const privacyModalRef = ref()

onLoad(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 20
    }
  })
})

const goBack = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const togglePrivacy = () => {
  isPrivacyChecked.value = !isPrivacyChecked.value
}

const handlePrivacyCheck = () => {
  if (!isPrivacyChecked.value) {
    // Shake animation or toast could be added here
    uni.showToast({ title: '请先阅读并同意隐私政策', icon: 'none' })
    // Open privacy modal if needed
    privacyModalRef.value?.openPrivacyModel?.()
  }
}

const onPrivacyAuth = (agreed: boolean) => {
  isPrivacyChecked.value = agreed
}

const openPrivacyContract = () => {
  uni.openPrivacyContract({
    success: () => { },
    fail: () => {
      uni.showToast({ title: '打开隐私协议失败', icon: 'none' })
    }
  })
}

const getPhoneNumber = (e: any) => {
  if (!isPrivacyChecked.value) {
    handlePrivacyCheck()
    return
  }

  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    const code = e.detail.code

    uni.showLoading({ title: '登录中...' })

    uni.login({
      success: (res) => {
        if (res.code) {
          const params = {
            sessionCode: res.code,
            phoneNumberCode: code
          }

          login(params).then((loginRes: any) => {
            // Success handling
            uni.hideLoading()
            uni.showToast({ title: '登录成功', icon: 'success' })

            // Save token if needed (commented out in original, assuming global store or logic)
            // authStore.login(loginRes.data) 

            setTimeout(() => {
              uni.reLaunch({ url: '/pages/index/index' })
            }, 1500)

          }).catch((err: any) => {
            uni.hideLoading()
            uni.showToast({ title: '登录失败，请重试', icon: 'none' })
            console.error('Login error:', err)
          })
        }
      },
      fail: () => {
        uni.hideLoading()
        uni.showToast({ title: '微信登录失败', icon: 'none' })
      }
    })
  } else {
    // User denied phone number
    console.log('User denied phone number')
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    padding-left: 20rpx;

    .back-btn {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 60rpx;
}

.logo-section {
  margin-top: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo-box {
    width: 160rpx;
    height: 160rpx;
    background: linear-gradient(135deg, #FD5B38 0%, #FF8F70 100%);
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    box-shadow: 0 10rpx 30rpx rgba(253, 91, 56, 0.2);

    .logo-img {
      width: 100rpx;
      height: 100rpx;
    }
  }

  .app-name {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .app-slogan {
    font-size: 28rpx;
    color: #999;
    letter-spacing: 2rpx;
  }
}

.action-section {
  width: 100%;
  margin-top: 160rpx;

  .btn-wrapper {
    position: relative;
    width: 100%;

    .login-btn {
      width: 100%;
      height: 100rpx;
      background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 32rpx;
      font-weight: 600;
      box-shadow: 0 10rpx 20rpx rgba(253, 91, 56, 0.3);
      border: none;

      .icon-wrapper {
        margin-right: 16rpx;
        display: flex;
      }

      &::after {
        border: none;
      }

      &.btn-hover {
        opacity: 0.9;
        transform: scale(0.98);
      }
    }

    .privacy-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      z-index: 10;
    }
  }

  .privacy-row {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 40rpx;

    .checkbox-area {
      padding: 10rpx;
      margin-right: 8rpx;
      margin-top: -6rpx; // Align visually

      .checkbox {
        width: 32rpx;
        height: 32rpx;
        border: 2rpx solid #ddd;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &.checked {
          background: #FD5B38;
          border-color: #FD5B38;
        }
      }
    }

    .privacy-text-wrapper {
      flex: 1;
      font-size: 24rpx;
      line-height: 1.5;

      .text-gray {
        color: #999;
      }

      .text-link {
        color: #FD5B38; // Brand link color
      }
    }
  }
}

.footer {
  margin-top: auto;
  padding-bottom: 80rpx;

  .cancel-text {
    font-size: 28rpx;
    color: #999;
    padding: 20rpx 40rpx;
  }
}
</style>
