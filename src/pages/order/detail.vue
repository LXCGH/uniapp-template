<template>
    <view class="detail-page">
        <!-- Custom Nav -->
        <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
            <view class="nav-content">
                <view class="back-btn" @click="goBack">
                    <image src="/static/images/left-back.png" mode="aspectFit" class="back-icon" />
                </view>
                <text class="title">订单详情</text>
            </view>
        </view>

        <view class="content-body" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }" v-if="order">
            <!-- Status Header -->
            <view class="status-header">
                <view class="status-box">
                    <uni-icons
                        :type="order.status === 'finished' || order.status === 'paid' ? 'checkbox-filled' : 'info-filled'"
                        size="40"
                        :color="order.status === 'finished' || order.status === 'paid' ? '#07C160' : '#FD5B38'" />
                    <view class="status-text">
                        <text class="main">{{ getStatusText(order.status) }}</text>
                        <text class="sub" v-if="order.type === 'digital'">高清原图已保存至云端</text>
                        <text class="sub" v-if="order.type === 'print' && order.status === 'paid'">正在制作中，请耐心等待发货</text>
                    </view>
                </view>
            </view>

            <!-- Logistics Card (Only for Print) -->
            <view class="card logistics-card"
                v-if="order.type === 'print' && (order.status === 'paid' || order.status === 'finished')">
                <view class="card-title row-between">
                    <view class="title-left">
                        <uni-icons type="truck" size="20" color="#333" />
                        <text>物流信息</text>
                    </view>
                    <view class="refresh-btn" @click="handleRefreshLogistics">
                        <uni-icons type="refresh" size="14" color="#666" />
                        <text>刷新物流</text>
                    </view>
                </view>
                <view class="logistics-info">
                    <text class="label">顺丰速运</text>
                    <text class="number">{{ order.trackingNumber || '暂无单号' }}</text>
                    <text class="copy-btn" v-if="order.trackingNumber"
                        @click="handleCopyTracking(order.trackingNumber)">复制</text>
                </view>
                <text class="tip" v-if="order.trackingNumber">复制单号可前往快递查询网站查询</text>
                <text class="tip" v-else>正在等待仓库发货，请稍后刷新...</text>
            </view>

            <!-- Product Card -->
            <view class="card product-card">
                <image :src="order.cover" class="thumb-img" mode="aspectFill" />
                <view class="prod-info">
                    <text class="prod-name">{{ order.name }}</text>
                    <view class="tags">
                        <text class="tag" :class="order.type">{{ order.type === 'digital' ? '电子版' : '冲印版' }}</text>
                        <text class="tag spec" v-if="order.specs">{{ order.specs }}</text>
                    </view>
                    <text class="prod-price">¥{{ order.price }}</text>
                </view>
            </view>

            <!-- Address information (Only for Print) -->
            <view class="card address-card" v-if="order.type === 'print'">
                <view class="card-title">
                    <uni-icons type="location" size="20" color="#333" />
                    <text>收货信息</text>
                </view>
                <view class="address-box">
                    <view class="user-row">
                        <text class="name">张三</text>
                        <text class="phone">138****8888</text>
                    </view>
                    <text class="addr-text">北京市朝阳区高科技园区88号楼</text>
                </view>
            </view>

            <!-- Order Info -->
            <view class="card info-card">
                <view class="row">
                    <text class="label">订单编号</text>
                    <text class="value">{{ order.id }}</text>
                    <text class="copy-small" @click="handleCopyTracking(order.id)">复制</text>
                </view>
                <view class="row">
                    <text class="label">下单时间</text>
                    <text class="value">{{ order.date }}</text>
                </view>
            </view>
        </view>

        <!-- Loading State -->
        <view class="loading-state" v-else>
            <text>加载中...</text>
        </view>

        <!-- Bottom Action Bar -->
        <view class="bottom-bar safe-area-bottom" v-if="order">
            <!-- Digital Actions -->
            <block v-if="order.type === 'digital'">
                <button class="btn secondary" @click="handleToPrint">去冲印</button>
                <button class="btn primary" @click="handleDownload">下载原图</button>
            </block>

            <!-- Print Actions -->
            <block v-if="order.type === 'print'">
                <button class="btn secondary" @click="handleDownload">下载电子照</button>
                <button class="btn" @click="handleContact">联系客服</button>
            </block>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const statusBarHeight = ref(20)
