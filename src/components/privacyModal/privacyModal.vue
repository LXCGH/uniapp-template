<template>
  <view class="privacy" v-if="showPrivacy">
    <view class="content">
      <view class="title">隐私保护指引</view>
      <view class="des">
        在使用当前小程序服务之前，请仔细阅读<text class="link" @click="openPrivacyContract">{{
          privacyContractName
        }}</text
        >。为了完整体验，请您点击“同意”开始使用。
      </view>
      <view class="btns">
        <button class="item reject" @click="exitMiniProgram">拒绝</button>
        <button
          id="agree-btn"
          class="item agree"
          open-type="agreePrivacyAuthorization"
          @click="handleAgreePrivacyAuthorization"
        >
          同意
        </button>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, defineEmits, defineExpose } from "vue";
import { onPageShow } from "@dcloudio/uni-app";
const privacyContractName = ref("隐私保护指引");
const showPrivacy = ref(false);
onPageShow(() => {
  wx.getPrivacySetting({
    success(res: any) {
      if (res.needAuthorization) {
        privacyContractName.value = res.privacyContractName;
        showPrivacy.value = true;
      }
    },
  });
});

const openPrivacyModel = () => {
  showPrivacy.value = true;
};

defineExpose({
  openPrivacyModel,
});

const openPrivacyContract = () => {
  wx.openPrivacyContract({
    fail: () => {
      wx.showToast({
        title: "遇到错误",
        icon: "error",
      });
    },
  });
};

const emit = defineEmits(["privacyAuthorization"]);

// 拒绝隐私协议
const exitMiniProgram = () => {
  showPrivacy.value = false;
  emit("privacyAuthorization", false);
};
// 同意隐私协议
const handleAgreePrivacyAuthorization = () => {
  showPrivacy.value = false;
  emit("privacyAuthorization", true);
};
</script>
<style>
.privacy {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  width: 605rpx;
  padding: 48rpx;
  box-sizing: border-box;
  background: #fff;
  border-radius: 16rpx;
}

.content .title {
  text-align: center;
  color: #000;
  font-weight: 500;
  font-size: 32rpx;
}

.content .des {
  font-size: 26rpx;
  color: #000;
  margin-top: 40rpx;
  text-align: justify;
  line-height: 1.6;
}


.btns {
  margin-top: 48rpx;
  display: flex;
  justify-content: space-between;
}

.btns .item {
  justify-content: space-between;
  width: 220rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  box-sizing: border-box;
  border: none;
}

.btns .reject {
  background: #EDEDED;
  color: #666;
}
</style>
