<template>
  <view class="container account-comp">
    <view class="user-container" @click="goUserInfoDetail">
      <view v-if="token" class="flex items-center">
        <view class="avatar-container">
          <image v-if="userInfo?.employee?.avatar_url" :src="userInfo?.employee?.avatar_url" class="avatar" mode="aspectFill" />
          <view v-else class="avatar flex items-center justify-center text-xs text-gray-500">暂无头像</view>
        </view>
        <view class="info-container">
          <view class="name-container">
            <text class="nickname">{{ userInfo?.employee?.name || userInfo?.first_name || userInfo?.last_name || userInfo?.username }}</text>
            <image v-if="userInfo?.gender" class="gender-icon" :src="genderIconPath" />
          </view>
          <text class="birthday" v-if="userInfo?.birthdate"> 孩子生日：{{ userInfo?.birthdate }} </text>
        </view>
      </view>
      <image v-if="token" class="arrow" src="/static/images/app/right-arrow.png" />
      <view v-else class="mt-4 not-login" @click="goUserInfoDetail()">
        <view class="image">
          <image class="gender-icon" src="/static/images/app/oa_tabs/account-active.png" />
        </view>
        <view class="login-button">登录/注册</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useUserInfoStore } from "@/store/userInfoStore";
import { wechatUserInfo } from "@/api/index";

const userStore = useUserInfoStore();
const userInfo = computed(() => userStore.userInfo);

const genderIconPath = computed(() => {
  if (!userInfo.value?.gender) return "";
  return userInfo.value.gender === 1 ? "/static/images/app/male_icon.png" : "/static/images/app/female_icon.png";
});

const goUserInfoDetail = () => {
  const token = uni.getStorageSync("token");
  if (token) {
    uni.navigateTo({
      url: "/pages/personalEdit/index",
    });
  } else {
    uni.reLaunch({
      url: "/pages/login/index",
    });
  }
};

const token = ref("");

onShow(async () => {
  token.value = uni.getStorageSync("token");
  try {
    const { data: res } = (await wechatUserInfo()) as any;
    console.log("wechatUserInfo", res);
    userStore.setUserInfo(res);
  } catch (error) {
    console.error("数据获取失败:", error);
  }
});
</script>

<style lang="scss" scoped>
.user-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar-container {
  width: 120rpx;
  height: 120rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: #ccc;
}

.info-container {
  flex: 1;
  margin-left: 24rpx;
}

.name-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.nickname {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
  max-width: 440rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gender-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 20rpx;
}

.birthday {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.arrow {
  width: 12rpx;
  height: 20rpx;
}

.not-login {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .image {
    height: 120rpx;
    width: 120rpx;
    border-radius: 60rpx;
    margin-right: 24rpx;
    background: #fff;
    margin-left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      height: 60rpx;
      width: 60rpx;
      border-radius: 60rpx;
      margin-left: 0;
    }
  }
}
</style>
