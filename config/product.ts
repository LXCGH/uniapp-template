export default {
  photo: {
    name: "照片生成助手",
    appid: "wx675bd104caf43925",
    mapNum: 100,
    tabBarConfig: {
      selectedColor: "#dd4238",
      color: "#999999",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "static/images/tabs/home-inactive.png",
          selectedIconPath: "static/images/tabs/home-active.png",
        },
        {
          pagePath: "pages/order/index",
          text: "订单",
          iconPath: "static/images/tabs/order-inactive.png",
          selectedIconPath: "static/images/tabs/order-active.png",
        },
        {
          pagePath: "pages/personal/index",
          text: "我的",
          iconPath: "static/images/tabs/account-inactive.png",
          selectedIconPath: "static/images/tabs/account-active.png",
        },
      ],
    },
  },
};
