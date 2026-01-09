<template>
  <view class="order-container">
    <!-- Custom Navigation Bar -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">我的订单</text>
      </view>
    </view>

    <!-- Content Area (Tabs + List) -->
    <view class="content-area" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }">
      <!-- Tabs -->
      <view class="tabs-wrapper" :style="{ top: (statusBarHeight + 44) + 'px' }">
        <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
          @click="switchTab(index)">
          <text class="tab-text">{{ tab.name }}</text>
          <view class="tab-line" v-if="currentTab === index"></view>
        </view>
      </view>

      <!-- Order List -->
      <scroll-view scroll-y class="order-list-scroll">
        <view v-if="filteredOrders.length === 0" class="empty-state">
          <image src="/static/images/empty-order.png" class="empty-img" mode="aspectFit" />
          <text class="empty-text">您还没有相关的订单</text>
          <button class="go-home-btn" @click="goHome">去首页逛逛</button>
        </view>

        <view v-else class="order-list">
          <view v-for="order in filteredOrders" :key="order.id" class="order-card">
            <view class="card-header">
              <view class="header-left">
                <text class="type-tag" :class="order.type">{{ order.type === 'digital' ? '电子照' : '冲印' }}</text>
                <text class="order-time">{{ order.date }}</text>
              </view>
              <text class="status-tag" :class="order.status">{{ getStatusText(order.status) }}</text>
            </view>

            <view class="card-body">
              <image :src="order.cover" class="product-img" mode="aspectFill" />
              <view class="product-info">
                <text class="product-name">{{ order.name }}</text>
                <text class="product-spec">规格：默认规格</text>
                <view class="price-row">
                  <text class="currency">¥</text>
                  <text class="amount">{{ order.price }}</text>
                </view>
              </view>
            </view>

            <view class="card-footer">
              <text class="total-label">共1件商品 合计:</text>
              <text class="total-price">¥{{ order.price }}</text>
              <view class="action-btn" :class="{ primary: order.status === 'pending' }"
                @click="handleOrderAction(order)">
                {{ order.status === 'pending' ? '立即支付' : '查看详情' }}
              </view>
            </view>
          </view>
        </view>
        <!-- Bottom safe area padding -->
        <view class="safe-area-bottom"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const statusBarHeight = ref(0)
const orders = ref<Order[]>([])
const currentTab = ref(0)

const tabs = [
  { name: '全部', value: 'all' },
  { name: '待支付', value: 'pending' },
  { name: '已完成', value: 'finished' }
]

interface Order {
  id: string
  name: string
  date: string
  price: number
  status: 'pending' | 'paid' | 'finished' | 'canceled'
  cover: string
  specs?: string
  type: 'digital' | 'print' // New field
}

// Mock initial data if empty
const initialOrders: Order[] = [
  {
    id: '202406010001',
    name: '商务形象照 - 职场精英系列',
    date: '2024-06-01 12:00',
    price: 9.9,
    status: 'paid',
    cover: '/static/images/order-demo.png',
    type: 'digital'
  },
  {
    id: '202406010002',
    name: '韩式证件照 - 智能精修',
    date: '2024-06-02 09:30',
    price: 19.9,
    status: 'pending',
    cover: '/static/images/order-demo.png',
    type: 'print'
  }
]

onShow(() => {
  // 1. Handle Tab Switching from other pages
  const target = uni.getStorageSync('order_tab_target')
  if (target) {
    const targetMap: Record<string, number> = { 'all': 0, 'pending': 1, 'processing': 1, 'finished': 2 }
    if (targetMap[target] !== undefined) currentTab.value = targetMap[target]
    uni.removeStorageSync('order_tab_target')
  }

  // 2. Load Orders from Storage
  const storedOrders = uni.getStorageSync('my_orders')
  if (storedOrders) {
    orders.value = JSON.parse(storedOrders)
  } else {
    orders.value = [...initialOrders]
    uni.setStorageSync('my_orders', JSON.stringify(orders.value))
  }

  // 3. Check for New Order just created
  const newOrder = uni.getStorageSync('latest_new_order')
  if (newOrder) {
    try {
      const order = JSON.parse(newOrder)
      // Check if already exists to avoid dupes
      if (!orders.value.find(o => o.id === order.id)) {
        orders.value.unshift(order)
        uni.setStorageSync('my_orders', JSON.stringify(orders.value))
      }
      uni.removeStorageSync('latest_new_order')
      currentTab.value = 1 // Switch to pending/paid tab
    } catch (e) {
      console.error('Failed to parse new order', e)
    }
  }
})

// Get system info for status bar height
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 20
  }
})

const filteredOrders = computed(() => {
  const status = tabs[currentTab.value].value
  if (status === 'all') return orders.value
  return orders.value.filter(o => o.status === status)
})

