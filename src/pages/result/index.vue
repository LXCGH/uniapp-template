<template>
    <view class="result-page">
        <!-- Success Header -->
        <view class="result-header">
            <view class="icon-wrapper">
                <uni-icons type="checkbox-filled" size="50" color="#07C160" />
            </view>
            <text class="result-title">制作完成</text>
            <text class="result-desc">高清电子照已生成</text>
        </view>

        <!-- Photo Preview -->
        <view class="preview-card">
            <view class="image-box">
                <image :src="imgSrc" class="result-img" mode="aspectFit" />
            </view>
            <view class="specs-tag">
                <text>二寸 35x49mm</text> <!-- Dynamic in future -->
            </view>
        </view>

        <!-- Action Buttons -->
        <view class="action-list">
            <button class="action-btn download primary" @click="handleDownload">
                <view class="btn-content">
                    <uni-icons type="download" size="20" color="#fff" />
                    <text>保存电子照到相册</text>
                </view>
            </button>

            <button class="action-btn print" @click="handlePrint">
                <view class="btn-content">
                    <uni-icons type="paperplane-filled" size="20" color="#FD5B38" />
                    <text>冲印并邮寄到家</text>
                </view>
            </button>

            <button class="action-btn share" open-type="share">
                <view class="btn-content">
                    <uni-icons type="weixin" size="20" color="#07C160" />
                    <text>分享给好友</text>
                </view>
            </button>
        </view>

        <!-- Footer -->
        <view class="footer-tips">
            <text>保存后可用于在线提交或自行打印</text>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'

const imgSrc = ref('')
const bgColor = ref('#ffffff')

onLoad((options: any) => {
    if (options.image) imgSrc.value = decodeURIComponent(options.image)
    if (options.bgColor) bgColor.value = decodeURIComponent(options.bgColor)
})

onShareAppMessage(() => {
    return {
        title: '我的智能证件照制作完成，快来试试！',
        path: '/pages/index/index',
        imageUrl: imgSrc.value
    }
})

const handleDownload = () => {
    uni.showLoading({ title: '保存中...' })
    // Simulate save
    setTimeout(() => {
        uni.hideLoading()
        uni.saveImageToPhotosAlbum({
            filePath: imgSrc.value,
            success: () => {
                uni.showToast({ title: '已保存', icon: 'success' })

                // Add Digital Order Record
                const newOrder = {
                    id: 'DIG' + Date.now(),
                    name: '精修证件照 - 电子版',
                    date: new Date().toLocaleString(),
                    price: 0, // Free or paid
                    status: 'finished',
                    cover: imgSrc.value,
                    type: 'digital'
                }

                try {
                    const storedOrders = uni.getStorageSync('my_orders')
                    let orders = storedOrders ? JSON.parse(storedOrders) : []
                    orders.unshift(newOrder)
                    uni.setStorageSync('my_orders', JSON.stringify(orders))
                } catch (e) {
                    console.error('Save order error', e)
                }
            },
            fail: () => {
                uni.showToast({ title: '保存失败', icon: 'none' })
            }
        })
    }, 800)
}

const handlePrint = () => {
    // Navigate to Mail Order Page
    // uni.showToast({ title: '前往邮寄页面', icon: 'none' })
    // In future: navigateTo /pages/order/create
    const safeImage = encodeURIComponent(imgSrc.value)
    uni.navigateTo({
        url: `/pages/order/create?image=${safeImage}`
    })
}
</script>

<style lang="scss" scoped>
.result-page {
    min-height: 100vh;
    background-color: #F6F7F9;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Result Page Styles */
}

.result-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40rpx;
    margin-bottom: 60rpx;

    .icon-wrapper {
        margin-bottom: 20rpx;
    }

    .result-title {
        font-size: 40rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
    }

    .result-desc {
        font-size: 28rpx;
        color: #999;
    }
}

.preview-card {
    background: #fff;
    padding: 30rpx;
    border-radius: 24rpx;
    box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.05);
    margin-bottom: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .image-box {
        width: 300rpx;
        height: 420rpx; // 3:4 roughly
        margin-bottom: 24rpx;
        border-radius: 8rpx;
        overflow: hidden;
        border: 1rpx solid #eee;

        .result-img {
            width: 100%;
            height: 100%;
        }
    }

    .specs-tag {
        background: #F0F2F5;
        padding: 8rpx 20rpx;
        border-radius: 20rpx;

        text {
            font-size: 24rpx;
            color: #666;
        }
    }
}

.action-list {
    width: 100%;

    .action-btn {
        height: 100rpx;
        border-radius: 50rpx;
        margin-bottom: 30rpx;
        border: none;
        font-size: 32rpx;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;

        &.primary {
            background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);
            color: #fff;
            box-shadow: 0 8rpx 20rpx rgba(253, 91, 56, 0.3);
        }

        &.print {
            background: #fff;
            color: #FD5B38;
            border: 2rpx solid #FD5B38;
        }

        &.share {
            background: #fff;
            color: #07C160;
            border: 2rpx solid #07C160;
            /* Green border for WeChat */
        }

        .btn-content {
            display: flex;
            align-items: center;
            gap: 16rpx;
        }

        &::after {
            border: none;
        }
    }
}

.footer-tips {
    margin-top: auto;

    text {
        font-size: 24rpx;
        color: #ccc;
    }
}
</style>
