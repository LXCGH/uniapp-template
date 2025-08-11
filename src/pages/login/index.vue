<template>
  <view class="login-page">
    <view class="header relative">
      <view :style="{
        top: `${pageHeader.statusBarHeight + pageHeader.buttonMargin}px`,
      }" class="flex fixed left-0 w-full z-30">
        <view @click="goBack" class="skip-btn">跳过</view>
      </view>
    </view>
    <view class="fixed z-40 mx-auto header-control w-full" :style="{ top: `${pageHeader.navHeight}px` }">
      <view class="mt-[300rpx] w-[670rpx] ml-auto mr-auto">
        <view class="relative">
          <button class="mb-[40rpx] login-button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            登录
          </button>
          <view v-if="!checked2" class="absolute left-0 top-0 w-full h-full !bg-transparent !border-0"
            @click="loginCheck"></view>
        </view>
        <view class="mb-[60rpx]">
          <view class="flex justify-start items-center">
            <checkbox-group @change="changeFn2">
              <checkbox class="mr-[12rpx]" value="cb2" :checked="checked2" color="#FFCC33"
                style="transform: scale(1)" />
            </checkbox-group>
            <view class="text-[24rpx] leading-[24rpx] text-[#000]">我已阅读并确认同意<text class="privacy-link"
                @click="handleOpenPrivacyContract">《用户隐私保护指引》</text></view>
          </view>
        </view>
      </view>
    </view>
    <privacyModal @privacyAuthorization="privacyAuthorization" ref="privacyModalRef"></privacyModal>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { login } from "@/api/index";
const pageHeader = ref({
  navHeight: "",
  statusBarHeight: 0, // 状态栏高度
  buttonMargin: 0,
});

const queryData = ref<{ shareCode: string; nickname?: string }>({
  shareCode: "",
  nickname: "",
});
onLoad((option) => {
  queryData.value = option as any;
  let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  const { top, height } = menuButtonInfo;
  uni.getSystemInfo({
    success: (res) => {
      const { statusBarHeight } = res as any;
      const margin = top - statusBarHeight;
      pageHeader.value.navHeight = height + statusBarHeight + margin * 2;
      pageHeader.value.statusBarHeight = statusBarHeight;
      pageHeader.value.buttonMargin = margin;
    },
  });
});

const checked2 = ref(false);

const changeFn2 = (e: any) => {
  console.log(e);
  checked2.value = e.detail.value.includes("cb2");
};

const getPhoneNumber = (res: { detail: { code: string } }) => {
  console.log(res, "res");
  const code = res.detail.code;
  uni.login({
    success: (res) => {
      if (res.code) {
        let reqData = {
          sessionCode: res.code,
          phoneNumberCode: code,
        };
        login(reqData)
          .then(async (res) => {
            console.log(res, "res登录返回数据");
            // uni.setStorageSync("token",
            //   res.data.data.accessToken
            // );
            uni.reLaunch({
              url: "/pages/index/index",
            });
          })
          .catch((err) => {
            console.log(err, "err");
          });
      } else {
        console.log("获取失败！" + res.errMsg);
      }
    },
  });
};

const handleOpenPrivacyContract = () => {
  uni.openPrivacyContract({
    success: () => { }, // 打开成功
    fail: () => { }, // 打开失败
    complete: () => { },
  });
};

const privacyAuthorization = (sign: boolean) => {
  console.log(sign, "用户是否同意隐私协议");
  checked2.value = sign;
};

const privacyModalRef = ref();
const loginCheck = () => {
  privacyModalRef.value.openPrivacyModel();
};

const goBack = () => {
  console.log("goBack");
  uni.setStorageSync("disagree", true);
  uni.switchTab({
    url: "/pages/index/index",
  });
};
</script>

<style lang="scss">
.header {
  width: 100%;
}

.title {
  margin-top: 16rpx;
  text-align: center;
  color: #494c4d;
  font-family: "PingFang SC";
  font-size: 40rpx;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.6rpx;
}

.grey {
  border-radius: 28rpx;
  background: rgba(230, 237, 245, 1);
  box-shadow: none;
  border: 2rpx solid rgba(230, 237, 245, 1);
}

.user-phone-btn {
  border-radius: 0;
}

.user-phone-btn::after {
  border-radius: 0;
}

.skip-btn {
  margin-left: 32rpx;
  width: 112rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background: #e9e9e9;
  color: #666;
  text-align: center;
  font-family: "PingFang SC";
  font-size: 30rpx;
  text-align: center;
  font-weight: 400;
  line-height: 50rpx;
  letter-spacing: -0.6rpx;
}
</style>
