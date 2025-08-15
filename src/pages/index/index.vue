<template>
  <view class="index-page">
    <!-- 顶部分类 Tabs（栅格） -->
    <Tabs v-model="activeCat" :items="categories" :field-names="{ label: 'name', value: 'id', icon: 'icon' }"
      type="grid" :columns="4" @change="onCatChange" />

    <!-- 规格列表 - 添加滚动容器 -->
    <scroll-view class="spec-list" scroll-y :scroll-top="scrollTop" @scroll="onScroll">
      <view class="spec-item" v-for="it in currentList" :key="it.id" @tap="goDetail(it)">
        <view class="title">{{ it.title }}</view>
        <view class="meta">
          <text>尺寸：{{ it.sizeMM }}</text>
          <text>像素：{{ it.pixel }}</text>
        </view>
        <uni-icons type="right" color="#bbb" size="18" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Tabs from '@/components/Tabs/Tabs.vue'

// 分类数据（演示：混合多种结构）
const categories = [
  { id: 'hot', name: '热门尺寸', icon: '/static/images/icons/hot.png' },
  { id: 'custom', name: '自定义像素', icon: '/static/images/icons/edit.png' },
  { id: 'general', name: '通用寸照', icon: '/static/images/icons/general.png' },
  { id: 'medical', name: '医药卫生', icon: '/static/images/icons/medical.png' },
  { id: 'lang', name: '语言考试', icon: '/static/images/icons/lang.png' },
  { id: 'job', name: '职业资格', icon: '/static/images/icons/job.png' },
  { id: 'degree', name: '学历考试', icon: '/static/images/icons/edu.png' },
  { id: 'gov', name: '公务员', icon: '/static/images/icons/gov.png' },
  { id: 'visa', name: '旅游签证', icon: '/static/images/icons/visa.png' },
  { id: 'arch', name: '建筑工程', icon: '/static/images/icons/arch.png' },
  { id: 'collect', name: '图像采集', icon: '/static/images/icons/collect.png' },
  { id: 'other', name: '其他', icon: '/static/images/icons/other.png' }
]

