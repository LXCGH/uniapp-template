export default function impower() {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: "scope.bluetooth",
      success(res) {
        resolve({ code: "200" });
      },
      fail() {
        reject({ code: "400" });
        wx.showModal({
          title: "提示",
          content: "您未授权蓝牙，功能将无法使用",
          showCancel: true,
          confirmText: "授权",
          confirmColor: "#AF1F25",
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting["scope.bluetooth"]) {
                    wx.showModal({
                      title: "提示",
                      content: "您未授权蓝牙，功能将无法使用",
                      showCancel: false,
                      success: function (res) {},
                    });
                  } else {
                  }
                },
                fail: function () {
                  wx.showToast({
                    title: "蓝牙设置失败",
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