const order = ref<any>(null)

onLoad((options: any) => {
    uni.getSystemInfo({ success: res => statusBarHeight.value = res.statusBarHeight || 20 })
    if (options.id) {
        loadOrder(options.id)
    }
})

const goBack = () => uni.navigateBack()

const loadOrder = (id: string) => {
    // Determine source mock list
    const stored = uni.getStorageSync('my_orders')
    if (stored) {
        const list = JSON.parse(stored)
        let found = list.find((o: any) => o.id === id)

        if (found) {
            // Hot-fix for legacy data (missing type)
            if (!found.type) {
                // Infer type from ID or Name or default
                if (found.name && found.name.includes('冲印')) {
                    found.type = 'print'
                } else if (found.id === '202406010002') {
                    found.type = 'print'
                } else {
                    found.type = 'digital'
                }
            }
            // Ensure trackingNumber fallback
            if (found.type === 'print' && found.trackingNumber === undefined) {
                found.trackingNumber = ''
            }

            order.value = found
            return
        }
    }

    // Fallback to initial mock check
    if (id.startsWith('2024')) {
        order.value = {
            id: id,
            name: id.endsWith('01') ? '商务形象照' : '韩式证件照',
            date: '2024-06-01 12:00',
            price: 9.9,
            status: 'paid',
            cover: '/static/images/order-demo.png',
            type: id.endsWith('02') ? 'print' : 'digital',
            specs: id.endsWith('02') ? '6寸相纸x1' : '高清电子版',
            trackingNumber: '' // Initially empty for demo
        }
        return
    }

    // Absolute Fallback
    order.value = {
        id: id || 'DEMO',
        name: '演示订单',
        date: new Date().toLocaleString(),
        price: 0.00,
        status: 'paid',
        cover: '/static/images/order-demo.png',
        type: 'digital',
        specs: '演示数据'
    }
}

const handleRefreshLogistics = () => {
    uni.showLoading({ title: '查询中...' })
    setTimeout(() => {
        uni.hideLoading()
        if (order.value.type === 'print') {
            // Simulate fetching number from backend
            order.value.trackingNumber = 'SF' + order.value.id.substring(3) + '888'
            uni.showToast({ title: '物流信息已更新', icon: 'success' })
        }
    }, 1000)
}

const getStatusText = (s: string) => {
    const map: any = { pending: '待支付', paid: '已支付', finished: '已完成', canceled: '已取消' }
    return map[s] || s
}

const handleCopyTracking = (txt: string) => {
    uni.setClipboardData({
        data: txt,
        success: () => uni.showToast({ title: '复制成功', icon: 'none' })
    })
}

const handleDownload = () => {
    uni.showLoading({ title: '保存中...' })
    if (!order.value?.cover) return

    setTimeout(() => {
        uni.hideLoading()
        uni.saveImageToPhotosAlbum({
            filePath: order.value.cover, // In real app, use order.downloadUrl
            success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
            fail: () => uni.showToast({ title: '保存失败', icon: 'none' })
        })
    }, 1000)
}

const handleToPrint = () => {
    // Go to create page with this image
    const safe = encodeURIComponent(order.value.cover)
    uni.navigateTo({
        url: `/pages/order/create?image=${safe}`
    })
}

