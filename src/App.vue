<script setup lang="ts">
import {
  onLaunch,
  onShow,
  onHide,
  onShareAppMessage,
  onShareTimeline,
} from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
  // uni.setInnerAudioOption({
  //   mixWithOther: false,
  //   obeyMuteSwitch: false,
  // });
  autoUpdate();
});

function autoUpdate() {
  // 获取小程序更新机制兼容
  if (uni.canIUse("getUpdateManager")) {
    const updateManager = uni.getUpdateManager();
    //1. 检查小程序是否有新版本发布
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //检测到新版本，需要更新，给出提示
        uni.showModal({
          title: "更新提示",
          content: "检测到新版本，是否下载新版本并重启小程序？",
          success: function (res) {
            if (res.confirm) {
              //2. 用户确定下载更新小程序，小程序下载及更新静默进行
              downLoadAndUpdate(updateManager);
            } else if (res.cancel) {
              //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
              uni.showModal({
                title: "温馨提示~",
                content:
                  "本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~",
                showCancel: false, //隐藏取消按钮
                confirmText: "确定更新", //只保留确定更新按钮
                success: function (res) {
                  if (res.confirm) {
                    //下载新版本，并重新应用
                    downLoadAndUpdate(updateManager);
                  }
                },
              });
            }
          },
        });
      }
    });
  } else {
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    uni.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
    });
  }
}
/**
 * 下载小程序新版本并重启应用
 */
function downLoadAndUpdate(updateManager: any) {
  uni.showLoading();
  //静默下载更新小程序新版本
  updateManager.onUpdateReady(function () {
    uni.hideLoading();
    //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    updateManager.applyUpdate();
  });
  updateManager.onUpdateFailed(function () {
    // 新的版本下载失败
    uni.showModal({
      title: "已经有新版本了哟~",
      content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
    });
  });
}

onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});

onShareAppMessage(function () {
  return {};
});
onShareTimeline(function () {
  return {};
});
</script>
<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

body,
html {
  width: 100%;
  font-family: "Source Han Sans SC";
  background: #f7f7f7 !important;
}

page {
  width: 100%;
  height: auto !important;
  background: #f7f7f7 !important;
}

button::after {
  border: none;
}

/* uni-app中的条件判断语句 */
/* #ifdef APP-PLUS  || H5 */
uni-swiper .uni-swiper-dot {
  width: 12rpx;
  height: 12rpx;
}
uni-swiper .uni-swiper-dot-active {
  width: 16rpx;
  border-radius: 16rpx;
}
/* #endif */

/* #ifdef MP-WEIXIN */
wx-swiper .wx-swiper-dot {
  width: 12rpx;
  height: 12rpx;
}

wx-swiper .wx-swiper-dot-active {
  width: 16rpx;
  height: 16rpx;
}
/* #endif */

.placeholder-input{
  color: #999;
  font-family: "PingFang SC";
  font-size: 28rpx;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