function switchTab(index: number) {
  currentTab.value = index
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    pending: '待支付',
    paid: '已支付', // We treat 'paid' as "Processing" effectively in UI
    finished: '已完成',
    canceled: '已取消'
  }
  return map[status] || status
}

function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}

function handleOrderAction(order: Order) {
  if (order.status === 'pending') {
    // If we had a designated "Pay Page" for existing orders, we go there.
    // For now, let's just go to detail where maybe they can pay (future).
    // Or restart the create flow? 
    // Let keeps it simple: Go to Detail.
    uni.navigateTo({ url: `/pages/order/detail?id=${order.id}` })
  } else {
    uni.navigateTo({ url: `/pages/order/detail?id=${order.id}` })
  }
}
</script>

<style lang="scss" scoped>
.order-container {
  min-height: 100vh;
  background-color: #F6F7F9;
  display: flex;
  flex-direction: column;
}

/* Custom Navigation Bar */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #ffffff;
  /* Glassmorphism support if needed, but white is cleaner for this style */

  .nav-content {
    height: 44px;
    /* Standard nav bar height */
    display: flex;
    align-items: center;
    padding-left: 32rpx;
  }

  .nav-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1A1A1A;
  }
}

.content-area {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Tabs */
.tabs-wrapper {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 0 10rpx;
  position: sticky;
  /* Top value needs to be dynamic in production but for now relative to content flow */
  z-index: 99;
}

.tab-item {
  flex: 1;
  height: 88rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .tab-text {
    font-size: 28rpx;
    color: #666;
    transition: all 0.3s;
  }

  &.active .tab-text {
    color: #FD5B38;
    /* Brand Color */
    font-weight: 600;
    font-size: 30rpx;
  }

  .tab-line {
    position: absolute;
    bottom: 10rpx;
    width: 40rpx;
    height: 6rpx;
    background: linear-gradient(90deg, #FD5B38, #FF8F70);
    border-radius: 4rpx;
  }
}

/* Order List */
.order-list-scroll {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
}

.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.03);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  margin-bottom: 24rpx;

  .header-left {
    display: flex;
    align-items: center;

    .type-tag {
      font-size: 20rpx;
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      margin-right: 12rpx;
      font-weight: 500;

      &.digital {
        color: #2979FF;
        background: rgba(41, 121, 255, 0.1);
        border: 1rpx solid rgba(41, 121, 255, 0.2);
      }

      &.print {
        color: #FD5B38;
        background: rgba(253, 91, 56, 0.1);
        border: 1rpx solid rgba(253, 91, 56, 0.2);
      }
    }
  }

  .order-time {
    color: #999;
    font-size: 24rpx;
  }

  .status-tag {
    font-size: 26rpx;
    font-weight: 500;

    &.pending {
      color: #FD5B38;
    }

    &.paid {
      color: #2979FF;
    }

    &.finished {
      color: #00C853;
    }

    &.canceled {
      color: #999;
    }
  }
}

.card-body {
  display: flex;
  margin-bottom: 24rpx;

  .product-img {
    width: 140rpx;
    height: 140rpx;
    border-radius: 12rpx;
    background: #f0f0f0;
    margin-right: 24rpx;
    flex-shrink: 0;
  }

  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .product-name {
      font-size: 30rpx;
      color: #333;
      line-height: 1.4;
      font-weight: 500;
      /* Limit lines */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-spec {
      font-size: 24rpx;
      color: #999;
      background: #F7F8FA;
      align-self: flex-start;
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
    }

    .price-row {
      display: flex;
      align-items: baseline;
      color: #333;

      .currency {
        font-size: 24rpx;
        margin-right: 4rpx;
      }

      .amount {
        font-size: 32rpx;
        font-weight: 600;
      }
    }
  }
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .total-label {
    font-size: 24rpx;
    color: #666;
    margin-right: 8rpx;
  }

  .total-price {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-right: 24rpx;
  }

  .action-btn {
    padding: 12rpx 32rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    border: 1rpx solid #ddd;
    color: #666;
    background: #fff;
    transition: all 0.2s;

    &:active {
      opacity: 0.8;
    }

    &.primary {
      background: linear-gradient(90deg, #FD5B38, #FF8F70);
      color: #fff;
      border: none;
      box-shadow: 0 4rpx 12rpx rgba(253, 91, 56, 0.2);
    }
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;

  .empty-img {
    width: 320rpx;
    height: 320rpx;
    margin-bottom: 40rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 60rpx;
  }

  .go-home-btn {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #FD5B38;
    background: rgba(255, 255, 255, 0);
    border: 2rpx solid #FD5B38;

    &:after {
      border: none;
    }
  }
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
}
</style>