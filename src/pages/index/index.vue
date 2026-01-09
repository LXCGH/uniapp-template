<template>
  <view class="home-container">
    <!-- Static Header Area (Fixed) -->
    <view class="static-header">
      <!-- Custom Navigation Bar -->
      <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
        <view class="nav-header">
          <text class="app-title">AI证件照</text>
          <text class="app-subtitle">智能制作专业证件照</text>
        </view>
      </view>

      <!-- Search Bar -->
      <view class="search-wrapper">
        <view class="search-box">
          <uni-icons type="search" size="18" color="#999" />
          <input class="search-input" type="text" placeholder="搜索尺寸名称，如 一寸、护士" placeholder-class="placeholder-style"
            v-model="searchQuery" confirm-type="search" />
        </view>
      </view>

      <!-- Banner Area (Fixed) -->
      <view class="banner-section" v-if="!searchQuery">
        <view class="banner-card">
          <view class="banner-text">
            <text class="banner-title">智能拍摄</text>
            <text class="banner-desc">一键生成 · 自动美颜</text>
            <view class="banner-btn" @click="handleShoot">
              <text>立即制作</text>
              <uni-icons type="arrowright" size="14" color="#fff" />
            </view>
          </view>
          <!-- Decoration Icon -->
          <view class="banner-decoration">
            <image
              src="https://7072-prod-6g78fa1tc0ccbc21-1328661334.tcb.qcloud.la/head-img.png?sign=e4aa3f548fee520f8a75e206f8b09b5c&t=1767864532"
              mode="widthFix" class="decoration-image" />
          </view>
        </view>
      </view>

      <!-- Category Tabs (Fixed)-->
      <view class="category-scroll-wrapper" v-if="!searchQuery">
        <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
          <view class="category-list">
            <view v-for="(cat, index) in categories" :key="cat.id" class="category-pill"
              :class="{ active: activeCat === cat.id }" @click="activeCat = cat.id">
              <text>{{ cat.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Divider/Header for List -->
      <view class="list-title-bar">
        <text class="section-title">{{ getCategoryName(activeCat) }}</text>
        <text class="section-more">共 {{ currentList.length }} 种规格</text>
      </view>
    </view>

    <!-- Bottom Scroll Area (List Only) -->
    <scroll-view class="bottom-scroll" scroll-y>
      <view class="specs-section">
        <view class="specs-grid">
          <view class="spec-card" v-for="item in currentList" :key="item.id" @click="goDetail(item)">
            <view class="spec-icon-box" :class="getRandomColorClass(item.id)">
              <text class="spec-abbr">{{ item.title.substring(0, 1) }}</text>
            </view>
            <view class="spec-info">
              <text class="spec-name">{{ item.title }}</text>
              <view class="spec-dims">
                <text class="dim-tag">{{ item.sizeMM }}</text>
              </view>
              <text class="spec-pixel">{{ item.pixel }}</text>
            </view>
            <view class="action-icon">
              <uni-icons type="arrowright" size="16" color="#ccc" />
            </view>
          </view>
        </view>
      </view>
      <!-- Bottom Safe Area -->
      <view class="safe-area-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const statusBarHeight = ref(20)
// Get system info for status bar height
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 20
  }
})

// Categories matches previous list but optimized UI
const categories = [
  { id: 'hot', name: '🔥 热门推荐' },
  { id: 'general', name: '📷 通用尺寸' },
  { id: 'job', name: '💼 职业资格' },
  { id: 'degree', name: '🎓 学历考试' },
  { id: 'medical', name: '🏥 医药卫生' },
  { id: 'gov', name: '🏛️ 公务员' },
  { id: 'lang', name: '🗣️ 语言考试' },
  { id: 'visa', name: '✈️ 旅游签证' },
  { id: 'arch', name: '🏗️ 建筑工程' },
  { id: 'custom', name: '✏️ 自定义' }
]

const activeCat = ref('hot')

