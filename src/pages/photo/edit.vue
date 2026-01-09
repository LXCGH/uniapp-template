<template>
    <view class="edit-page">
        <!-- Canvas/Preview Area -->
        <view class="preview-area">
            <image v-if="imgSrc" :src="imgSrc" class="preview-img" mode="aspectFit"
                :style="{ filter: `brightness(${1 + beautyLevel / 500}) contrast(${1 + beautyLevel / 1000})` }" />



            <!-- Grid -->
            <view class="grid-overlay" v-if="!isProcessing && showGrid">
                <view class="grid-line horizontal"></view>
                <view class="grid-line vertical"></view>
            </view>
        </view>

        <!-- Controls Area -->
        <view class="controls-area safe-area-bottom">
            <!-- Handle Bar for visual cue -->
            <view class="handle-bar"></view>

            <!-- Image Info Card -->
            <view class="info-card">
                <image :src="imgSrc" class="thumb-img" mode="aspectFill" />
                <view class="info-text">
                    <view class="spec-row">
                        <text class="spec-name">标准二寸</text> <!-- Placeholder/Dynamic -->
                        <view class="tag">电子照</view>
                    </view>
                    <text class="spec-size">35x49mm · 413x579px</text>
                </view>
            </view>

            <!-- Beauty Control -->
            <view class="beauty-section">
                <view class="section-header">
                    <view class="left">
                        <uni-icons type="star-filled" size="18" color="#FFD700" />
                        <text class="label">智能美颜</text>
                    </view>
                    <text class="value">{{ beautyLevel }}%</text>
                </view>
                <view class="slider-container">
                    <text class="slider-icon">⚪️</text>
                    <slider class="custom-slider" :value="beautyLevel" min="0" max="100" activeColor="#FD5B38"
                        backgroundColor="#F0F2F5" block-size="20" block-color="#fff" @change="onBeautyChange"
                        @changing="onBeautyChange" />
                    <text class="slider-icon">✨</text>
                </view>
            </view>

            <!-- Bottom Actions -->
            <view class="action-buttons dual">
                <button class="btn btn-secondary" @tap="handleBack">
                    <uni-icons type="undo" size="18" color="#666" />
                    <text>重选</text>
                </button>
                <button class="btn btn-primary" @tap="handleCreate">
                    <text>立即制作</text>
                    <uni-icons type="arrowright" size="16" color="#fff" />
                </button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// State
const imgSrc = ref('');
const currentBgColor = ref('#ffffff');
const isProcessing = ref(false); // No loading
const beautyLevel = ref(0);
const showGrid = ref(true);

/**
 * Lifecycle: On Load
 */
// @ts-ignore
onLoad((options: any) => {
    if (options.image) {
        imgSrc.value = options.image;
    }
    if (options.bgColor) {
        currentBgColor.value = options.bgColor;
    }

    // Enable system back alert (WeChat Mini Program)
    // Note: The message might be ignored by WeChat and show default text
    uni.enableAlertBeforeUnload({
        message: '当前编辑未保存，是否确认退出？'
    })
});

function onBeautyChange(e: any) {
    beautyLevel.value = e.detail.value;
}

function handleBack() {
    uni.showModal({
        title: '提示',
        content: '当前编辑未保存，是否确认退出？',
        success: (res) => {
            if (res.confirm) {
                // Disable alert before navigating back programmatically to avoid double check (optional, but navigating back usually bypasses if triggered by API? No, navigateBack triggers Unload)
                // Actually navigateBack triggers page unload.
                // If we enabled Alert, it might trigger the system alert AGAIN?
                // Let's test standard behavior. usually API navigation might bypass or trigger. 
                // To be safe, we can disable it before navigating if the user confirmed MY modal.
                uni.disableAlertBeforeUnload()
                uni.navigateBack();
            }
        }
    })
}

function handleCreate() {
    // Navigate to Result Page
    uni.showLoading({ title: '正在合成...' });
    setTimeout(() => {
        uni.hideLoading();
        // Pass params to result page
        const safeImage = encodeURIComponent(imgSrc.value || '');
        const safeColor = encodeURIComponent(currentBgColor.value);

        // Disable alert before proceeding
        uni.disableAlertBeforeUnload()

        uni.navigateTo({
            url: `/pages/result/index?image=${safeImage}&bgColor=${safeColor}`
        });
    }, 1500);
}
</script>

<style scoped lang="scss">
.edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #1a1a1a;
}

.preview-area {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: #000000;
    /* Black background */
    padding: 60rpx;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: filter 0.3s ease;
    z-index: 10;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
    /* Lift the photo off the canvas */
    border-radius: 8rpx;
    /* Slight photo radius */
}



.grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 20;

    .grid-line {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);

        &.horizontal {
            top: 50%;
            left: 20%;
            right: 20%;
            height: 1px;
        }

        &.vertical {
            left: 50%;
            top: 10%;
            bottom: 10%;
            width: 1px;
        }
    }
}

.controls-area {
    background: #fff;
    border-top-left-radius: 40rpx;
    border-top-right-radius: 40rpx;
    padding: 24rpx 40rpx 40rpx 40rpx;
    box-shadow: 0 -10rpx 40rpx rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.handle-bar {
    width: 80rpx;
    height: 8rpx;
    background: #E0E0E0;
    border-radius: 4rpx;
    align-self: center;
    margin-bottom: 40rpx;
}

.info-card {
    display: flex;
    align-items: center;
    background: #F9FAFC;
    padding: 24rpx;
    border-radius: 24rpx;
    margin-bottom: 40rpx;
    border: 1rpx solid #F0F2F5;

    .thumb-img {
        width: 100rpx;
        height: 100rpx;
        border-radius: 16rpx;
        background: #eee;
        margin-right: 24rpx;
        border: 2rpx solid #fff;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    }

    .info-text {
        flex: 1;

        .spec-row {
            display: flex;
            align-items: center;
            margin-bottom: 8rpx;

            .spec-name {
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
                margin-right: 12rpx;
            }

            .tag {
                font-size: 20rpx;
                color: #FD5B38;
                background: #FFF0EB;
                padding: 4rpx 12rpx;
                border-radius: 8rpx;
            }
        }

        .spec-size {
            font-size: 24rpx;
            color: #999;
        }
    }
}

.beauty-section {
    padding: 0 0 24rpx 0;
    margin-bottom: 24rpx;

    margin-bottom: 40rpx;

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;

        .left {
            display: flex;
            align-items: center;
            gap: 8rpx;

            .label {
                font-size: 30rpx;
                font-weight: 600;
                color: #333;
            }
        }

        .value {
            font-size: 28rpx;
            color: #FD5B38;
            font-weight: bold;
        }
    }

    .slider-container {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .slider-icon {
            font-size: 24rpx;
            color: #ccc;
        }

        .custom-slider {
            flex: 1;
        }
    }
}

.action-buttons {
    margin-top: auto;

    &.dual {
        display: flex;
        justify-content: space-between;

        .btn {
            height: 96rpx;
            line-height: 96rpx;
            border-radius: 50rpx;
            font-size: 32rpx;
            font-weight: 600;
            border: none;

            &::after {
                border: none;
            }

            &:active {
                opacity: 0.9;
            }
        }

        .btn-secondary {
            width: 35%;
            background: #F5F7FA;
            color: #666;
        }

        .btn-primary {
            width: 60%;
            background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);
            color: #fff;
            box-shadow: 0 8rpx 20rpx rgba(253, 91, 56, 0.3);
        }
    }
}

.safe-area-bottom {
    padding-bottom: calc(constant(safe-area-inset-bottom) + 32rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 32rpx);
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
