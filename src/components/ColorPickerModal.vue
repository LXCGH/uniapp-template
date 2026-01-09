<template>
    <view class="color-mask" v-if="modelValue">
        <view class="color-modal-lg">
            <!-- Header -->
            <view class="modal-header">
                <text class="modal-title">请选择颜色[左侧滑动或右侧填写色号值]</text>
                <uni-icons type="closeempty" size="24" color="#999" @click="closeModal" />
            </view>

            <view class="modal-body-lg">
                <!-- Left Column: Picker -->
                <view class="left-col">
                    <!-- Saturation/Value Box -->
                    <view class="sv-box" :style="{ background: `hsl(${currentColor.h}, 100%, 50%)` }"
                        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
                        <view class="sv-white-overlay"></view>
                        <view class="sv-black-overlay"></view>
                        <view class="sv-cursor"
                            :style="{ left: cursorX + 'px', top: cursorY + 'px', backgroundColor: currentColor.hex }">
                        </view>
                    </view>

                    <!-- Hue Slider -->
                    <view class="hue-slider-container">
                        <slider class="hue-slider-lg" :value="currentColor.h" min="0" max="360"
                            activeColor="transparent" backgroundColor="transparent" block-size="20"
                            @change="updateFromSlider" @changing="updateFromSlider" />
                    </view>
                </view>

                <!-- Right Column: Controls -->
                <view class="right-col">
                    <!-- Preview -->
                    <view class="preview-box-lg" :style="{ background: currentColor.hex }"></view>

                    <!-- Hex Input -->
                    <view class="input-group">
                        <input class="hex-input-lg" type="text" :value="currentColor.hex" maxlength="7"
                            @input="updateFromHexInput" />
                        <text class="unit">#</text>
                    </view>

                    <!-- RGB Inputs -->
                    <view class="input-group">
                        <input class="num-input-lg" type="number" v-model="currentColor.r"
                            @input="updateFromRgbInput" />
                        <text class="unit">R</text>
                    </view>
                    <view class="input-group">
                        <input class="num-input-lg" type="number" v-model="currentColor.g"
                            @input="updateFromRgbInput" />
                        <text class="unit">G</text>
                    </view>
                    <view class="input-group">
                        <input class="num-input-lg" type="number" v-model="currentColor.b"
                            @input="updateFromRgbInput" />
                        <text class="unit">B</text>
                    </view>

                    <!-- Buttons -->
                    <view class="btn-group">
                        <button class="action-btn confirm" @click="confirmCustomColor">确定</button>
                        <button class="action-btn cancel" @click="closeModal">取消</button>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, watch, getCurrentInstance, nextTick } from 'vue'

const props = defineProps<{
    modelValue: boolean // To show/hide modal
    initialColor?: string // Initial custom color to edit
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])
const instance = getCurrentInstance()

const currentColor = ref({
    hex: '#FD5B38',
    r: 253, g: 91, b: 56,
    h: 11, s: 100, v: 100 // Using HSV internally for the box
})

// Cursor position
const cursorX = ref(0)
const cursorY = ref(0)
// svBoxSize removed

// Logic for SV Box Interaction
const rectInfo = ref<{ left: number, top: number, width: number, height: number } | null>(null)

const initRect = () => {
    // Need to wait for render
    nextTick(() => {
        setTimeout(() => {
            const query = uni.createSelectorQuery().in(instance)
            query.select('.sv-box').boundingClientRect(data => {
                if (data) {
                    // Check if data is array or object (in some platforms it can be array)
                    const rect = Array.isArray(data) ? data[0] : data
                    if (rect) {
                        rectInfo.value = {
                            left: rect.left || 0,
                            top: rect.top || 0,
                            width: rect.width || 0,
                            height: rect.height || 0
                        }
                        // Update cursor initial pos
                        updateCursorFromState()
                    }
                }
            }).exec()
        }, 300) // Slight delay to ensure modal transition done
    })
}

watch(() => props.modelValue, (val) => {
    if (val) {
        if (props.initialColor) {
            parseColorToState(props.initialColor)
        }
        initRect()
    }
})

// Update cursor when color changes programmatically (e.g. initial or inputs)
const updateCursorFromState = () => {
    if (rectInfo.value && rectInfo.value.width > 0) {
        const { s, v } = currentColor.value
        cursorX.value = (s / 100) * rectInfo.value.width
        cursorY.value = ((100 - v) / 100) * rectInfo.value.height
    }
}

const closeModal = () => {
    emit('update:modelValue', false)
}

const onTouchStart = (e: any) => {
    handleTouch(e)
}

const onTouchMove = (e: any) => {
    // Prevent scrolling parent
    e.stopPropagation && e.stopPropagation()
    e.preventDefault && e.preventDefault()
    handleTouch(e)
}

const onTouchEnd = (e: any) => {
    handleTouch(e)
}

