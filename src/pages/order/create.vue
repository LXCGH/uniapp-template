<template>
    <view class="create-order-page">
        <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
            <view class="nav-content">
                <view class="back-btn" @click="goBack">
                    <image src="/static/images/left-back.png" mode="aspectFit" class="back-icon" />
                </view>
                <text class="title">确认订单</text>
            </view>
        </view>

        <view class="content-body" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }">
            <!-- Preview Card -->
            <view class="card product-card">
                <image :src="imgSrc" class="thumb-img" mode="aspectFill" />
                <view class="prod-info">
                    <text class="prod-name">精修证件照 - 冲印版</text>
                    <picker :range="layouts" range-key="name" @change="onLayoutChange" class="layout-picker">
                        <view class="picker-row">
                            <text class="label">排版：</text>
                            <text class="value">{{ layouts[layoutIndex].name }}</text>
                            <uni-icons type="bottom" size="14" color="#999" />
                        </view>
                    </picker>
                    <text class="prod-price">¥19.90</text>
                </view>
            </view>

            <!-- Layout Preview (Simulated) -->
            <view class="layout-preview">
                <text class="section-title">排版预览</text>
                <view class="layout-box">
                    <view class="photo-grid">
                        <view class="grid-pic" v-for="i in currentLayout.count" :key="i" :style="{
                            width: `calc(100% / ${currentLayout.cols})`,
                            height: `calc(100% / ${currentLayout.rows})`
                        }">
                            <image :src="imgSrc" class="pic-content" mode="aspectFit" />
                        </view>
                    </view>
                </view>
                <text class="layout-tip">6寸相纸 x 1版 (含{{ currentLayout.count }}张)</text>

                <button class="download-layout-btn" @click="handleDownloadLayout">
                    <uni-icons type="download" size="16" color="#FD5B38" />
                    <text>下载排版电子照</text>
                </button>
            </view>

            <!-- Hidden Canvas for Layout Generation -->
            <canvas canvas-id="layoutCanvas" id="layoutCanvas" class="hidden-canvas"
                :style="{ width: '600px', height: '400px', position: 'fixed', left: '9999px' }"></canvas>

            <!-- Address Form -->
            <view class="card address-form">
                <view class="form-header">
                    <text class="form-title">收货信息</text>
                    <view class="wx-addr-btn" @click="handleChooseAddress">
                        <uni-icons type="weixin" size="18" color="#09bb07" />
                        <text>一键获取</text>
                    </view>
                </view>
                <view class="form-item">
                    <text class="label">收货人</text>
                    <input class="input" placeholder="请填写姓名" v-model="form.name" />
                </view>
                <view class="form-item">
                    <text class="label">手机号</text>
                    <input class="input" type="number" placeholder="请填写手机号码" v-model="form.phone" maxlength="11" />
                </view>
                <view class="form-item">
                    <text class="label">详细地址</text>
                    <input class="input" placeholder="街道门牌信息" v-model="form.address" />
                </view>
            </view>
        </view>

        <!-- Bottom Bar -->
        <view class="bottom-bar safe-area-bottom">
            <view class="price-section">
                <text class="total-label">合计:</text>
                <text class="total-price">¥19.90</text>
            </view>
            <button class="pay-btn" @click="handlePay">立即支付</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const statusBarHeight = ref(20)
const imgSrc = ref('')
const layoutIndex = ref(0) // Default to first layout

// Generic Layout Options
const layouts = [
    { name: '1版 (1张)', rows: 1, cols: 1, count: 1 },
    { name: '常规排版 (2x2 - 4张)', rows: 2, cols: 2, count: 4 },
    { name: '紧凑排版 (2x4 - 8张)', rows: 2, cols: 4, count: 8 },
    { name: '省钱排版 (2x5 - 10张)', rows: 2, cols: 5, count: 10 },
    { name: '超多排版 (3x5 - 15张)', rows: 3, cols: 5, count: 15 }
]

const currentLayout = computed(() => layouts[layoutIndex.value])

const form = ref({
    name: '',
    phone: '',
    address: ''
})

onLoad((options: any) => {
    uni.getSystemInfo({ success: res => statusBarHeight.value = res.statusBarHeight || 20 })
    if (options.image) imgSrc.value = decodeURIComponent(options.image)
})

