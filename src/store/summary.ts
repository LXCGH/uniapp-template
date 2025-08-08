import { defineStore } from 'pinia';
import type { SummaryResp, InsightMsg } from '@/api/interface/summary';
export const useSummaryStore = defineStore('summaryStore', {
  state: () => {
    return {
      summary: {} as SummaryResp
    };
  },
  actions: {
    setSummary(summary: SummaryResp) {
      this.summary = summary
    }
  },

  getters: {},
});