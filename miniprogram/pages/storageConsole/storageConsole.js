// pages/storageConsole/storageConsole.js

const app = getApp()

Page({

  data: {
    fileID: '',
    cloudPath: '',
    imagePath: '',
  },

  onLoad: function (options) {

    const {
      fileID,
      cloudPath,
      imagePath,
    } = app.globalData

    this.setData({
      fileID,
      cloudPath,
      imagePath,
    })

    console.group('Documents')
    console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage.html')
    console.groupEnd()
  },

})