const handleTouch = (e: any) => {
    if (!rectInfo.value) return

    // Uniapp touches: e.touches[0].clientX
    const touch = e.touches[0] || e.changedTouches[0]
    if (!touch) return

    let x = touch.clientX - rectInfo.value.left
    let y = touch.clientY - rectInfo.value.top

    // Clamp
    x = Math.max(0, Math.min(x, rectInfo.value.width))
    y = Math.max(0, Math.min(y, rectInfo.value.height))

    cursorX.value = x
    cursorY.value = y

    // Calculate S and V
    // s = x / width * 100
    // v = 100 - (y / height * 100)
    const s = Math.round((x / rectInfo.value.width) * 100)
    const v = Math.round(100 - (y / rectInfo.value.height) * 100)

    // Update State
    const { h } = currentColor.value
    const { r, g, b } = hsvToRgb(h, s, v)
    const hex = rgbToHex(r, g, b)

    currentColor.value = { hex, r, g, b, h, s, v }
}

// Placeholder: For now assumes fixed logic or simplified slider behavior
// Implementing full touch dragging in uni-app modal requires care with coords.
// Let's implement basics

const parseColorToState = (hexStr: string) => {
    if (!hexStr || !hexStr.startsWith('#')) hexStr = '#000000'
    const hex = hexStr
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    // Convert RGB to HSV
    const { h, s, v } = rgbToHsv(r, g, b)
    currentColor.value = { hex, r, g, b, h, s, v }

    // Update cursor... (logic pending)
}

const updateFromSlider = (e: any) => {
    const { value } = e.detail
    // Update Hue, keep S and V
    const { s, v } = currentColor.value
    const { r, g, b } = hsvToRgb(value, s, v)
    const hex = rgbToHex(r, g, b)
    currentColor.value = { ...currentColor.value, h: value, r, g, b, hex }
}

const updateFromRgbInput = () => {
    let { r, g, b } = currentColor.value
    r = Math.min(255, Math.max(0, r || 0))
    g = Math.min(255, Math.max(0, g || 0))
    b = Math.min(255, Math.max(0, b || 0))
    const { h, s, v } = rgbToHsv(r, g, b)
    const hex = rgbToHex(r, g, b)
    currentColor.value = { hex, r, g, b, h, s, v }
}

const updateFromHexInput = (e: any) => {
    let val = e.detail.value
    if (val.length === 7 && val.startsWith('#')) {
        parseColorToState(val)
    }
}

const confirmCustomColor = () => {
    emit('confirm', currentColor.value.hex)
    closeModal()
}

// Utils
function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// HSV Converters
function rgbToHsv(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hsvToRgb(h: number, s: number, v: number) {
    let r, g, b, i, f, p, q, t;
    h /= 360;
    s /= 100;
    v /= 100;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = 0; g = 0; b = 0; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

</script>

<style lang="scss" scoped>
.color-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.color-modal-lg {
    width: 680rpx;
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;
    padding-bottom: 16rpx;

    .modal-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
    }
}

.modal-body-lg {
    display: flex;
    flex-direction: row;
    gap: 24rpx;
}

.left-col {
    flex: 2;
    display: flex;
    flex-direction: column;
}

.sv-box {
    width: 100%;
    height: 400rpx; // Fixed height for area
    position: relative;
    background-color: red; // Dynamic Hue
    margin-bottom: 20rpx;
    cursor: crosshair;
    touch-action: none;

    .sv-white-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
    }

    .sv-black-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    }

    .sv-cursor {
        position: absolute;
        width: 20rpx;
        height: 20rpx;
        border: 2rpx solid #fff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 4rpx rgba(0, 0, 0, 0.5);
        pointer-events: none;
    }
}

.hue-slider-container {
    height: 40rpx;

    .hue-slider-lg {
        margin: 0;
        background: linear-gradient(to right, red, #ff0, lime, cyan, blue, #f0f, red);
        border-radius: 20rpx;
    }
}

.right-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 200rpx;
}

.preview-box-lg {
    width: 100%;
    height: 100rpx;
    border: 1rpx solid #eee;
    margin-bottom: 24rpx;
}

.input-group {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    background: #f0f0f0;
    padding: 8rpx;
    border-radius: 4rpx;

    .hex-input-lg,
    .num-input-lg {
        flex: 1;
        font-size: 24rpx;
        text-align: right;
        padding-right: 8rpx;
    }

    .unit {
        font-size: 24rpx;
        color: #666;
        width: 30rpx;
    }
}

.btn-group {
    margin-top: auto;

    .action-btn {
        width: 100%;
        height: 64rpx;
        line-height: 64rpx;
        font-size: 26rpx;
        margin-bottom: 16rpx;
        border: none;
        border-radius: 8rpx;

        &.confirm {
            background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);
            color: #fff;
        }

        &.cancel {
            background: #FFF5E5;
            color: #FD5B38;
        }
    }
}
</style>