const goBack = () => uni.navigateBack()

const onLayoutChange = (e: any) => {
    layoutIndex.value = e.detail.value
}

const handleChooseAddress = () => {
    uni.chooseAddress({
        success: (res) => {
            form.value.name = res.userName
            form.value.phone = res.telNumber
            form.value.address = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
        },
        fail: (err) => {
            console.log(err)
            // uni.showToast({ title: '取消选择', icon: 'none' })
        }
    })
}

const handlePay = () => {
    // 1. Validate Name
    if (!form.value.name.trim()) {
        uni.showToast({ title: '请填写收货人姓名', icon: 'none' })
        return
    }

    // 2. Validate Phone (Regex)
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!form.value.phone) {
        uni.showToast({ title: '请填写手机号码', icon: 'none' })
        return
    }
    if (!phoneRegex.test(form.value.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
    }

    // 3. Validate Address
    if (!form.value.address.trim()) {
        uni.showToast({ title: '请填写详细地址', icon: 'none' })
        return
    }

    uni.showLoading({ title: '正在发起支付...' })

    // Simulate Pay
    setTimeout(() => {
        uni.hideLoading()

        // Create Order Object
        const newOrder = {
            id: 'ORD' + Date.now(),
            name: '精修证件照 - 冲印版',
            date: new Date().toLocaleString(),
            price: 19.90,
            status: 'paid', // Simulate success immediately
            cover: imgSrc.value,
            specs: layouts[layoutIndex.value].name, // Save layout info
            type: 'print'
        }

        // Save to storage for order list to pick up
        uni.setStorageSync('latest_new_order', JSON.stringify(newOrder))

        uni.showModal({
            title: '支付成功',
            content: '您的订单已支付成功，我们将在24小时内为您发货。请前往订单页面查看进度。',
            showCancel: false,
            confirmText: '查看订单',
            success: () => {
                // Navigate to Order Tab
                uni.switchTab({ url: '/pages/order/index' })
            }
        })
    }, 1500)
}

const handleDownloadLayout = async () => {
    uni.showLoading({ title: '生成中...' })
    try {
        // 1. Get Image Info
        const info = await new Promise<any>((resolve, reject) => {
            uni.getImageInfo({ src: imgSrc.value, success: resolve, fail: reject })
        })

        // 2. Setup Canvas
        const ctx = uni.createCanvasContext('layoutCanvas')
        const layout = layouts[layoutIndex.value]
        const canvasW = 600
        const canvasH = 400

        // Fill White Background
        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, canvasW, canvasH)

        // 3. Draw Grid
        const itemW = canvasW / layout.cols
        const itemH = canvasH / layout.rows
        const padding = 5 // Gap for scissors

        // Calculate aspect ratio logic simpler: contain within Inner Rect (itemW - padding)

        for (let r = 0; r < layout.rows; r++) {
            for (let c = 0; c < layout.cols; c++) {
                // Determine drawing rect (Inner Rect with Padding)
                const innerX = c * itemW + padding
                const innerY = r * itemH + padding
                const innerW = itemW - padding * 2
                const innerH = itemH - padding * 2

                // Image aspect vs Inner Cell aspect
                const cellRatio = innerW / innerH
                const imgRatio = info.width / info.height

                let drawW, drawH, drawX, drawY

                // Contain logic within Inner Rect
                if (imgRatio > cellRatio) {
                    // Image is wider -> Fit Width
                    drawW = innerW
                    drawH = innerW / imgRatio
                    drawX = innerX
                    drawY = innerY + (innerH - drawH) / 2
                } else {
                    // Image is taller -> Fit Height
                    drawH = innerH
                    drawW = innerH * imgRatio
                    drawY = innerY
                    drawX = innerX + (innerW - drawW) / 2
                }

                ctx.drawImage(info.path, drawX, drawY, drawW, drawH)
            }
        }

        // 4. Draw & Save
        ctx.draw(false, () => {
            setTimeout(() => {
                uni.canvasToTempFilePath({
                    canvasId: 'layoutCanvas',
                    width: canvasW,
                    height: canvasH,
                    destWidth: canvasW * 2, // High Res
                    destHeight: canvasH * 2,
                    success: (res) => {
                        uni.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: () => {
                                uni.hideLoading()
                                uni.showToast({ title: '排版照已保存', icon: 'success' })
                            },
                            fail: () => {
                                uni.hideLoading()
                                uni.showToast({ title: '保存失败', icon: 'none' })
                            }
                        })
                    },
                    fail: (err) => {
                        console.error(err)
                        uni.hideLoading()
                        uni.showToast({ title: '生成失败', icon: 'none' })
                    }
                })
            }, 200) // Wait for render
        })

    } catch (e) {
        console.error(e)
        uni.hideLoading()
        uni.showToast({ title: '图片加载失败', icon: 'none' })
    }
}
</script>

