export default function impower() {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: "scope.record",
      success(res) {
        resolve({ code: "200" });
      },
      fail() {
        reject({ code: "400" });
        wx.showModal({
          title: "提示",
          content: "您未授权录音，功能将无法使用",
          showCancel: true,
          confirmText: "授权",
          confirmColor: "#AF1F25",
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting["scope.record"]) {
                    wx.showModal({
                      title: "提示",
                      content: "您未授权录音，功能将无法使用",
                      showCancel: false,
                      success: function (res) {},
                    });
                  } else {
                  }
                },
                fail: function () {
                  wx.showToast({
                    title: "授权设置录音失败",
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
