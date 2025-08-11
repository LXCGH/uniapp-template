<template>
  <view class="workplace-page">
    <!-- 合并的Banner和公告轮播 -->
    <view class="workplace-banner">
      <swiper class="swiper-container" :indicator-dots="totalItems > 1" :autoplay="true" :interval="4000"
        :duration="500" circular indicator-color="rgba(255,255,255,0.3)" indicator-active-color="#fff">
        <!-- Banner页面 -->
        <swiper-item>
          <view class="banner-item">
            <image class="banner-bg" src="/static/images/new/index-header.png" mode="aspectFill" />
            <view class="banner-content rounded-2xl shadow-xl relative overflow-hidden">
              <view class="absolute inset-0 bg-gradient-to-br p-4 from-blue-600/80 via-blue-500/70 to-blue-700/80">
                <view class="banner-title">打造高效组织</view>
                <view class="banner-subtitle">从工作台开始</view>
                <view class="banner-desc">Build an Effective Team with Workplace</view>
              </view>
            </view>
          </view>
        </swiper-item>

        <!-- 公告页面 -->
        <swiper-item v-for="item in announcements" :key="item.id" @click="viewAnnouncementDetail(item)">
          <view class="announcement-item">
            <view class="announcement-content">
              <view class="announcement-header">
                <view class="announcement-icon">
                  <text class="icon-text">📢</text>
                </view>
                <view class="announcement-title">{{ item.title }}</view>
                <view class="announcement-date">{{ formatDate(item.created_at) }}</view>
              </view>
              <view class="announcement-body">
                <text class="announcement-text">{{ item.content }}</text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 2x2 卡片宫格 -->
    <view class="workplace-grid">
      <view v-for="item in modules" :key="item.name" class="workplace-card" @click="onModuleClick(item)">
        <view class="card-icon-wrapper rounded-[20rpx] w-10 h-10 bg-blue-500 flex justify-center items-center mb-2">
          <image :src="item.icon" class="card-icon" mode="aspectFit" />
        </view>
        <view class="card-title">{{ item.label }}</view>
        <view class="card-desc">{{ item.desc }}</view>
      </view>
    </view>

    <!-- 平台介绍 -->
    <view class="workplace-intro">
      <view class="intro-title">智能化工作管理平台</view>
      <view class="intro-desc"> 集成人员管理、考勤统计、数据分析和消息通知功能，为您的团队提供一站式的高效办公解决方案。 </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// import {  } from "@/api";
import { onShow } from "@dcloudio/uni-app";
import { ref, computed } from "vue";

// 公告数据
const announcements = ref<any[]>([]);

// 计算总轮播项数（banner + 公告）
const totalItems = computed(() => {
  return 1 + announcements.value.length; // 1个banner + 公告数量
});

const modules = [
  {
    name: "user",
    label: "人员管理",
    desc: "团队成员信息管理",
    icon: "/static/images/new/users.png",
    url: "/pages/user/index",
  },
  {
    name: "leave",
    label: "假勤",
    desc: "考勤与请假管理",
    icon: "/static/images/new/leave.png",
    url: "/pages/leaveAbsence/index",
  },
  {
    name: "stat",
    label: "统计",
    desc: "数据分析与报表",
    icon: "/static/images/new/statistics.png",
    url: "/pages/statistics/index",
  },
  {
    name: "notice",
    label: "公告",
    desc: "消息通知与公告",
    icon: "/static/images/new/notice.png",
    url: "/pages/announcement/index",
  },
];

// 获取最新公告
const getAnnouncements = async () => {
  // try {
  //   const res = (await announcementsActive({ page: 1, page_size: 999 })) as any;
  //   console.log(res, "res======~~~~~~~~~");
  //   if (res.data && res?.data?.results.length > 0) {
  //     announcements.value = res.data.results;
  //   }
  // } catch (error) {
  //   console.error("获取公告失败:", error);
  // }
};

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "昨天";
  } else if (diffDays === 0) {
    return "今天";
  } else if (diffDays <= 7) {
    return `${diffDays}天前`;
  } else {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }
};

// 查看公告详情
const viewAnnouncementDetail = (item: any) => {
  uni.navigateTo({
    url: `/pages/announcementDetail/index?id=${item.id}`,
  });
};

function onModuleClick(item: any) {
  if (item.url) {
    uni.navigateTo({ url: item.url });
  }
}
const timer = ref<any>(null);
onShow(() => {
  // 每次显示页面时刷新公告
  getAnnouncements();

  if (timer.value) {
    clearTimeout(timer.value);
  }
  timer.value = setTimeout(() => {
    getAnnouncements();
  }, 3000);

  return () => {
    clearTimeout(timer.value);
  };
});
</script>

<style lang="scss" scoped>
.workplace-page {
  height: 100vh;
  background: #f7f8fa;
  padding-bottom: 40rpx;
  overflow: auto;
}

.workplace-banner {
  margin: 32rpx 24rpx 0 24rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

  .swiper-container {
    height: 250rpx;
  }
}

// Banner样式
.banner-item {
  height: 100%;
  position: relative;

  .banner-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .banner-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 40rpx 32rpx 0 32rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    z-index: 2;
    text-align: center;

    .banner-title {
      margin-top: 20rpx;
      color: #fff;
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .banner-subtitle {
      color: #fff;
      font-size: 30rpx;
      margin-bottom: 10rpx;
    }

    .banner-desc {
      color: #e0f7fa;
      font-size: 24rpx;
      margin-bottom: 32rpx;
    }
  }
}

// 公告样式
.announcement-item {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
  }

  .announcement-content {
    height: 100%;
    padding: 32rpx 24rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }

  .announcement-header {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;

    .announcement-icon {
      margin-right: 12rpx;

      .icon-text {
        font-size: 24rpx;
      }
    }

    .announcement-title {
      flex: 1;
      color: #fff;
      font-size: 32rpx;
      font-weight: 600;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .announcement-date {
      color: rgba(255, 255, 255, 0.8);
      font-size: 22rpx;
      margin-left: 12rpx;
    }
  }

  .announcement-body {
    .announcement-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 26rpx;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
}

.workplace-grid {
  margin: 40rpx 24rpx 0 24rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32rpx;
}

.workplace-card {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx #f0f1f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 32rpx 0;

  .card-icon {
    width: 40rpx;
    height: 40rpx;
  }

  .card-title {
    font-size: 30rpx;
    color: #222;
    font-weight: 500;
    margin-bottom: 8rpx;
  }

  .card-desc {
    font-size: 22rpx;
    color: #888;
  }
}

.workplace-intro {
  margin: 48rpx 24rpx 0 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 24rpx;
  text-align: center;

  .intro-title {
    font-size: 28rpx;
    color: #222;
    font-weight: bold;
    margin-bottom: 12rpx;
  }

  .intro-desc {
    font-size: 22rpx;
    color: #888;
    line-height: 1.6;
  }
}
</style>