const specMap: Record<string, Array<{ id: string; title: string; sizeMM: string; pixel: string }>> = {
  hot: [
    { id: '1inch', title: '一寸', sizeMM: '25×35mm', pixel: '295×413px' },
    { id: '2inch', title: '二寸', sizeMM: '35×49mm', pixel: '413×579px' },
    { id: 'cet', title: '英语四六级', sizeMM: '33×48mm', pixel: '390×567px' },
    { id: 'teacher', title: '教师资格证', sizeMM: '25×35mm', pixel: '295×413px' },
    { id: 'resume', title: '简历照', sizeMM: '35×45mm', pixel: '413×531px' },
    { id: 'visa_us', title: '美国签证', sizeMM: '51×51mm', pixel: '600×600px' },
  ],
  general: [
    { id: '1inch', title: '一寸', sizeMM: '25×35mm', pixel: '295×413px' },
    { id: 'small1', title: '小一寸', sizeMM: '22×32mm', pixel: '260×378px' },
    { id: 'large1', title: '大一寸', sizeMM: '33×48mm', pixel: '390×567px' },
    { id: '2inch', title: '二寸', sizeMM: '35×49mm', pixel: '413×579px' },
    { id: 'small2', title: '小二寸', sizeMM: '35×45mm', pixel: '413×531px' },
    { id: 'large2', title: '大二寸', sizeMM: '35×53mm', pixel: '413x626px' },
  ],
  medical: [
    { id: 'health', title: '健康证', sizeMM: '26×32mm', pixel: '358×441px' },
    { id: 'doctor', title: '执业医师', sizeMM: '35×45mm', pixel: '413×531px' },
    { id: 'nurse', title: '护士资格', sizeMM: '35×45mm', pixel: '413×531px' },
    { id: 'pharm', title: '执业药师', sizeMM: '25×35mm', pixel: '295×413px' },
  ],
  job: [
    { id: 'teacher', title: '教师资格证', sizeMM: '30×41mm', pixel: '360×480px' },
    { id: 'lawyer', title: '法律职业资格', sizeMM: '35×53mm', pixel: '413×626px' },
    { id: 'cpa', title: '注册会计师', sizeMM: '35×49mm', pixel: '413×579px' },
    { id: 'guide', title: '导游证', sizeMM: '25×35mm', pixel: '286×400px' },
  ],
  degree: [
    { id: 'cet', title: '四六级考试', sizeMM: '33×48mm', pixel: '390×567px' },
    { id: 'kaoyan', title: '研究生考试', sizeMM: '41×54mm', pixel: '480×640px' },
    { id: 'gaokao', title: '普通高考', sizeMM: '89×127mm', pixel: '1050×1499px' },
    { id: 'degree_cert', title: '学位证书', sizeMM: '33×48mm', pixel: '390×567px' },
  ],
  gov: [
    { id: 'guokao', title: '国家公务员', sizeMM: '35×45mm', pixel: '413×531px' },
    { id: 'shengkao', title: '各省公务员', sizeMM: '35×45mm', pixel: '413×531px' },
    { id: 'shiye', title: '事业单位', sizeMM: '35×45mm', pixel: '413×531px' },
  ],
  lang: [
    { id: 'putonghua', title: '普通话', sizeMM: '33×48mm', pixel: '390×567px' },
    { id: 'ielts', title: '雅思考试', sizeMM: '33×48mm', pixel: '390×567px' },
    { id: 'toefl', title: '托福考试', sizeMM: '35×45mm', pixel: '413×531px' },
  ],
  visa: [
    { id: 'us', title: '美国签证', sizeMM: '51×51mm', pixel: '600×600px' },
    { id: 'jp', title: '日本签证', sizeMM: '45×45mm', pixel: '531×531px' },
    { id: 'kr', title: '韩国签证', sizeMM: '35×45mm', pixel: '413×531px' },
    { id: 'eu', title: '申根签证', sizeMM: '35×45mm', pixel: '413×531px' },
  ],
  arch: [
    { id: 'construct', title: '建造师', sizeMM: '25×35mm', pixel: '295×413px' },
    { id: 'fire', title: '消防工程师', sizeMM: '35×49mm', pixel: '413×579px' },
  ],
  custom: [
    { id: 'custom', title: '自定义规格', sizeMM: '手动输入', pixel: '手动输入' }
  ]
}

const searchQuery = ref('')

const searchResults = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  const allSpecs = Object.values(specMap).flat()
  // Dedup by id
  const seen = new Set()
  const unique = []
  for (const item of allSpecs) {
    if (!seen.has(item.id)) {
      seen.add(item.id)
      if (item.title.toLowerCase().includes(query)) {
        unique.push(item)
      }
    }
  }
  return unique
})

const currentList = computed(() => {
  if (searchQuery.value) return searchResults.value
  return specMap[activeCat.value] || specMap['hot']
})

const getCategoryName = (id: string) => {
  if (searchQuery.value) return '搜索结果'
  return categories.find(c => c.id === id)?.name?.split(' ')?.[1] || '规格列表'
}

const getRandomColorClass = (id: string) => {
  const colors = ['bg-orange', 'bg-blue', 'bg-purple', 'bg-green']
  const index = id.charCodeAt(0) % colors.length
  return colors[index]
}

