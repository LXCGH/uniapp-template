export default function impower() {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: "scope.userLocation",
      success(res) {
        resolve({ code: "200" });
      },
      fail() {
        reject({ code: "400" });
        wx.showModal({
          title: "提示",
          content: "您未授权定位，功能将无法使用",
          showCancel: true,
          confirmText: "授权",
          confirmColor: "#AF1F25",
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting["scope.userLocation"]) {
                    wx.showModal({
                      title: "提示",
                      content: "您未授权定位服务，功能将无法使用",
                      showCancel: false,
                      success: function (res) {},
                    });
                  } else {
                  }
                },
                fail: function () {
                  wx.showToast({
                    title: "定位授权失败",
                    icon: "error",
                    mask: true,
                  });
                },
              });
            } else if (res.cancel) {
            }
          },
          fail() {},
        });
      },
    });
  });
}