const specMap: Record<string, Array<{ id: string; title: string; sizeMM: string; pixel: string }>> = {
  hot: [
    { id: '1inch', title: '一寸', sizeMM: '25×35 mm', pixel: '295×413 px' },
    { id: '2inch', title: '二寸', sizeMM: '35×49 mm', pixel: '413×579 px' },
    { id: 'uni480', title: '大学生图像采集', sizeMM: '41×54 mm', pixel: '480×640 px' },
    { id: 'it390', title: '计算机考试', sizeMM: '33×48 mm', pixel: '390×567 px' },
    { id: 'gaokao', title: '高考报名', sizeMM: '89×127 mm', pixel: '1050×1499 px' },
    { id: 'health', title: '健康证', sizeMM: '26×32 mm', pixel: '358×441 px' },
    { id: 'small', title: '小一寸', sizeMM: '22×32 mm', pixel: '260×378 px' },
    { id: 'big', title: '大二寸', sizeMM: '35×53 mm', pixel: '413×626 px' },
    { id: 'jiaozi', title: '教资面试报名', sizeMM: '35×49 mm', pixel: '413×579 px' },
    { id: 'cet', title: '英语四六级', sizeMM: '12×16 mm', pixel: '144×192 px' },
    { id: 'chuji', title: '初级会计考试报名', sizeMM: '35×49 mm', pixel: '413×579 px' },
    { id: 'shengkao', title: '省考报名', sizeMM: '35×49 mm', pixel: '413×579 px' },
    { id: 'law', title: '国家司法考试', sizeMM: '35×53 mm', pixel: '413×626 px' },
  ],
  general: [
    { id: '1inch', title: '一寸', sizeMM: '25×35 mm', pixel: '295×413 px' },
    { id: '2inch', title: '二寸', sizeMM: '35×49 mm', pixel: '413×579 px' },
    { id: '3inch', title: '小一寸', sizeMM: '22×32 mm', pixel: '260×378 px' },
    { id: '4inch', title: '大二寸', sizeMM: '35×53 mm', pixel: '413x626 px' },
    { id: '5inch', title: '大一寸', sizeMM: '33×48 mm', pixel: '390×567 px' },
    { id: '6inch', title: '小二寸', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: '7inch', title: '五寸', sizeMM: '89×127 mm', pixel: '1050×1499 px' },
    { id: '8inch', title: '三寸', sizeMM: '55×84 mm', pixel: '649×991 px' }
  ],
  medical: [
    { id: '1inch', title: '小一寸', sizeMM: '22×32 mm', pixel: '260×378 px' },
    { id: 'health', title: '健康证', sizeMM: '26×32 mm', pixel: '358×441 px' },
    { id: 'doctor', title: '执业医师资格证', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: 'nurse', title: '护士资格证考试', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: 'kaifu', title: '康复治疗师考试', sizeMM: '25×35 mm', pixel: '295×413 px' },
    { id: 'doctorReg', title: '执业医师注册', sizeMM: '33×40 mm', pixel: '385×441 px' },
  ],
  lang: [
    { id: 'cet', title: '英语四六级（144×192）', sizeMM: '12×16 mm', pixel: '144×192 px' },
    { id: 'putong', title: '普通话水平测试', sizeMM: '33×48 mm', pixel: '390×567 px' },
    { id: 'cet', title: '英语四六级考试', sizeMM: '33×48 mm', pixel: '390×567 px' },
    { id: 'xuewei', title: '学位英语', sizeMM: '33x48 mm', pixel: '390×567 px' },
    { id: 'gonggong', title: '公共英语考试', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: 'mets', title: 'METS医护英语水平考试', sizeMM: '35×38 mm', pixel: '300×450 px' },
    { id: 'huiyi', title: '医护英语', sizeMM: '25×38 mm', pixel: '300×450 px' },
  ],
  gov: [
    { id: 'law', title: '国家司法考试', sizeMM: '35×53 mm', pixel: '413×626 px' },
    { id: 'gk2', title: '国考报名（二寸）', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: 'gk', title: '国考', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: 'gk2', title: '国考报名（二寸）', sizeMM: '35×45 mm', pixel: '413×531 px' },
  ],
  job: [
    { id: 'teacher', title: '教师资格证', sizeMM: '30×41 mm', pixel: '360×480 px' },
    { id: 'doctorReg', title: '执业医师资格报名', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: 'nurse', title: '护士资格证考试', sizeMM: '35×45 mm', pixel: '413×531 px' },
    { id: 'shegong', title: '社工证', sizeMM: '25×35 mm', pixel: '295×413 px' },
    { id: 'doctor', title: '执业医师资格证', sizeMM: '25×35 mm', pixel: '295×413 px' },
    { id: 'veterinarian', title: '执业兽医资格证', sizeMM: '20×29 mm', pixel: '230×334 px' },
  ],
  degree: [
    { id: 'uni480', title: '大学生图像采集', sizeMM: '41×54 mm', pixel: '480×640 px' },
    { id: 'chengren', title: '成人自考', sizeMM: '41×54 mm', pixel: '480×640 px' },
    { id: 'zaizhi', title: '在职研究生考试', sizeMM: '41×54 mm', pixel: '390×567 px' },
    { id: 'gaokao', title: '高考报名', sizeMM: '89×127 mm', pixel: '1050×1499 px' },
    { id: 'computer', title: '计算机考试', sizeMM: '33×48 mm', pixel: '390×567 px' },
  ],
  visa: [
    { id: 'chinesePassport', title: '中国护照（大一寸）', sizeMM: '25×35 mm', pixel: '295×413 px' },
    { id: 'hkPassport', title: '港澳通行证（大一寸）', sizeMM: '33×48 mm', pixel: '390×567 px' },
    { id: 'taiwanPassport', title: '台湾通行证（大一寸）', sizeMM: '33×48 mm', pixel: '390×567 px' },
    { id: 'visa', title: '其他国家签证', sizeMM: '35×45 mm', pixel: '413×531 px' },
  ],
  arch: [
    { id: 'AC', title: '二级建造证', sizeMM: '25×35 mm', pixel: '295×413 px' },
    { id: 'PR', title: '一级建造师', sizeMM: '25×35 mm', pixel: '472×630 px' }
  ],
  collect: [
    { id: 'xuexin', title: '学信网', sizeMM: '41×54 mm', pixel: '480×640 px' },
    { id: 'xueji', title: '学籍照片', sizeMM: '33×41 mm', pixel: '390×480 px' },
    { id: 'biye', title: '毕业生图像信息采集', sizeMM: '35×51 mm', pixel: '480×605 px' },
    { id: 'uni480', title: '大学生图像信息采集', sizeMM: '41×54 mm', pixel: '480×640 px' },
  ],
  other: [
    { id: 'socialSecurity', title: '社保卡', sizeMM: '30×40 mm', pixel: '358×441 px' },
    { id: 'tuan', title: '团员证', sizeMM: '22×32 mm', pixel: '254×372 px' },
    { id: 'dang', title: '党员证', sizeMM: '34×51 mm', pixel: '400×600 px' },
  ]
}

const activeCat = ref<string | number>('hot')
const scrollTop = ref(0)
const currentList = computed(() => specMap[String(activeCat.value)] ?? specMap.hot)

function onCatChange() {
  // 切换分类时重置滚动位置
  scrollTop.value = 0
}

function onScroll(e: any) {
  // 可以在这里处理滚动事件，比如上拉加载更多
  console.log('滚动位置:', e.detail.scrollTop)
}

function goDetail(item: any) {
  uni.navigateTo({ url: `/pages/specifications/index?item=${JSON.stringify(item)}` })
}
</script>

<style scoped lang="scss">
.index-page {
  padding: 24rpx;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.spec-list {
  flex: 1;
  margin-top: 24rpx;
  height: 0; // 关键：让 flex 子元素正确计算高度
}

.spec-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .title {
    font-size: 28rpx;
    color: #111;
    flex: 1;
    margin-right: 16rpx;
  }

  .meta {
    color: #777;
    font-size: 24rpx;
    display: flex;
    gap: 24rpx;
    margin-right: 16rpx;
  }
}
</style>