function handleShoot() {
  uni.navigateTo({ url: '/pages/shootingPage/index' })
}

function goDetail(item: any) {
  if (item.id === 'custom') {
    uni.navigateTo({ url: '/pages/customSize/index' })
  } else {
    uni.navigateTo({ url: `/pages/specifications/index?item=${JSON.stringify(item)}` })
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  background-color: #F6F7F9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.static-header {
  background: #fff;
  z-index: 10;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
}

.nav-bar {
  /* Removed fixed positioning to let it stack in static-header */
  background: #fff;
  padding-bottom: 20rpx;
}

.nav-header {
  height: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 32rpx;

  .app-title {
    font-size: 36rpx;
    font-weight: 800;
    color: #333;
    margin-bottom: 4rpx;
  }

  .app-subtitle {
    font-size: 22rpx;
    color: #999;
    letter-spacing: 2rpx;
  }
}

.search-wrapper {
  padding: 0 32rpx 24rpx 32rpx;
  background: #fff;

  .search-box {
    background: #f5f5f5;
    height: 72rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;

    .search-input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
      color: #333;
      margin-left: 12rpx;
    }
  }
}

:deep(.placeholder-style) {
  color: #999;
  font-size: 28rpx;
}

.banner-section {
  padding: 0 32rpx 24rpx 32rpx;
  background: #fff;
  border-bottom-left-radius: 40rpx; // Curve the white background
  border-bottom-right-radius: 40rpx;

  .banner-card {
    height: 280rpx;
    background: linear-gradient(135deg, #FD5B38 0%, #FF8F70 100%);
    border-radius: 32rpx;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    box-shadow: 0 10rpx 30rpx rgba(253, 91, 56, 0.3);

    .banner-text {
      position: relative;
      z-index: 2;
      flex: 1;

      .banner-title {
        font-size: 40rpx;
        color: #fff;
        font-weight: bold;
        display: block;
        margin-bottom: 12rpx;
      }

      .banner-desc {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.9);
        display: block;
        margin-bottom: 30rpx;
      }

      .banner-btn {
        display: inline-flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.25);
        border: 1rpx solid rgba(255, 255, 255, 0.4);
        padding: 10rpx 24rpx;
        border-radius: 40rpx;

        text {
          font-size: 24rpx;
          color: #fff;
          margin-right: 6rpx;
          font-weight: 500;
        }
      }
    }

    .decoration-image {
      position: absolute;
      right: 40rpx;
      width: 170rpx;
      height: 170rpx;
      z-index: 1;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.category-scroll-wrapper {
  padding: 0 0 24rpx 0;

  .category-scroll {
    white-space: nowrap;
    width: 100%;
  }

  .category-list {
    padding: 0 32rpx;
    display: flex;
  }

  .category-pill {
    display: inline-flex;
    padding: 12rpx 30rpx;
    background: #fff;
    border-radius: 30rpx;
    margin-right: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);

    text {
      font-size: 26rpx;
      color: #666;
    }

    &.active {
      background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);

      text {
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

.list-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 32rpx 24rpx 32rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }

  .section-more {
    font-size: 24rpx;
    color: #bbb;
  }
}

.bottom-scroll {
  flex: 1;
  height: 0;
  width: 100%;
  padding-top: 20rpx;
}

.specs-section {
  padding: 24rpx 32rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .section-more {
      font-size: 24rpx;
      color: #bbb;
    }
  }

  .spec-card {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.02);

    .spec-icon-box {
      width: 80rpx;
      height: 80rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;
      flex-shrink: 0;

      &.bg-orange {
        background: #FFF0EB;
        color: #FD5B38;
      }

      &.bg-blue {
        background: #EBF3FF;
        color: #2979FF;
      }

      &.bg-purple {
        background: #F3EBFF;
        color: #7B1FA2;
      }

      &.bg-green {
        background: #E8F5E9;
        color: #388E3C;
      }

      .spec-abbr {
        font-size: 32rpx;
        font-weight: bold;
      }
    }

    .spec-info {
      flex: 1;

      .spec-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
        display: block;
      }

      .spec-dims {
        display: flex;

        .dim-tag {
          font-size: 22rpx;
          color: #666;
          background: #F5F7FA;
          padding: 2rpx 10rpx;
          border-radius: 6rpx;
        }
      }

      .spec-pixel {
        font-size: 22rpx;
        color: #999;
        margin-top: 6rpx;
        display: block;
      }
    }

    .action-icon {
      margin-left: 10rpx;
    }
  }
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