const handleContact = () => {
    uni.showToast({ title: '客服功能暂未开放', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.detail-page {
    min-height: 100vh;
    background: #F6F7F9;
    padding-bottom: 120rpx;
}

.nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #fff;

    .nav-content {
        height: 44px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;

        .back-btn {
            position: absolute;
            left: 20rpx;
            top: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;

            .back-icon {
                width: 32rpx;
                height: 32rpx;
            }
        }

        .title {
            font-weight: bold;
            font-size: 32rpx;
            color: #333;
        }
    }
}

.content-body {
    padding: 24rpx;
}

.status-header {
    background: #fff;
    padding: 40rpx;
    border-radius: 20rpx;
    margin-bottom: 24rpx;

    .status-box {
        display: flex;
        align-items: center;

        .status-text {
            margin-left: 24rpx;
            display: flex;
            flex-direction: column;

            .main {
                font-size: 36rpx;
                font-weight: bold;
                color: #333;
                margin-bottom: 8rpx;
            }

            .sub {
                font-size: 24rpx;
                color: #999;
            }
        }
    }
}

.card {
    background: #fff;
    padding: 30rpx;
    border-radius: 20rpx;
    margin-bottom: 24rpx;

    .card-title {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;
        font-size: 30rpx;
        font-weight: bold;

        &.row-between {
            justify-content: space-between;
        }

        .title-left {
            display: flex;
            align-items: center;
            gap: 12rpx;
        }

        .refresh-btn {
            display: flex;
            align-items: center;
            gap: 6rpx;
            font-size: 24rpx;
            color: #666;
            font-weight: normal;
            border: 1rpx solid #ddd;
            padding: 4rpx 16rpx;
            border-radius: 20rpx;

            &:active {
                opacity: 0.7;
            }
        }
    }
}

.logistics-card {
    .logistics-info {
        background: #F8F9FA;
        padding: 20rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;

        .label {
            font-weight: bold;
            color: #333;
            margin-right: 20rpx;
        }

        .number {
            flex: 1;
            color: #666;
            font-family: monospace;
        }

        .copy-btn {
            font-size: 24rpx;
            color: #FD5B38;
            border: 1rpx solid #FD5B38;
            padding: 4rpx 12rpx;
            border-radius: 20rpx;
        }
    }

    .tip {
        font-size: 22rpx;
        color: #999;
    }
}

.product-card {
    display: flex;

    .thumb-img {
        width: 140rpx;
        height: 140rpx;
        border-radius: 12rpx;
        margin-right: 24rpx;
        background: #eee;
    }

    .prod-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .prod-name {
            font-size: 30rpx;
            font-weight: bold;
        }

        .tags {
            display: flex;
            gap: 12rpx;

            .tag {
                font-size: 22rpx;
                padding: 4rpx 10rpx;
                border-radius: 6rpx;
                background: #eee;
                color: #666;

                &.digital {
                    background: rgba(41, 121, 255, 0.1);
                    color: #2979FF;
                }

                &.print {
                    background: rgba(253, 91, 56, 0.1);
                    color: #FD5B38;
                }
            }
        }

        .prod-price {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }
}

.address-card {
    .address-box {
        .user-row {
            margin-bottom: 8rpx;

            .name {
                font-weight: bold;
                margin-right: 20rpx;
            }
        }

        .addr-text {
            color: #666;
            font-size: 26rpx;
            line-height: 1.4;
        }
    }
}

.info-card {
    .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;
        font-size: 26rpx;
        color: #666;

        &:last-child {
            margin-bottom: 0;
        }

        .value {
            color: #333;
        }

        .copy-small {
            color: #576b95;
            margin-left: 10rpx;
        }
    }
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .btn {
        margin: 0;
        height: 72rpx;
        line-height: 72rpx;
        font-size: 28rpx;
        border-radius: 36rpx;
        padding: 0 40rpx;
        background: #fff;
        border: 1rpx solid #ddd;
        color: #333;

        &.primary {
            background: #FD5B38;
            color: #fff;
            border: none;
        }

        &.secondary {
            color: #FD5B38;
            border-color: #FD5B38;
        }
    }
}

.safe-area-bottom {
    padding-bottom: calc(constant(safe-area-inset-bottom) + 20rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}
</style>
