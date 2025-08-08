<template>
  <view class="button-container">
    <view class="button" :style="buttonStyles" @click="handleClick">
      <text class="button-label" :style="labelStyles">{{ label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{
    label: string
    onPress?: () => void
    buttonWidth?: number
    buttonHeight?: number
    fontSize?: number
    color?: string
    bgColor?: string
    borderRadius?: number
  }>(), {
    buttonWidth: 100,
    buttonHeight: 100,
    borderRadius: 0,
    fontSize: 16,
    # if appid == 100
    bgColor: '#00D550',
    color: '#fff'
    # elseif appid == 101
    bgColor: '#00D550',
    color: '#fff'
    # elseif appid == 102
    bgColor: '#2979ff',
    color: '#010101'
    # endif
  })

  // 样式计算
  const buttonStyles = computed(() => ({
    width: `${props.buttonWidth * 2}rpx`,
    height: `${props.buttonHeight * 2}rpx`,
    backgroundColor: props.bgColor,
    borderRadius: `${props.borderRadius * 2}rpx`
  }))

  const labelStyles = computed(() => ({
    color: props.color,
    fontSize: `${props.fontSize * 2}rpx`
  }))

  const emits = defineEmits(["onPress"])
  // 点击事件处理
  const handleClick = () => {
    emits("onPress")
  }
</script>

<style lang="scss" scoped>
.button {
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  /* 添加点击效果 */
  transition: opacity 0.2s;
  &:active {
    opacity: 0.7;
  }
}

.button-label {
  /* 基础文本样式 */
  color: #fff;
  font-size: 32rpx; /* 默认16px转为32rpx */
}
</style>
