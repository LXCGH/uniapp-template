<template>
    <view class="color-picker-panel">
        <scroll-view scroll-x class="color-scroll" :show-scrollbar="false">
            <view class="color-list">
                <view v-for="(color, index) in colors" :key="index" class="color-item"
                    :class="{ active: modelValue === color.value }" @click="selectColor(color.value)">
                    <view class="color-circle" :style="{ background: color.value }">
                        <uni-icons v-if="modelValue === color.value" type="checkmarkempty" size="16"
                            :color="getCheckColor(color.value)" />
                    </view>
                    <text class="color-name">{{ color.name }}</text>
                </view>

                <!-- Custom Color Trigger -->
                <view class="color-item" :class="{ active: isCustomActive }" @click="openCustomPicker">
                    <view class="color-circle custom-circle">
                        <!-- Gradient Background handles the look -->
                        <uni-icons v-if="isCustomActive" type="checkmarkempty" size="16" color="#fff"
                            class="custom-check" />
                    </view>
                    <text class="color-name">自定义</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits(['update:modelValue', 'custom'])

const colors = [
    { name: '白色', value: '#ffffff' },
    { name: '蓝色', value: '#438edb' },
    { name: '红色', value: '#d9001b' },
    { name: '灰色', value: '#808080' },
    { name: '天蓝', value: '#bad6f0' }
]

const isCustomActive = computed(() => {
    return !colors.some(c => c.value.toLowerCase() === props.modelValue.toLowerCase())
})

function selectColor(val: string) {
    emit('update:modelValue', val)
}

function openCustomPicker() {
    emit('custom')
}


function getCheckColor(val: string) {
    return val === '#ffffff' ? '#333' : '#fff'
}
</script>

<style lang="scss" scoped>
.color-picker-panel {
    width: 100%;
}

.color-scroll {
    width: 100%;
    white-space: nowrap;
}

.color-list {
    display: flex;
    padding: 10rpx 0;
}

.color-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-right: 32rpx; // Reduced spacing
    position: relative;
    transition: all 0.2s;

    &:last-child {
        margin-right: 0;
    }
}

.color-circle {
    width: 64rpx; // Reduced circle
    height: 64rpx;
    border-radius: 50%;
    border: 1rpx solid #eee; // Subtle border
    margin-bottom: 12rpx;
    transition: all 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

// Active State Logic
.color-item.active {
    .color-circle {
        transform: scale(1.1);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15); // Shadow effect
        border-color: rgba(0, 0, 0, 0.1);
    }

    .color-name {
        color: #333; // Darker text on active
        font-weight: 500;
    }
}

.custom-circle {
    overflow: hidden;
    background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
    position: relative;
    border: none;

    .color-wheel {
        display: none;
        /* Hide image if present, use gradient */
    }

    .custom-check {
        position: absolute;
        z-index: 2;
        text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.5);
    }
}

.color-name {
    font-size: 24rpx; // Slightly smaller font
    color: #666;
}
</style>
