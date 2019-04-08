// pages/video/video.js
const app = getApp()

Page({


  data: {
    video: [{
      "videId": "vid1",
      "title": "Healthcare Industry",
      "description": "#",
      "content-url": "https://online.stanford.edu/courses/som-xcape110-strategies-debriefing-healthcare-scenarios",
      "thumb": "https://i.imgur.com/uxQcuqk.png"
    },
      {
        "videId": "vid2",
        "title": "Introduction to Python",
        "description": "#",
        "content-url": "https://online.stanford.edu/courses/xfds113-introduction-python",
        "thumb": "https://i.imgur.com/QGCBlNO.png"
      },
      {
        "videId": "vid3",
        "title": "Entrepreneurship",
        "description": "#",
        "content-url": "https://online.stanford.edu/programs/innovation-and-entrepreneurship-graduate-certificate",
        "thumb": "https://i.imgur.com/Orl6HO2.png"
      },      
      {
        "videId": "vid4",
        "title": "Cybersecurity",
        "description": "#",
        "content-url": "https://online.stanford.edu/programs/stanford-rev-program",
        "thumb": "https://i.imgur.com/2zNtMqF.png"
      }
    
    ],
    loggedIn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loggedIn: app.globalData.loggedIn
    })
    console.log(app.globalData)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loggedIn: app.globalData.loggedIn
    })
    console.log(app.globalData)

  },
  onPostTap: function (event) {
    // 获取本页面的id
    console.log(event.currentTarget)
    var url = event.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: './playback',
    })
  }

})