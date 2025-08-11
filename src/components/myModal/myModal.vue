<template>
  <view v-if="visible" class="modal-mask">
    <view class="modal-container">
      <view class="modal-title">{{ title }}</view>
      <scroll-view scroll-y class="modal-content">
        <rich-text :nodes="formattedContent" />
      </scroll-view>
      <view class="modal-footer">
        <view v-if="showCancel" class="modal-btn modal-cancel" @tap="handleCancel">
          {{ cancelText }}
        </view>
        <view class="modal-btn modal-confirm" :style="{ width: showCancel ? '50%' : '100%' }" @tap="handleConfirm">
          {{ confirmText }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from "vue";

interface ModalPromise {
  resolve?: (value: { confirm: boolean }) => void;
  reject?: (reason?: any) => void;
}

const props = defineProps({
  title: {
    type: String,
    default: "提示",
  },
  confirmText: {
    type: String,
    default: "确定",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  showCancel: {
    type: Boolean,
    default: false,
  },
});

const visible = ref(false);
const promiseInfo = ref<ModalPromise>({});
const content = ref("");
// 格式化内容（处理换行和缩进）
const formattedContent = computed(() => {
  return content.value.replace(/\n/g, "<br/>").replace(/\t/g, "&emsp;");
});

const open = (data: any): Promise<{ confirm: boolean }> => {
  content.value = data.content;
  visible.value = true;
  return new Promise((resolve, reject) => {
    promiseInfo.value = { resolve, reject };
  });
};

const close = () => {
  visible.value = false;
  promiseInfo.value = {};
};

const handleConfirm = () => {
  promiseInfo.value.resolve?.({ confirm: true });
  close();
};

const handleCancel = () => {
  promiseInfo.value.reject?.({ cancel: true });
  close();
};

// 暴露方法给父组件
defineExpose({ open });
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.modal-title {
  padding: 40rpx 40rpx;
  font-size: 34rpx;
  font-weight: 700;
  text-align: center;
  color: #333;
}

.modal-content {
  max-height: 600rpx;
  padding: 0rpx 40rpx;
  font-size: 30rpx;
  color: #666;
  line-height: 1.5;
}

.modal-footer {
  margin-top: 30rpx;
  display: flex;
  height: 100rpx;
  border-top: 2rpx solid #f7f7f7;
}

.modal-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 34rpx;
  line-height: 100rpx;

  &-confirm {
    color: #007aff;
    border-left: 2rpx solid #f7f7f7;
  }

  &-cancel {
    color: #666;
  }
}
</style>
