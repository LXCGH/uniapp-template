<template>
  <view class="order-page">
    <view class="order-header">
      <text class="order-title">我的订单</text>
    </view>
    <view v-if="orders.length === 0" class="order-empty">
      <image src="/static/images/empty-order.png" class="empty-img" mode="aspectFit" />
      <text class="empty-text">暂无订单</text>
    </view>
    <view v-else class="order-list">
      <view v-for="order in orders" :key="order.id" class="order-item">
        <view class="order-info">
          <text class="order-id">订单号：{{ order.id }}</text>
          <text class="order-status">{{ getStatusText(order.status) }}</text>
        </view>
        <view class="order-detail">
          <image :src="order.cover" class="order-cover" mode="aspectFill" />
          <view class="order-meta">
            <text class="order-name">{{ order.name }}</text>
            <text class="order-date">{{ order.date }}</text>
            <text class="order-price">￥{{ order.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Order {
  id: string
  name: string
  date: string
  price: number
  status: string
  cover: string
}

const orders = ref<Order[]>([
  // 示例数据，可替换为接口获取
  {
    id: '202406010001',
    name: 'AI照片生成',
    date: '2024-06-01 12:00',
    price: 9.9,
    status: 'paid',
    cover: '/static/images/order-demo.png'
  },
  {
    id: '202406010002',
    name: '证件照生成',
    date: '2024-06-02 09:30',
    price: 19.9,
    status: 'pending',
    cover: '/static/images/order-demo.png'
  }
])

function getStatusText(status: string) {
  switch (status) {
    case 'paid':
      return '已支付'
    case 'pending':
      return '待支付'
    case 'finished':
      return '已完成'
    case 'canceled':
      return '已取消'
    default:
      return '未知状态'
  }
}
</script>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
  background: #f7f7f7;
  padding-bottom: 40rpx;
}
.order-header {
  background: #dd4238;
  padding: 60rpx 0 40rpx 0;
  text-align: center;
}
.order-title {
  color: #fff;
  font-size: 40rpx;
  font-weight: bold;
}
.order-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120rpx;
  .empty-img {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 30rpx;
  }
  .empty-text {
    color: #999;
    font-size: 32rpx;
  }
}
.order-list {
  margin: 30rpx 24rpx 0 24rpx;
}     
.order-item {
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
  padding: 30rpx 24rpx;
}
.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
  .order-id {
    color: #999;
    font-size: 26rpx;
  }
  .order-status {
    color: #dd4238;
    font-size: 28rpx;
    font-weight: 500;
  }
}
.order-detail {
  display: flex;
  align-items: center;
  .order-cover {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    background: #f2f2f2;
  }
  .order-meta {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 120rpx;
    .order-name {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 10rpx;
    }
    .order-date {
      font-size: 26rpx;
      color: #bbb;
      margin-bottom: 10rpx;
    }
    .order-price {
      font-size: 30rpx;
      color: #dd4238;
      font-weight: bold;
    }
  }
}
</style>