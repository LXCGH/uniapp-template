<template>
    <view class="color-mask" v-if="modelValue">
        <view class="color-modal">
            <view class="modal-header">
                <text class="modal-title">自定义颜色</text>
                <uni-icons type="closeempty" size="24" color="#999" @click="closeModal" />
            </view>

            <view class="modal-body">
                <!-- Preview -->
                <view class="preview-box" :style="{ background: currentColor.hex }"></view>

                <!-- Quick Select -->
                <view class="quick-select">
                    <text class="label">快捷选择</text>
                    <view class="preset-grid">
                        <view class="preset-item" v-for="c in quickColors" :key="c" :style="{ background: c }"
                            @click="parseColorToState(c)" />
                    </view>
                </view>

                <!-- Hue Slider -->
                <view class="slider-row">
                    <text class="label">色相</text>
                    <slider class="hue-slider" :value="currentColor.h" min="0" max="360" activeColor="transparent"
                        backgroundColor="transparent" block-size="20" @change="updateFromSlider"
                        @changing="updateFromSlider" />
                </view>

                <view class="slider-row">
                    <text class="label">饱和度</text>
                    <slider class="sat-slider" :value="currentColor.s" min="0" max="100" activeColor="transparent"
                        backgroundColor="transparent" block-size="20" @change="updateFromSatSlider"
                        @changing="updateFromSatSlider" />
                </view>

                <view class="slider-row">
                    <text class="label">亮度</text>
                    <slider class="light-slider" :value="currentColor.l" min="0" max="100" activeColor="transparent"
                        backgroundColor="transparent" block-size="20" @change="updateFromLightSlider"
                        @changing="updateFromLightSlider" />
                </view>

                <!-- Hex Input -->
                <view class="input-row">
                    <text class="label">HEX</text>
                    <input class="hex-input" type="text" :value="currentColor.hex" maxlength="7"
                        @input="updateFromHexInput" />
                </view>

                <!-- RGB Inputs -->
                <view class="rgb-row">
                    <view class="rgb-item">
                        <text class="sub-label">R</text>
                        <input class="num-input" type="number" v-model="currentColor.r" @input="updateFromRgbInput" />
                    </view>
                    <view class="rgb-item">
                        <text class="sub-label">G</text>
                        <input class="num-input" type="number" v-model="currentColor.g" @input="updateFromRgbInput" />
                    </view>
                    <view class="rgb-item">
                        <text class="sub-label">B</text>
                        <input class="num-input" type="number" v-model="currentColor.b" @input="updateFromRgbInput" />
                    </view>
                </view>
            </view>

            <view class="modal-footer">
                <button class="confirm-btn" @click="confirmCustomColor">确认选择</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue: boolean // To show/hide modal
    initialColor?: string // Initial custom color to edit
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])

const currentColor = ref({
    hex: '#FD5B38',
    r: 253, g: 91, b: 56,
    h: 11, s: 98, l: 61
})

const quickColors = [
    '#ffffff', '#000000', '#d9001b', '#438edb',
    '#bad6f0', '#808080', '#FFC107', '#4CAF50'
]

watch(() => props.modelValue, (val) => {
    if (val && props.initialColor) {
        parseColorToState(props.initialColor)
    }
})

const closeModal = () => {
    emit('update:modelValue', false)
}

const parseColorToState = (hexStr: string) => {
    if (!hexStr || !hexStr.startsWith('#')) hexStr = '#000000'
    const hex = hexStr
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const { h, s, l } = rgbToHsl(r, g, b)
    currentColor.value = { hex, r, g, b, h, s, l }
}

const updateFromSlider = (e: any) => {
    const { value } = e.detail
    let { s, l } = currentColor.value

    // Fix: If white/grayscale, reset to vivid color to allow hue change visibility
    if (s === 0 || l === 0 || l === 100) {
        s = 100
        l = 50
    }

    const { r, g, b } = hslToRgb(value, s, l)
    const hex = rgbToHex(r, g, b)
    currentColor.value = { ...currentColor.value, h: value, s, l, r, g, b, hex }
}

const updateFromSatSlider = (e: any) => {
    const { value } = e.detail
    const { h, l } = currentColor.value
    const { r, g, b } = hslToRgb(h, value, l)
    const hex = rgbToHex(r, g, b)
    currentColor.value = { ...currentColor.value, s: value, r, g, b, hex }
}

const updateFromLightSlider = (e: any) => {
    const { value } = e.detail
    const { h, s } = currentColor.value
    const { r, g, b } = hslToRgb(h, s, value)
    const hex = rgbToHex(r, g, b)
    currentColor.value = { ...currentColor.value, l: value, r, g, b, hex }
}

const updateFromRgbInput = () => {
    let { r, g, b } = currentColor.value
    r = Math.min(255, Math.max(0, r || 0))
    g = Math.min(255, Math.max(0, g || 0))
    b = Math.min(255, Math.max(0, b || 0))
    const { h, s, l } = rgbToHsl(r, g, b)
    const hex = rgbToHex(r, g, b)
    currentColor.value = { hex, r, g, b, h, s, l }
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

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
    s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
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

.color-modal {
    width: 600rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32rpx;

        .modal-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .preview-box {
        height: 120rpx;
        border-radius: 16rpx;
        margin-bottom: 32rpx;
        border: 2rpx solid #eee;
        box-shadow: inset 0 0 20rpx rgba(0, 0, 0, 0.05);
    }

    .quick-select {
        margin-bottom: 32rpx;

        .label {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 16rpx;
            display: block;
        }

        .preset-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 16rpx;

            .preset-item {
                width: 100%;
                aspect-ratio: 1;
                border-radius: 8rpx;
                border: 1rpx solid #eee;
                box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
            }
        }
    }

    .slider-row {
        margin-bottom: 32rpx;

        .label {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 12rpx;
            display: block;
        }

        .hue-slider {
            background: linear-gradient(to right, red, #ff0, lime, cyan, blue, #f0f, red);
            border-radius: 10rpx;
        }

        .sat-slider {
            background: linear-gradient(to right, #808080, #ffffff);
            /* Simple gray scale gradient representation */
            border-radius: 10rpx;
        }

        .light-slider {
            background: linear-gradient(to right, #000000, #ffffff);
            border-radius: 10rpx;
        }
    }

    .input-row {
        margin-bottom: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .label {
            width: 80rpx;
            font-size: 26rpx;
            color: #333;
            text-align: center;
        }

        .hex-input {
            flex: 1;
            height: 72rpx;
            background: #F5F7FA;
            border-radius: 12rpx;
            padding: 0 24rpx;
            font-size: 28rpx;
            color: #333;
            text-align: center;
        }
    }

    .rgb-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40rpx;

        .rgb-item {
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .sub-label {
                font-size: 20rpx;
                color: #999;
                margin-bottom: 8rpx;
                text-align: center;
            }

            .num-input {
                width: 100%;
                height: 72rpx;
                background: #F5F7FA;
                border-radius: 12rpx;
                text-align: center;
                font-size: 28rpx;
            }
        }
    }

    .modal-footer {
        margin-top: 20rpx;
    }

    .confirm-btn {
        width: 100%;
        height: 88rpx;
        background: linear-gradient(90deg, #FD5B38 0%, #FF8F70 100%);
        color: #fff;
        border-radius: 44rpx;
        font-size: 30rpx;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