<style lang="scss" scoped>
.create-order-page {
    min-height: 100vh;
    background: #F6F7F9;
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
    padding: 0 30rpx 120rpx 30rpx;
}

.card {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
}

.product-card {
    display: flex;

    .thumb-img {
        width: 160rpx;
        height: 160rpx;
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
            font-weight: bold;
            font-size: 30rpx;
        }

        .prod-price {
            color: #FD5B38;
            font-weight: bold;
            font-size: 36rpx;
        }
    }
}

.layout-picker {
    background: #F5F7FA;
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    margin-top: 10rpx;

    .picker-row {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #666;

        .value {
            flex: 1;
            color: #333;
            margin-left: 10rpx;
        }
    }
}

.download-layout-btn {
    margin-top: 30rpx;
    width: 340rpx;
    height: 72rpx;
    background: #fff;
    border: 1rpx solid #FD5B38;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 0;
    align-self: center;
    /* Centered in flex column of card */

    text {
        font-size: 26rpx;
        color: #FD5B38;
        font-weight: 500;
    }

    &::after {
        border: none;
    }

    &:active {
        opacity: 0.8;
        background: #fffcfb;
    }
}

.layout-preview {
    margin-bottom: 24rpx;

    .section-title {
        font-size: 28rpx;
        color: #999;
        margin-bottom: 12rpx;
        display: block;
    }

    .layout-box {
        background: #fff;
        padding: 20rpx;
        border-radius: 20rpx;
        display: flex;
        justify-content: center;

        .photo-grid {
            width: 100%;
            max-width: 600rpx;
            aspect-ratio: 3/2;
            height: auto;
            display: flex;
            flex-wrap: wrap;
            padding: 4rpx;

            .grid-pic {
                // width/height set via inline style
                overflow: hidden;
                background-color: #fff;
                // Center the image
                display: flex;
                align-items: center;
                justify-content: center;

                .pic-content {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    .layout-tip {
        font-size: 22rpx;
        color: #999;
        text-align: center;
        display: block;
        margin-top: 8rpx;
    }
}

.address-form {
    padding: 0 32rpx;

    .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx 0 20rpx;
        border-bottom: 2rpx solid #f5f5f5;

        .form-title {
            font-size: 30rpx;
            font-weight: 600;
            color: #333;
        }

        .wx-addr-btn {
            display: flex;
            align-items: center;
            font-size: 26rpx;
            color: #09bb07;

            text {
                margin-left: 6rpx;
            }

            &:active {
                opacity: 0.7;
            }
        }
    }

    .form-item {
        display: flex;
        align-items: center;
        height: 100rpx;
        border-bottom: 2rpx solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }

        .label {
            width: 140rpx;
            font-size: 28rpx;
            color: #666;
        }

        .input {
            flex: 1;
            height: 100%;
            font-size: 28rpx;
            color: #333;
        }
    }
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);

    .price-section {
        .total-label {
            font-size: 28rpx;
            color: #333;
            margin-right: 12rpx;
        }

        .total-price {
            font-size: 40rpx;
            font-weight: bold;
            color: #FD5B38;
        }
    }

    .pay-btn {
        background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);
        color: #fff;
        border-radius: 40rpx;
        padding: 0 60rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 30rpx;
        font-weight: 600;
        margin: 0;
    }
}

.safe-area-bottom {
    padding-bottom: calc(constant(safe-area-inset-bottom) + 20rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}
</style>
