<template>
  <view class="w-full">
    <wu-calendar
      :insert="true"
      type="week"
      :fold="false"
      :lunar="true"
      :selected="selected"
      @change="changeDate"
      @monthSwitch="switchMonth"
    ></wu-calendar>
  </view>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { getEmotion } from "@/tools/emotion";
import { useHomeStore } from "@/store/home";
import type { Response } from "@/api/interface/base";
import type { ReportEmotionResp } from "@/common/interface/emotion";
import { messageReportList } from "@/api/index";
import { getConfig } from "@/config/config";

const config = getConfig();
const homeStore = useHomeStore();

const emit = defineEmits(["onDateChange"]);

const selected = ref();

onLoad(() => {
  const month = homeStore.month;
  fetchEmotion(month);
});

function changeDate(date: { year: number; month: number; date: number; fulldate: string }) {
  homeStore.changeDate(date.fulldate);
  emit("onDateChange", date.fulldate);
}

// 这里有点问题，只能拿到年份和月份，无法拿到具体的日期，或哪几周
function switchMonth(date: { year: number; month: number; fullDate: string }) {
  const month = date.fullDate;

  if (homeStore.month == month) {
    return;
  }

  homeStore.month = month;

  setTimeout(() => {
    fetchEmotion(homeStore.month);
  }, 500);
}

function fetchEmotion(month: string) {
  const [start, end] = [
    dayjs(month).startOf("month").format("YYYY-MM-DD"),
    dayjs(month).endOf("month").format("YYYY-MM-DD"),
  ];

  messageReportList({
    startDate: start,
    endDate: end,
  })
    .then((res: any) => {
      if (res.statusCode == 200) {
        const data = res.data as Response<ReportEmotionResp>;
        const list = data.data.reportList;
        const result = [];
        for (const d of list) {
          const emotion = d.emotionType.split(",")[0];
          const date = d.reportDate;
          result.push({
            date,
            info: getEmotion(emotion),
          });
        }

        selected.value = result;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // uni.request({
  //   url: config.apiUrl + "/api/v1/toystory/wechat/message/report/list",
  //   data: {
  //     startDate: start,
  //     endDate: end,
  //   },
  //   success: (res) => {
  //     if (res.statusCode == 200) {
  //       const data = res.data as Response<ReportEmotionResp>;
  //       const list = data.data.reportList;
  //       const result = [];
  //       for (const d of list) {
  //         const emotion = d.emotionType.split(",")[0];
  //         const date = d.reportDate;
  //         result.push({
  //           date,
  //           info: getEmotion(emotion),
  //         });
  //       }

  //       selected.value = result;
  //     }
  //   },
  // });
}
</script>
