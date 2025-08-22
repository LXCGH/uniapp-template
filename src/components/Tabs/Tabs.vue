<template>
  <view v-if="type === 'grid'" class="tabs-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
    <view
      v-for="it in normalized"
      :key="it.value"
      class="tabs-grid__item"
      :class="{ active: it.value === innerValue && it.value !== 'custom' }"
      @tap="select(it.value)"
    >
      <image v-if="it.icon" :src="it.icon" class="tabs-grid__icon" mode="aspectFit" />
      <text class="tabs-grid__label">{{ it.label }}</text>
    </view>
  </view>

  <scroll-view v-else scroll-x class="tabs-line">
    <view
      v-for="it in normalized"
      :key="it.value"
      class="tabs-line__item"
      :class="{ active: it.value === innerValue }"
      @tap="select(it.value)"
    >
      <text class="tabs-line__text">{{ it.label }}</text>
      <view class="tabs-line__bar" />
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

type AnyObj = Record<string, any>

interface FieldNames {
  label?: string
  value?: string
  icon?: string
}

const props = withDefaults(defineProps<{
  modelValue?: string | number
  items: any[] | AnyObj
  fieldNames?: FieldNames
  columns?: number
  type?: 'grid' | 'line'
  activeColor?: string
}>(), {
  fieldNames: () => ({ label: 'label', value: 'value', icon: 'icon' }),
  columns: 4,
  type: 'grid',
  activeColor: 'var(--color-primary)'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
  (e: 'change', item: AnyObj | undefined): void
}>()

const normalized = computed(() => {
  const f = { label: 'label', value: 'value', icon: 'icon', ...(props.fieldNames || {}) }
  const src = props.items

  // 1) 数组：string[] / number[] / object[]
  if (Array.isArray(src)) {
    return src.map((it: any, idx: number) => {
      if (typeof it === 'string' || typeof it === 'number') {
        return { label: String(it), value: it, icon: '' }
      }
      // 对象：兼容常见字段
      const label = it[f.label] ?? it.name ?? it.title ?? it.text ?? `项${idx + 1}`
      const value = it[f.value] ?? it.value ?? it.id ?? idx
      const icon  = it[f.icon]  ?? it.icon ?? ''
      return { label, value, icon, raw: it }
    })
  }

  // 2) 对象字典：{ key: label | { ... } }
  if (src && typeof src === 'object') {
    return Object.keys(src).map((k, idx) => {
      const v = (src as AnyObj)[k]
      if (typeof v === 'string' || typeof v === 'number') {
        return { label: String(v), value: k, icon: '' }
      }
      const label = v[f.label] ?? v.name ?? v.title ?? v.text ?? k
      const value = v[f.value] ?? v.value ?? v.id ?? k ?? idx
      const icon  = v[f.icon]  ?? v.icon ?? ''
      return { label, value, icon, raw: v }
    })
  }
  return []
})

const innerValue = ref<string | number | undefined>()

watchEffect(() => {
  innerValue.value = props.modelValue ?? normalized.value[0]?.value
})

function select(v: string | number) {
  if (v === 'custom') {
    uni.navigateTo({ url: `/pages/customSize/index` })
    return
  }
  if (v === innerValue.value) return
  innerValue.value = v
  const item = normalized.value.find(i => i.value === v)
  emit('update:modelValue', v)
  emit('change', item?.raw ?? item)
}
</script>

<style scoped lang="scss">
.tabs-grid {
  display: grid;
  gap: 20rpx;

  &__item {
    height: 140rpx;
    border-radius: 16rpx;
    background: #fff;
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    color: #333;
    transition: all 0.2s ease;

    &.active {
      background: rgba(221, 66, 56, 0.08);
      color: var(--color-primary);
      border: 2rpx solid var(--color-primary);
    }
  }
  
  &__icon { 
    width: 56rpx; 
    height: 56rpx; 
    margin-bottom: 12rpx; 
  }
  
  &__label { 
    font-size: 28rpx; 
    font-weight: 500;
  }
}

.tabs-line {
  white-space: nowrap;
  
  &__item {
    display: inline-flex; 
    flex-direction: column; 
    align-items: center; 
    padding: 0 24rpx; 
    height: 88rpx; 
    justify-content: center;
    color: #666;
    transition: all 0.2s ease;
    
    &.active { 
      color: var(--color-primary); 
    }
    
    &.active .tabs-line__bar { 
      background: var(--color-primary); 
    }
  }
  
  &__text { 
    font-size: 28rpx; 
    font-weight: 500;
  }
  
  &__bar { 
    width: 48rpx; 
    height: 6rpx; 
    border-radius: 6rpx; 
    margin-top: 10rpx; 
    background: transparent; 
    transition: background-color 0.2s ease;
  }
}
</style>
