export default {
  oa: {
    name: "假期助手",
    appid: "wx2d058e7b7a432d7b",
    mapNum: 102,
    tabBarConfig: {
      selectedColor: "#2979ff",
      color: "#999999",
      list: [
        {
          pagePath: "pages/index/index",
          text: "工作台",
          iconPath: "static/images/app/oa_tabs/home-inactive.png",
          selectedIconPath: "static/images/app/oa_tabs/home-active.png",
        },
        {
          pagePath: "pages/personal/index",
          text: "我的",
          iconPath: "static/images/app/oa_tabs/account-inactive.png",
          selectedIconPath: "static/images/app/oa_tabs/account-active.png",
        },
      ],
    },
  },
};
